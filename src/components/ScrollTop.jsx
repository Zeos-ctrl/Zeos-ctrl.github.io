import { useRef } from 'react'
import { useLenis } from 'lenis/react'

const R = 18
const CIRC = 2 * Math.PI * R // ring circumference

// Fixed bottom-right button: a ring that fills with page-scroll progress and
// returns to the top on click.
export default function ScrollTop() {
  const lenis = useLenis()
  const ringRef = useRef(null)

  // Update the ring imperatively each scroll frame (no re-render).
  useLenis(() => {
    const max = document.documentElement.scrollHeight - window.innerHeight
    const p = max > 0 ? Math.min(window.scrollY / max, 1) : 0
    if (ringRef.current) {
      ringRef.current.style.strokeDashoffset = String(CIRC * (1 - p))
    }
  })

  const toTop = () => {
    if (lenis) lenis.scrollTo(0)
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button className="scroll-top" onClick={toTop} aria-label="Back to top">
      <svg className="scroll-top__ring" viewBox="0 0 44 44" aria-hidden="true">
        <circle className="scroll-top__track" cx="22" cy="22" r={R} />
        <circle
          ref={ringRef}
          className="scroll-top__progress"
          cx="22"
          cy="22"
          r={R}
          style={{ strokeDasharray: CIRC, strokeDashoffset: CIRC }}
        />
      </svg>
      <svg
        className="scroll-top__arrow"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  )
}
