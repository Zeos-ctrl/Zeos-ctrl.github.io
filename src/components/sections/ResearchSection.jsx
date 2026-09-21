import { posts } from '@/data/posts.js'
import IndexList from '@/components/IndexList.jsx'

// The research list lives on the home page; each row links out to its own
// /research/:slug page.
export default function ResearchSection() {
  const items = posts.map((post) => ({
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

      <IndexList items={items} />
    </section>
  )
}
