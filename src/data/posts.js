import { slugify, parseFrontmatter, cleanBody, makeSummary } from './markdown.js'

// Auto-loads every Markdown file in src/content/posts as raw text. Drop a new
// .md file in that folder (with frontmatter) and it shows up automatically —
// no edits needed here. `eager: true` inlines them at build time.
const modules = import.meta.glob('../content/posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

export const posts = Object.entries(modules)
  .map(([path, raw]) => {
    const { data, body } = parseFrontmatter(raw)
    const filename = path.split('/').pop().replace(/\.md$/, '')
    const content = cleanBody(body, 'posts')
    return {
      slug: slugify(filename),
      title: data.title || filename,
      date: data.date || '',
      tags: Array.isArray(data.tags) ? data.tags : [],
      draft: String(data.draft) === 'true',
      summary: makeSummary(content),
      content,
    }
  })
  .filter((post) => !post.draft) // hide drafts
  .sort((a, b) => (a.date < b.date ? 1 : -1)) // newest first

// Helper used by the individual post page to look up a post by its URL slug.
export function getPostBySlug(slug) {
  return posts.find((post) => post.slug === slug)
}
