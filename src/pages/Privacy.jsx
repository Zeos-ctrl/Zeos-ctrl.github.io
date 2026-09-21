import { Link } from 'react-router-dom'

export default function Privacy() {
  return (
    <section className="page prose" style={{ maxWidth: '70ch' }}>
      <Link className="post__back" to="/">
        ← Back home
      </Link>
      <h1 className="page-title">Privacy Policy</h1>
      <p className="chapter-label">Last updated: 14 September 2026</p>

      <p>
        This site is a personal portfolio. It is designed to collect as little
        information as possible, and it does not require an account, sell data,
        or run advertising or analytics trackers.
      </p>

      <h2>Information handled on this site</h2>
      <p>
        The site has no backend of its own — pages and content are served as
        static files. It does not ask you for personal information and does not
        store any on a server.
      </p>
      <ul>
        <li>
          <strong>Theme preference.</strong> Your light/dark choice is saved in
          your browser's local storage so the site remembers it on your next
          visit. It never leaves your device.
        </li>
        <li>
          <strong>Server logs.</strong> Whoever hosts the site may keep standard
          web-server logs (such as IP address, browser type, and pages
          requested) for security and reliability. This is typical of all
          websites and is controlled by the hosting provider.
        </li>
      </ul>

      <h2>Camera &amp; gesture control</h2>
      <p>
        The optional hand-gesture control feature uses your device camera. It
        is:
      </p>
      <ul>
        <li>
          <strong>Off by default</strong> and only starts when you enable it
          from the navigation bar.
        </li>
        <li>
          <strong>Permission-gated</strong> — your browser will ask before the
          camera is accessed, and you can revoke access at any time.
        </li>
        <li>
          <strong>Processed entirely on your device.</strong> The hand-tracking
          model runs locally in your browser. Camera frames are analysed in
          memory to detect hand position and are <strong>never uploaded,
          transmitted, recorded, or stored</strong>.
        </li>
        <li>
          <strong>Stopped immediately</strong> when you turn the feature off or
          leave the page — the camera stream is released.
        </li>
      </ul>

      <h2>Third parties</h2>
      <p>
        The site self-hosts its assets (including the hand-tracking model) and
        does not embed third-party analytics or advertising. Outbound links
        (for example to GitHub or email) take you to services with their own
        privacy policies.
      </p>

      <h2>Your choices</h2>
      <p>
        You can clear the stored theme preference at any time through your
        browser's site-data settings, and you can decline or revoke camera
        access without affecting the rest of the site.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about this policy? Email{' '}
        <a href="mailto:astrilcodex@gmail.com">astrilcodex@gmail.com</a>.
      </p>

      <p>
        This policy may be updated from time to time; the date above reflects
        the latest revision.
      </p>
    </section>
  )
}
