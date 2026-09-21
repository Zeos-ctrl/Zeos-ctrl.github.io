import { Link } from 'react-router-dom'
import { formatDate } from '../utils/format.js'

// Summary card shown in the research/blog index. Links to the full post.
export default function PostCard({ post }) {
  const { slug, title, date, summary, tags } = post
  return (
    <article className="card">
      <time className="card__date" dateTime={date}>
        {formatDate(date)}
      </time>
      <h3 className="card__title">
        <Link to={`/research/${slug}`}>{title}</Link>
      </h3>
      <p className="card__desc">{summary}</p>

      {tags?.length > 0 && (
        <ul className="tags">
          {tags.map((tag) => (
            <li key={tag} className="tag">
              {tag}
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}
