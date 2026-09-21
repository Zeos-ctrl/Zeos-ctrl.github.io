import { Link } from 'react-router-dom'

// One editorial row: index + year on top, a large title (with an optional
// short description on the right), then a meta line.
function Entry({ index, title, desc, meta, year, to, href }) {
  const inner = (
    <>
      <div className="entry__top">
        <span className="entry__index">{String(index).padStart(2, '0')}</span>
        <span className="entry__year">{year}</span>
      </div>
      <div className="entry__main">
        <h3 className="entry__title">{title}</h3>
        {desc && <p className="entry__desc">{desc}</p>}
      </div>
      {meta && <p className="entry__meta">{meta}</p>}
    </>
  )

  let body
  if (href) {
    body = (
      <a className="entry" href={href} target="_blank" rel="noreferrer">
        {inner}
      </a>
    )
  } else if (to) {
    body = (
      <Link className="entry" to={to}>
        {inner}
      </Link>
    )
  } else {
    body = <div className="entry">{inner}</div>
  }

  return <li>{body}</li>
}

// Big index list (à la pablomiguez.dev). Each item:
//   { key, title, meta?, year?, to? | href? }
export default function IndexList({ items }) {
  return (
    <ul className="entry-list" role="list">
      {items.map((item, i) => (
        <Entry key={item.key} index={i + 1} {...item} />
      ))}
    </ul>
  )
}
