// Shared helpers for turning Markdown files (with frontmatter) into post/chapter
// objects. Used by both posts.js and chapters.js.

// Turn a filename/title into a URL-safe slug, e.g. "Quantum Algorithms" →
// "quantum-algorithms".
export function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// Minimal parser for the YAML frontmatter subset our files use (key: value
// pairs plus simple "- item" lists). Returns the parsed data and the body.
export function parseFrontmatter(raw) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw)
  if (!match) return { data: {}, body: raw }

  const data = {}
  let currentKey = null
  for (const line of match[1].split(/\r?\n/)) {
    const listItem = /^\s*-\s+(.*)$/.exec(line)
    if (listItem && currentKey) {
      if (!Array.isArray(data[currentKey])) data[currentKey] = []
      data[currentKey].push(listItem[1].trim())
      continue
    }
    const pair = /^([A-Za-z0-9_]+):\s*(.*)$/.exec(line)
    if (pair) {
      const [, key, value] = pair
      currentKey = key
      data[key] = value === '' ? [] : value.trim()
    }
  }
  return { data, body: raw.slice(match[0].length) }
}

// Convert Obsidian image embeds — ![[file.png]] or ![[file.png|alt or width]] —
// into standard Markdown pointing at /<base>/. `base` is the public/ subfolder
// where the images live (e.g. "posts" or "chapters").
export function convertObsidianEmbeds(body, base = 'posts') {
  return body.replace(/!\[\[([^\]|]+?)(?:\|([^\]]*))?\]\]/g, (_, file, extra) => {
    const name = file.trim()
    const alt =
      extra && !/^\d+$/.test(extra.trim())
        ? extra.trim()
        : name.replace(/\.[a-z0-9]+$/i, '')
    return `![${alt}](/${base}/${encodeURI(name)})`
  })
}

// Strip Hugo shortcodes like {{< katex >}} and normalize Obsidian image embeds.
export function cleanBody(body, base = 'posts') {
  const withImages = convertObsidianEmbeds(body, base)
  return withImages.replace(/\{\{[<%][\s\S]*?[>%]\}\}/g, '').trim()
}

// First paragraph of the body, trimmed to a card-sized summary.
export function makeSummary(body, max = 160) {
  const firstPara = body.split(/\n\s*\n/).find((p) => p.trim())?.trim() ?? ''
  const text = firstPara.replace(/\s+/g, ' ')
  return text.length > max ? `${text.slice(0, max).trimEnd()}…` : text
}
