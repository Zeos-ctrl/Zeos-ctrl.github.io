import Link from "next/link"

interface NavItem {
  label: string
  href: string
}

interface MarathonNavProps {
  items: NavItem[]
}

export default function MarathonNav({ items }: MarathonNavProps) {
  return (
    <nav className="flex items-center space-x-8">
      {items.map((item, index) => (
        <Link
          key={index}
          href={item.href}
          className="marathon-bracket-nav hover:text-neon transition-colors duration-200"
        >
          <span className="marathon-bracket-nav-left">[+]</span> {item.label}
        </Link>
      ))}
    </nav>
  )
}
