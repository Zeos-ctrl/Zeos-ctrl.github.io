import { useEffect } from 'react'

// A single circular cursor that inverts the colors behind it (via CSS
// mix-blend-mode: difference) and grows over interactive elements. Rendered
// once at the app root; returns null and manages one DOM node imperatively.
export default function CustomCursor() {
  useEffect(() => {
    // Touch / no-hover devices have no pointer to follow — leave the native
    // behavior alone.
    const coarse = window.matchMedia('(pointer: coarse)').matches
    if (coarse) return

    const cursor = document.createElement('div')
    cursor.className = 'cursor'
    document.body.appendChild(cursor)
    document.body.classList.add('custom-cursor-active')

    let mx = window.innerWidth / 2
    let my = window.innerHeight / 2
    let cx = mx
    let cy = my
    let rafId

    // Center it on load so it doesn't flash in the corner.
    cursor.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`

    const onMove = (e) => {
      mx = e.clientX
      my = e.clientY
    }

    // Ease toward the pointer each frame for a smooth trailing feel.
    const loop = () => {
      cx += (mx - cx) * 0.2
      cy += (my - cy) * 0.2
      cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`
      rafId = requestAnimationFrame(loop)
    }

    const hoverSel = 'a, button, .btn, .card, [data-cursor="hover"]'
    const onOver = (e) => {
      if (e.target.closest(hoverSel)) cursor.classList.add('is-hover')
    }
    const onOut = (e) => {
      if (e.target.closest(hoverSel)) cursor.classList.remove('is-hover')
    }
    const onLeave = () => {
      cursor.style.opacity = '0'
    }
    const onEnter = () => {
      cursor.style.opacity = '1'
    }

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)
    loop()

    // Clean up on unmount (and StrictMode's dev double-mount) so we don't leak
    // listeners / RAF or leave duplicate cursors behind.
    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
      cursor.remove()
      document.body.classList.remove('custom-cursor-active')
    }
  }, [])

  return null
}
