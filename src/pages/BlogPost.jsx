import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'
import { getPostBySlug } from '../data/posts.js'
import { formatDate } from '../utils/format.js'

export default function BlogPost() {
  const { slug } = useParams()
  const post = getPostBySlug(slug)

  // If someone hits /research/does-not-exist, show a friendly message.
  if (!post) {
    return (
      <section className="page">
        <h1 className="page-title">Post not found</h1>
        <p>
          <Link to="/" state={{ scrollTo: 'research' }}>
            ← Back to research
          </Link>
        </p>
      </section>
    )
  }

  return (
    <article className="post page">
      <Link className="post__back" to="/" state={{ scrollTo: 'research' }}>
        ← Back to research
      </Link>

      {/* Large title header at the top of the post. */}
      <header className="post__header">
        <h1 className="post__title">{post.title}</h1>
        <div className="post__meta">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          {post.tags?.length > 0 && (
            <ul className="tags">
              {post.tags.map((tag) => (
                <li key={tag} className="tag">
                  {tag}
                </li>
              ))}
            </ul>
          )}
        </div>
      </header>

      {/* remark-gfm adds tables, strikethrough, task lists, etc.
          The img override adds lazy loading; styling is in global.css. */}
      <div className="prose">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeKatex]}
          components={{
            img: ({ node, ...props }) => <img loading="lazy" {...props} />,
          }}
        >
          {post.content}
        </ReactMarkdown>
      </div>
    </article>
  )
}
