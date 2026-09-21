import { Link } from 'react-router-dom'
import { chapters } from '../data/chapters.js'
import ScrambleList from '../components/ScrambleList.jsx'

// Chapter index for the story that the Directive introduces.
export default function Story() {
  const items = chapters.map((chapter) => ({
    key: chapter.slug,
    to: `/story/${chapter.slug}`,
    cells: [
      { text: chapter.title, className: 'scramble-cell--title' },
      { text: 'Read', className: 'scramble-cell--meta scramble-cell--right' },
    ],
  }))

  return (
    <section className="page">
      <Link className="post__back" to="/" state={{ scrollTo: 'directive' }}>
        ← Back to the Directive
      </Link>

      <h1 className="page-title">Chapters</h1>
      <p className="page-lead">The story continues beyond the Directive.</p>

      {chapters.length === 0 ? (
        <p>No chapters yet — check back soon.</p>
      ) : (
        <ScrambleList items={items} />
      )}
    </section>
  )
}
