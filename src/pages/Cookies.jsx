import { Link } from 'react-router-dom'

export default function Cookies() {
  return (
    <section className="page prose" style={{ maxWidth: '70ch' }}>
      <Link className="post__back" to="/">
        ← Back home
      </Link>
      <h1 className="page-title">Cookie Policy</h1>
      <p className="chapter-label">Last updated: 14 September 2026</p>

      <p>
        This site does not use cookies for tracking, advertising, or analytics.
        It uses a small amount of browser storage purely to make the site work
        the way you expect.
      </p>

      <h2>What is stored</h2>
      <ul>
        <li>
          <strong>Theme preference</strong> (local storage) — remembers your
          light/dark choice between visits. Functional; stays on your device.
        </li>
        <li>
          <strong>Gesture control state</strong> — the on/off toggle lives only
          in the page's memory for the current session and is not persisted.
        </li>
      </ul>

      <h2>Third-party cookies</h2>
      <p>
        The site embeds no third-party analytics, advertising, or social
        widgets, so no third-party cookies are set by it. Following an outbound
        link (e.g. GitHub) takes you to a service with its own cookie policy.
      </p>

      <h2>Managing storage</h2>
      <p>
        You can clear this site's local storage at any time via your browser's
        privacy or site-data settings. Doing so simply resets your theme
        preference to the default.
      </p>

      <h2>Contact</h2>
      <p>
        Questions? Email{' '}
        <a href="mailto:connor.bryan.0@proton.me">connor.bryan.0@proton.me</a>. See
        also the <Link to="/privacy">Privacy Policy</Link>.
      </p>
    </section>
  )
}
