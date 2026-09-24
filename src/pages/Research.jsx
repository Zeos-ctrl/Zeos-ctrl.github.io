import { Link } from 'react-router-dom'
import { posts } from '../data/posts.js'
import ScrambleList from '../components/ScrambleList.jsx'

// Full index of every post, linked from the Research section on the home page.
export default function Research() {
  const items = posts.map((post) => ({
    key: post.slug,
    to: `/research/${post.slug}`,
    cells: [
      { text: post.title, className: 'scramble-cell--title' },
      { text: 'Read', className: 'scramble-cell--meta scramble-cell--right' },
    ],
  }))

  return (
    <section className="page">
      <Link className="post__back" to="/" state={{ scrollTo: 'research' }}>
        ← Back to research
      </Link>

      <h1 className="page-title">Research</h1>
      <p className="page-lead">Write-ups, notes, and findings.</p>

      {posts.length === 0 ? (
        <p>No posts yet — check back soon.</p>
      ) : (
        <ScrambleList items={items} />
      )}
    </section>
  )
}
