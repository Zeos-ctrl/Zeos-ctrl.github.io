// Presentational card for a single project. Receives one `project` object.
export default function ProjectCard({ project }) {
  const { title, description, tags, repo, demo } = project
  return (
    <article className="card">
      <h3 className="card__title">{title}</h3>
      <p className="card__desc">{description}</p>

      {tags?.length > 0 && (
        <ul className="tags">
          {tags.map((tag) => (
            <li key={tag} className="tag">
              {tag}
            </li>
          ))}
        </ul>
      )}

      <div className="card__links">
        {repo && (
          <a href={repo} target="_blank" rel="noreferrer">
            Code
          </a>
        )}
        {demo && (
          <a href={demo} target="_blank" rel="noreferrer">
            Live demo
          </a>
        )}
      </div>
    </article>
  )
}
