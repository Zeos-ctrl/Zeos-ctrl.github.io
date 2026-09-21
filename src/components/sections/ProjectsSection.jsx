import { projects } from '@/data/projects.js'
import IndexList from '@/components/IndexList.jsx'

export default function ProjectsSection() {
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

      <IndexList items={items} />
    </section>
  )
}
