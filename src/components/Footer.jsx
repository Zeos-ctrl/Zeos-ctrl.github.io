import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useLenis } from 'lenis/react'
import { RuixenGradientFooter } from '@/components/ui/ruixen-gradient-footer'

// "Cosmic spectrum" gradient: floor (offset 0) → top (offset 1), dark ember up
// through red-orange to a fading peach. The last stop uses 8-digit hex
// (#RRGGBBAA) with AA=00 for the transparent fade, matching how the SVG stop's
// stop-opacity="0" worked in the original.
const COSMOS_STOPS = [
  { offset: 0, color: '#0B0300' },
  { offset: 0.28, color: '#3D0A05' },
  { offset: 0.5, color: '#B01810' },
  { offset: 0.68, color: '#E8431C' },
  { offset: 0.85, color: '#FF9033' },
  { offset: 1, color: '#FFB06600' },
]

const EXPLORE = [
  { id: 'projects', label: 'Projects' },
  { id: 'research', label: 'Research' },
  { id: 'about', label: 'About' },
]

// Site footer: portfolio content composed on top of the gradient-glow primitive.
export default function Footer() {
  const year = new Date().getFullYear()
  const navigate = useNavigate()
  const location = useLocation()
  const lenis = useLenis()

  // Same behavior as the navbar: scroll to the home section, or route home and
  // let Home scroll there on mount.
  const goToSection = (e, id) => {
    e.preventDefault()
    if (location.pathname === '/') {
      const el = document.getElementById(id)
      if (el && lenis) lenis.scrollTo(el, { offset: -80 })
      else if (el) el.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/', { state: { scrollTo: id } })
    }
  }

  const linkClass =
    'text-muted-foreground transition-colors hover:text-foreground'

  return (
    <RuixenGradientFooter
      gradientHeight="40vh"
      minReveal={0}
      stops={COSMOS_STOPS}
    >
      <div className="mx-auto w-full max-w-3xl px-6 pt-12">
        <div className="grid gap-10 pb-10 sm:grid-cols-4">
          {/* Brand + tagline */}
          <div className="sm:col-span-2">
            <span className="text-sm uppercase tracking-widest text-foreground">
              Connor Bryan
            </span>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Software projects and research notes.
            </p>
          </div>

          {/* Explore — links to the home-page sections */}
          <nav className="text-xs uppercase tracking-wider">
            <h3 className="text-foreground">Explore</h3>
            <ul className="mt-4 flex flex-col gap-3">
              {EXPLORE.map((s) => (
                <li key={s.id}>
                  <a
                    href={`/#${s.id}`}
                    className={linkClass}
                    onClick={(e) => goToSection(e, s.id)}
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Elsewhere — external links, its own column */}
          <nav className="text-xs uppercase tracking-wider">
            <h3 className="text-foreground">Links</h3>
            <ul className="mt-4 flex flex-col gap-3">
              <li>
                <a
                  href="https://github.com/"
                  target="_blank"
                  rel="noreferrer"
                  className={linkClass}
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://https://www.linkedin.com/in/connor-bryan-oxford/"
                  target="_blank"
                  rel="noreferrer"
                  className={linkClass}
                >
                  Linkedin
                </a>
              </li>
              <li>
                <a href="mailto:astrilcodex@gmail.com" className={linkClass}>
                  Email
                </a>
              </li>
            </ul>
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-border/60 pb-2 pt-6 text-xs uppercase tracking-wider text-muted-foreground sm:flex-row">
          <span>© {year} Zeos Systems</span>
          <span className="flex items-center gap-4">
            <Link to="/privacy" className={linkClass}>
              Privacy
            </Link>
            <Link to="/cookies" className={linkClass}>
              Cookies
            </Link>
          </span>
        </div>
      </div>
    </RuixenGradientFooter>
  )
}
