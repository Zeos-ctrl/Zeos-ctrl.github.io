import { projects } from '@/data/projects.js'
import IndexList from '@/components/IndexList.jsx'
import ScrambleList from '@/components/ScrambleList.jsx'

// `compact`: the desktop floating page uses the chapter-style scramble rows.
export default function ProjectsSection({ compact = false }) {
  const items = projects.map((project) => ({
    key: project.id,
    title: project.title,
    desc: project.desc,
    meta: (project.tags || []).join(', '),
    year: project.year || '',
    href: project.demo || project.repo || undefined,
  }))

  return (
    <section id="projects" className="section">
      <h2 className="page-title">Projects</h2>
      <p className="page-lead">
        Software I've designed, built, or contributed to.
      </p>

      {compact ? (
        <ScrambleList
          items={items.map(({ key, title, meta, year, href }) => ({
            key,
            href,
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
    </section>
  )
}
