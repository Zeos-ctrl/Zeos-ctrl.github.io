import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="page">
      <h1 className="page-title">404 — Page not found</h1>
      <p>
        <Link to="/">← Back home</Link>
      </p>
    </section>
  )
}
