import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useLenis } from 'lenis/react'

const EASE = 'cubic-bezier(0.7, 0, 0.3, 1)'

// Full-screen "curtain" wipe between routes. It keeps the displayed page one
// step behind the URL so it can: (1) sweep a panel up to cover the old page,
// (2) swap the page underneath while hidden, (3) sweep the panel off the top
// to reveal the new page.
//
// Usage (render-prop hands back the location to render):
//   <PageTransition>
//     {(location) => <Routes location={location}>…</Routes>}
//   </PageTransition>
//
// Tweak the effect via props — everything about the wipe lives here.
export default function PageTransition({
  children,
  coverMs = 350, // time for the panel to cover the screen
  revealMs = 450, // time for the panel to sweep away
  color = 'hsl(var(--foreground))', // curtain color; theme-aware (white in dark, dark in light)
}) {
  const location = useLocation()
  const lenis = useLenis()
  const [displayLocation, setDisplayLocation] = useState(location)
  // 'idle' | 'cover' | 'reveal'
  const [stage, setStage] = useState('idle')

  // If the destination targets a section (navbar-from-another-page or #hash),
  // Home will scroll there itself — so don't fight it by forcing the top.
  const hasSectionTarget = Boolean(location.state?.scrollTo || location.hash)

  // Reset scroll to the top of the new page. `immediate` skips the smooth
  // animation — we do this while the curtain hides it, so it's not seen.
  const scrollToTop = () => {
    if (hasSectionTarget) return
    if (lenis) lenis.scrollTo(0, { immediate: true })
    else window.scrollTo(0, 0)
  }

  useEffect(() => {
    // Same page (e.g. a hash change) — nothing to animate.
    if (location.pathname === displayLocation.pathname) return

    // Respect reduced-motion: swap instantly, no wipe.
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setDisplayLocation(location)
      scrollToTop()
      return
    }

    setStage('cover')
    const coverTimer = setTimeout(() => {
      setDisplayLocation(location) // swap the page while it's hidden
      scrollToTop()
      setStage('reveal')
    }, coverMs)
    const doneTimer = setTimeout(() => setStage('idle'), coverMs + revealMs)

    // Cancel the sequence if the user navigates again mid-wipe.
    return () => {
      clearTimeout(coverTimer)
      clearTimeout(doneTimer)
    }
    // Only react to URL changes; displayLocation is updated internally.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, coverMs, revealMs])

  // Panel position + timing derived from the current stage.
  const transform =
    stage === 'cover'
      ? 'translateY(0)' // fully covering
      : stage === 'reveal'
        ? 'translateY(-100%)' // gone off the top
        : 'translateY(100%)' // idle: parked off-screen below
  const duration = stage === 'cover' ? coverMs : stage === 'reveal' ? revealMs : 0

  return (
    <>
      <div
        className="page-wipe"
        aria-hidden="true"
        style={{
          background: color,
          transform,
          // No transition while idle so the reset below the screen is instant.
          transition: duration ? `transform ${duration}ms ${EASE}` : 'none',
        }}
      />
      {typeof children === 'function' ? children(displayLocation) : children}
    </>
  )
}
