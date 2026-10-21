import { Link } from 'react-router-dom'
import { posts } from '@/data/posts.js'
import IndexList from '@/components/IndexList.jsx'
import ScrambleList from '@/components/ScrambleList.jsx'

// The research list lives on the home page; each row links out to its own
// /research/:slug page. Only the three most recent show here — the full index
// lives at /research.
// `compact`: the desktop floating page uses the chapter-style scramble rows.
export default function ResearchSection({ compact = false }) {
  const items = posts.slice(0, 3).map((post) => ({
    key: post.slug,
    title: post.title,
    meta: post.tags.join(', '),
    year: post.date ? new Date(post.date).getFullYear() : '',
    to: `/research/${post.slug}`,
  }))

  return (
    <section id="research" className="section">
      <h2 className="page-title">Research</h2>
      <p className="page-lead">Write-ups, notes, and findings.</p>

      {compact ? (
        <ScrambleList
          items={items.map(({ key, title, meta, year, to }) => ({
            key,
            to,
            cells: [
              { text: title, className: 'scramble-cell--title' },
              { text: meta, className: 'scramble-cell--meta' },
              { text: String(year), className: 'scramble-cell--meta scramble-cell--right' },
            ],
          }))}
        />
      ) : (
        <IndexList items={items} />
      )}

      {posts.length > 3 && (
        <p className="read-more">
          <Link to="/research">Read more →</Link>
        </p>
      )}
    </section>
  )
}
