import { slugify, parseFrontmatter, cleanBody, makeSummary } from './markdown.js'

// Auto-loads every Markdown file in src/content/chapters. Add a chapter by
// dropping a .md file there with frontmatter: `title`, `order` (for sequence),
// optional `summary` and `draft`. Images go in public/chapters/.
const modules = import.meta.glob('../content/chapters/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

export const chapters = Object.entries(modules)
  .map(([path, raw]) => {
    const { data, body } = parseFrontmatter(raw)
    const filename = path.split('/').pop().replace(/\.md$/, '')
    const content = cleanBody(body, 'chapters')
    return {
      slug: slugify(filename),
      title: data.title || filename,
      order: Number(data.order) || 0,
      draft: String(data.draft) === 'true',
      summary: data.summary || makeSummary(content),
      content,
    }
  })
  .filter((chapter) => !chapter.draft)
  .sort((a, b) => a.order - b.order) // chapter order, ascending

export function getChapterBySlug(slug) {
  return chapters.find((chapter) => chapter.slug === slug)
}
