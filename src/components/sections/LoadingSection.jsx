import { useRef, useState } from 'react'
import { useLenis } from 'lenis/react'
import Logo from '../Logo.jsx'

// Boot-log lines, printed one by one as the progress bar fills.
const LOG_LINES = [
  'Establishing uplink to Phobos',
  'Decrypting research archive',
  'Calibrating anomaly containment field',
  'Loading research modules',
  'System ready',
]

const WELCOME_SUBTITLE = 'Software projects and research from the frontier.'

// ASCII-art banner (figlet "Standard" — "ZEOS"). String.raw keeps backslashes
// literal so the art isn't mangled.
const BANNER = String.raw`
 _____ _____ ___  ____
|__  /| ____/ _ \/ ___|
  / / |  _|| | | \___ \
 / /_ | |__| |_| |___) |
/____||_____\___/|____/
`.replace(/^\n/, '')

const BAR_CELLS = 22
const clamp01 = (v) => Math.max(0, Math.min(1, v))

// A pinned two-beat sequence, driven by scroll position (via Lenis). Both beats
// occupy the same centered spot and cross-fade in order:
//
//   0.00–0.08  boot fades in
//   0.10–0.38  boot log prints + progress bar fills to 100%
//   0.42–0.50  boot fades out
//   0.55–0.63  welcome fades in
//   0.63–0.92  welcome holds
//   0.92–1.00  welcome fades out
export default function LoadingSection() {
  const scrollRef = useRef(null)
  const [p, setP] = useState(0)

  useLenis(() => {
    const el = scrollRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const distance = rect.height - window.innerHeight // scrollable pin length
    setP(distance > 0 ? clamp01(-rect.top / distance) : 0)
  })

  // Beat 1: boot terminal.
  const bootOpacity = Math.min(clamp01(p / 0.08), clamp01((0.5 - p) / 0.08))
  const bar = clamp01((p - 0.1) / 0.28) // fills 0→100% between p=0.10 and 0.38
  const pct = Math.round(bar * 100)
  const visibleCount = Math.ceil(bar * LOG_LINES.length)

  // Beat 2: welcome message.
  const welcomeOpacity = Math.min(
    clamp01((p - 0.55) / 0.08),
    clamp01((1 - p) / 0.08),
  )

  const filled = Math.round((pct / 100) * BAR_CELLS)
  const barStr = '█'.repeat(filled) + '░'.repeat(BAR_CELLS - filled)

  return (
    <div ref={scrollRef} className="loading-scroll">
      <section id="loading" className="loading-sticky">
        <div
          className="terminal"
          style={{
            opacity: bootOpacity,
            transform: `scale(${0.98 + bootOpacity * 0.02})`,
          }}
        >
          <div className="terminal__bar">
            <span className="terminal__dot terminal__dot--red" />
            <span className="terminal__dot terminal__dot--yellow" />
            <span className="terminal__dot terminal__dot--green" />
            <span className="terminal__title">visitor@zeos: ~/contact</span>
          </div>

          <div className="terminal__body">
            <div className="term-line">
              <span className="term-user">visitor@zeos</span>
              <span className="term-sep">:</span>
              <span className="term-path">~</span>
              <span className="term-sep">$</span> ./contact.sh
            </div>

            <pre className="term-banner">{BANNER}</pre>

            {LOG_LINES.slice(0, visibleCount).map((line) => (
              <div key={line} className="term-line">
                <span className="term-ok">[ ok ]</span> {line}
              </div>
            ))}

            <div className="term-line term-progress">
              [{barStr}] {String(pct).padStart(3, ' ')}%
            </div>

            <div className="term-line">
              <span className="term-user">visitor@zeos</span>
              <span className="term-sep">:</span>
              <span className="term-path">~</span>
              <span className="term-sep">$</span>{' '}
              {pct >= 100 ? 'connection established ' : ''}
              <span className="term-cursor">▋</span>
            </div>
          </div>
        </div>

        {/* Beat 2: appears after the boot terminal has faded out. */}
        <div
          className="loading-welcome"
          style={{
            opacity: welcomeOpacity,
            transform: `scale(${0.98 + welcomeOpacity * 0.02})`,
          }}
        >
          <Logo className="loading-welcome__logo" title="Zeos Systems" />
          <p className="loading-welcome__subtitle">{WELCOME_SUBTITLE}</p>
        </div>
      </section>
    </div>
  )
}
