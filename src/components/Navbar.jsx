import { useState, useEffect } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { LayoutGroup, motion } from 'framer-motion'
import { useLenis } from 'lenis/react'
import Logo from './Logo.jsx'
import { useGesture } from './GestureContext.jsx'
import { cn } from '@/lib/utils'

const SECTIONS = [
  { id: 'directive', label: 'Directive' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'research', label: 'Research' },
]

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const lenis = useLenis()
  const { enabled: gestureOn, toggle: toggleGesture } = useGesture()
  const [activeId, setActiveId] = useState(null)
  const [theme, setTheme] = useState('dark')
  const [menuOpen, setMenuOpen] = useState(false)

  // Close the mobile menu on any click/tap outside the notch.
  useEffect(() => {
    if (!menuOpen) return
    const onDocClick = (e) => {
      if (!e.target.closest('.notch')) setMenuOpen(false)
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [menuOpen])

  // On mount, honor a stored theme preference (index.html defaults to dark).
  useEffect(() => {
    const stored = localStorage.getItem('theme')
    if (stored) {
      document.documentElement.classList.toggle('dark', stored === 'dark')
      setTheme(stored)
    } else {
      setTheme(
        document.documentElement.classList.contains('dark') ? 'dark' : 'light',
      )
    }
  }, [])

  const toggleTheme = () => {
    setTheme((t) => {
      const next = t === 'dark' ? 'light' : 'dark'
      document.documentElement.classList.toggle('dark', next === 'dark')
      localStorage.setItem('theme', next)
      return next
    })
  }

  // Scrollspy: highlight the section currently in view (home only). Functional
  // setters let React bail out when the value is unchanged (no per-frame render).
  useLenis(() => {
    if (location.pathname !== '/') {
      setActiveId((prev) => (prev === null ? prev : null))
      return
    }
    const offset = 140 // a bit below the notch
    let current = null
    for (const s of SECTIONS) {
      const el = document.getElementById(s.id)
      if (el && el.getBoundingClientRect().top <= offset) current = s.id
    }
    setActiveId((prev) => (prev === current ? prev : current))
  })

  const goToSection = (e, id) => {
    e.preventDefault()
    setMenuOpen(false)
    if (location.pathname === '/') {
      const el = document.getElementById(id)
      if (el && lenis) lenis.scrollTo(el, { offset: -80 })
      else if (el) el.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/', { state: { scrollTo: id } })
    }
  }

  const goHome = (e) => {
    setMenuOpen(false)
    // Already home → smooth-scroll to the top instead of a no-op navigation.
    if (location.pathname === '/') {
      e.preventDefault()
      if (lenis) lenis.scrollTo(0)
      else window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <header className="navbar">
      <nav className="notch">
        <NavLink
          to="/"
          className="notch__brand"
          aria-label="Home"
          onClick={goHome}
        >
          <Logo className="notch__logo" />
        </NavLink>
        <span className="notch__divider" aria-hidden="true" />

        {/* Hamburger — only shown on mobile (see global.css). */}
        <button
          type="button"
          className="notch__menu"
          aria-label="Menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
            {menuOpen ? (
              <>
                <line x1="4" y1="4" x2="16" y2="16" stroke="currentColor" strokeWidth="1.6" />
                <line x1="16" y1="4" x2="4" y2="16" stroke="currentColor" strokeWidth="1.6" />
              </>
            ) : (
              <>
                <line x1="3" y1="7" x2="17" y2="7" stroke="currentColor" strokeWidth="1.6" />
                <line x1="3" y1="13" x2="17" y2="13" stroke="currentColor" strokeWidth="1.6" />
              </>
            )}
          </svg>
        </button>

        <LayoutGroup>
          <div className={cn('notch__items', menuOpen && 'is-open')}>
            {SECTIONS.map((s) => {
              const active = activeId === s.id
              return (
                <a
                  key={s.id}
                  href={`/#${s.id}`}
                  className={cn('notch__item', active && 'notch__item--active')}
                  onClick={(e) => goToSection(e, s.id)}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="notch__pill"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="notch__label">{s.label}</span>
                </a>
              )
            })}
          </div>
        </LayoutGroup>

        <span className="notch__divider" aria-hidden="true" />
        <button
          type="button"
          className={cn('notch__icon-btn', gestureOn && 'is-active')}
          onClick={toggleGesture}
          aria-pressed={gestureOn}
          aria-label="Toggle hand-gesture control"
          title="Hand-gesture control (uses your camera)"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
            <path
              d="M8 11V6a1.5 1.5 0 013 0v4m0-4.5a1.5 1.5 0 013 0V10m0-3a1.5 1.5 0 013 0v6a6 6 0 01-6 6h-1.5a5 5 0 01-3.9-1.9l-2.2-2.8a1.6 1.6 0 012.4-2.1L11 13"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <button
          type="button"
          className="notch__theme"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          <span className="theme-dot" />
        </button>
      </nav>
    </header>
  )
}
