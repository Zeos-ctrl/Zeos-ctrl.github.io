import { useRef } from 'react'
import { Link } from 'react-router-dom'

// Characters used while a cell "decodes" on hover.
const CHARS = 'ABCDEF0123456789#%&/\\<>*+=[]{}'

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Animate an element's text from scrambled → final, resolving left to right.
function scramble(el, finalText, duration = 550) {
  if (!el) return
  cancelAnimationFrame(el._scrambleRaf)
  if (prefersReducedMotion()) {
    el.textContent = finalText
    return
  }
  const len = finalText.length
  const start = performance.now()
  const tick = (now) => {
    const t = Math.min((now - start) / duration, 1)
    const resolved = Math.floor(t * len)
    let out = ''
    for (let i = 0; i < len; i++) {
      const ch = finalText[i]
      if (i < resolved || ch === ' ') out += ch
      else out += CHARS[(Math.random() * CHARS.length) | 0]
    }
    el.textContent = out
    if (t < 1) el._scrambleRaf = requestAnimationFrame(tick)
    else el.textContent = finalText
  }
  el._scrambleRaf = requestAnimationFrame(tick)
}

function reset(el, text) {
  if (!el) return
  cancelAnimationFrame(el._scrambleRaf)
  el.textContent = text
}

// One row. `cells` is [{ text, className }]. Links out via `to` (router),
// `href` (external), or renders a plain row if neither is given.
function Row({ cells, to, href }) {
  const refs = useRef([])

  const onEnter = () => cells.forEach((c, i) => scramble(refs.current[i], c.text))
  const onLeave = () => cells.forEach((c, i) => reset(refs.current[i], c.text))

  const inner = cells.map((c, i) => (
    <span
      key={i}
      ref={(el) => (refs.current[i] = el)}
      className={`scramble-cell ${c.className || ''}`}
    >
      {c.text}
    </span>
  ))

  const handlers = { onMouseEnter: onEnter, onMouseLeave: onLeave }

  let link
  if (href) {
    link = (
      <a href={href} target="_blank" rel="noreferrer" className="scramble-link" {...handlers}>
        {inner}
      </a>
    )
  } else if (to) {
    link = (
      <Link to={to} className="scramble-link" {...handlers}>
        {inner}
      </Link>
    )
  } else {
    link = (
      <div className="scramble-link" {...handlers}>
        {inner}
      </div>
    )
  }

  return <li className="scramble-row">{link}</li>
}

// Minimal row list with a scramble-on-hover reveal. Each item:
//   { key, to?, href?, cells: [{ text, className }] }
export default function ScrambleList({ items }) {
  return (
    <ul className="scramble-list" role="list">
      {items.map((item) => (
        <Row key={item.key} cells={item.cells} to={item.to} href={item.href} />
      ))}
    </ul>
  )
}
