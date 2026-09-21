import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { chapters, getChapterBySlug } from '../data/chapters.js'

// A single chapter. Renders its Markdown, with prev/next links.
export default function StoryChapter() {
  const { slug } = useParams()
  const chapter = getChapterBySlug(slug)

  if (!chapter) {
    return (
      <section className="page">
        <h1 className="page-title">Chapter not found</h1>
        <p>
          <Link to="/story">← All chapters</Link>
        </p>
      </section>
    )
  }

  const index = chapters.findIndex((c) => c.slug === slug)
  const prev = chapters[index - 1]
  const next = chapters[index + 1]

  return (
    <article className="post page">
      <Link className="post__back" to="/story">
        ← All chapters
      </Link>

      <header className="post__header">
        <h1 className="post__title">{chapter.title}</h1>
      </header>

      <div className="prose">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            img: ({ node, ...props }) => <img loading="lazy" {...props} />,
          }}
        >
          {chapter.content}
        </ReactMarkdown>
      </div>

      <nav className="chapter-nav">
        {prev ? (
          <Link to={`/story/${prev.slug}`}>← {prev.title}</Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link to={`/story/${next.slug}`}>{next.title} →</Link>
        ) : (
          <span />
        )}
      </nav>
    </article>
  )
}
