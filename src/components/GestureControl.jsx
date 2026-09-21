import { useEffect, useRef, useState } from 'react'
import { useLenis } from 'lenis/react'
import { useGesture } from './GestureContext.jsx'

// Self-hosted MediaPipe assets (see public/mediapipe/). Everything runs
// on-device — no frames leave the browser.
const WASM_PATH = '/mediapipe/wasm'
const MODEL_PATH = '/mediapipe/hand_landmarker.task'

const PINCH_ON = 0.4 // thumb–index distance / hand size below this = pinch
const SMOOTH = 0.3 // low-pass factor for the cursor (lower = smoother, more lag)
const VEL_SMOOTH = 0.5 // smoothing for the swipe velocity estimate
const SCROLL_FACTOR = 2.6 // pinch-drag hand px → scroll px
const DEADZONE = 0.5 // ignore sub-pixel hand jitter when scrolling
const SWIPE_THRESHOLD = 14 // smoothed px/frame speed that counts as a swipe
const SWIPE_COOLDOWN = 500 // ms between swipe interactions
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y)

// Hand-gesture control: pinch to click, pinch-and-drag to scroll. Off by
// default; only touches the camera while `enabled` (toggled from the navbar).
export default function GestureControl() {
  const { enabled, setEnabled } = useGesture()
  const lenis = useLenis()
  const [status, setStatus] = useState('idle') // idle|loading|active|denied|error
  const videoRef = useRef(null)
  const cursorRef = useRef(null)

  useEffect(() => {
    if (!enabled) {
      setStatus('idle')
      return
    }

    let landmarker
    let stream
    let raf
    let cancelled = false

    // Gesture state across frames.
    let pinching = false
    let sx = null // smoothed cursor position (0–1)
    let sy = null
    let prevCx = null // previous smoothed cursor px (for velocity)
    let prevCy = null
    let velX = 0 // smoothed velocity (px/frame)
    let velY = 0
    let lastY = null // for pinch-drag scroll
    let scrollTarget = null
    let lastSwipe = 0 // timestamp of the last swipe interaction
    const posHist = [] // recent cursor positions (for swipe aim)

    const video = videoRef.current
    const cursor = cursorRef.current

    async function createLandmarker(vision, HandLandmarker) {
      const base = { modelAssetPath: MODEL_PATH }
      try {
        return await HandLandmarker.createFromOptions(vision, {
          baseOptions: { ...base, delegate: 'GPU' },
          runningMode: 'VIDEO',
          numHands: 1,
        })
      } catch {
        // Fall back to CPU if the GPU delegate isn't available.
        return await HandLandmarker.createFromOptions(vision, {
          baseOptions: { ...base, delegate: 'CPU' },
          runningMode: 'VIDEO',
          numHands: 1,
        })
      }
    }

    async function start() {
      setStatus('loading')
      try {
        const { HandLandmarker, FilesetResolver } = await import(
          '@mediapipe/tasks-vision'
        )
        const vision = await FilesetResolver.forVisionTasks(WASM_PATH)
        landmarker = await createLandmarker(vision, HandLandmarker)

        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 320, height: 240, facingMode: 'user' },
          audio: false,
        })
        if (cancelled) return cleanup()
        video.srcObject = stream
        await video.play()
        setStatus('active')
        loop()
      } catch (err) {
        console.error('Gesture control failed:', err)
        setStatus(err?.name === 'NotAllowedError' ? 'denied' : 'error')
      }
    }

    function loop() {
      if (cancelled || !landmarker || !video) return
      if (video.readyState >= 2) {
        try {
          handle(landmarker.detectForVideo(video, performance.now()))
        } catch {
          /* transient detect errors are non-fatal */
        }
      }
      raf = requestAnimationFrame(loop)
    }

    function handle(res) {
      const hands = res?.landmarks
      if (!hands || hands.length === 0) {
        if (cursor) cursor.style.opacity = '0'
        pinching = false
        sx = null
        sy = null
        prevCx = null
        prevCy = null
        velX = 0
        velY = 0
        lastY = null
        posHist.length = 0
        return
      }
      const lm = hands[0]
      const wrist = lm[0]
      const thumbTip = lm[4]
      const indexTip = lm[8]
      const middleMcp = lm[9]

      // Low-pass filter the fingertip (mirror x for a selfie view) so the cursor
      // and scroll input aren't jittery from raw tracking noise.
      const rawX = 1 - indexTip.x
      const rawY = indexTip.y
      if (sx === null) {
        sx = rawX
        sy = rawY
      } else {
        sx += (rawX - sx) * SMOOTH
        sy += (rawY - sy) * SMOOTH
      }
      const cx = sx * window.innerWidth
      const cy = sy * window.innerHeight
      if (cursor) {
        cursor.style.opacity = '1'
        cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`
      }

      // Smoothed velocity, plus a short position history so a swipe clicks
      // where the hand aimed *before* the flick displaced the cursor.
      if (prevCx === null) {
        prevCx = cx
        prevCy = cy
      }
      const vx = cx - prevCx
      const vy = cy - prevCy
      prevCx = cx
      prevCy = cy
      velX = velX * (1 - VEL_SMOOTH) + vx * VEL_SMOOTH
      velY = velY * (1 - VEL_SMOOTH) + vy * VEL_SMOOTH
      const aim = posHist.length ? posHist[0] : { x: cx, y: cy }
      posHist.push({ x: cx, y: cy })
      if (posHist.length > 6) posHist.shift()

      const handSize = dist(wrist, middleMcp) || 1e-4
      const isPinch = dist(thumbTip, indexTip) / handSize < PINCH_ON
      const now = performance.now()

      // Pinch + move = scroll (inverted: move hand down → page scrolls up).
      if (isPinch && !pinching) {
        pinching = true
        lastY = cy
        scrollTarget = lenis?.actualScroll ?? window.scrollY
        cursor?.classList.add('is-pinch')
      } else if (isPinch && pinching) {
        const dy = cy - lastY
        lastY = cy
        if (Math.abs(dy) > DEADZONE) {
          scrollTarget = Math.max(0, scrollTarget - dy * SCROLL_FACTOR)
          if (lenis) lenis.scrollTo(scrollTarget, { immediate: true })
          else window.scrollTo(0, scrollTarget)
        }
      } else if (!isPinch && pinching) {
        pinching = false
        cursor?.classList.remove('is-pinch')
      }

      // Swipe RIGHT (fast horizontal flick, open hand) = interact/click where
      // you aimed. Requiring rightward + horizontal-dominant motion keeps it
      // from firing during vertical scrolls/aiming.
      if (
        !pinching &&
        velX > SWIPE_THRESHOLD &&
        velX > Math.abs(velY) * 2 &&
        now - lastSwipe > SWIPE_COOLDOWN
      ) {
        lastSwipe = now
        clickAt(aim.x, aim.y)
      }
    }

    function clickAt(x, y) {
      const el = document.elementFromPoint(x, y)
      if (!el) return
      const target = el.closest('a, button, [role="button"], input, label') || el
      target.click?.()
    }

    function cleanup() {
      cancelled = true
      if (raf) cancelAnimationFrame(raf)
      if (stream) stream.getTracks().forEach((t) => t.stop())
      if (landmarker) landmarker.close?.()
      if (video) video.srcObject = null
    }

    start()
    return cleanup
  }, [enabled, lenis])

  // Press Escape to exit gesture mode and return to normal input.
  useEffect(() => {
    if (!enabled) return
    const onKey = (e) => {
      if (e.key === 'Escape') setEnabled(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [enabled, setEnabled])

  // Hide the mouse cursor while gestures are actually driving the page (but not
  // if permission was denied/errored, so the user can still toggle it off).
  useEffect(() => {
    const active = enabled && status === 'active'
    document.body.classList.toggle('gesture-active', active)
    return () => document.body.classList.remove('gesture-active')
  }, [enabled, status])

  return (
    <>
      {/* Small live preview so the camera state is always visible (privacy). */}
      <video
        ref={videoRef}
        className={`gesture-video ${enabled ? 'is-on' : ''}`}
        playsInline
        muted
        aria-hidden="true"
      />
      {enabled && (
        <>
          <div ref={cursorRef} className="gesture-cursor" aria-hidden="true" />
          <div className="gesture-status" role="status">
            {status === 'loading' && 'Starting camera…'}
            {status === 'active' &&
              'Gesture control on — pinch & move to scroll, swipe right to select, Esc to exit'}
            {status === 'denied' && 'Camera permission denied'}
            {status === 'error' && 'Gesture control unavailable'}
          </div>
        </>
      )}
    </>
  )
}
