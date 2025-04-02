"use client"

import { useState, useEffect } from "react"

interface SectionNavigationProps {
  sections: string[]
}

export default function SectionNavigation({ sections }: SectionNavigationProps) {
  const [activeSection, setActiveSection] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const windowHeight = window.innerHeight

      // Determine which section is currently in view
      sections.forEach((section, index) => {
        const element = document.getElementById(section)
        if (!element) return

        const rect = element.getBoundingClientRect()
        if (rect.top <= windowHeight / 2 && rect.bottom >= windowHeight / 2) {
          setActiveSection(index)
        }
      })
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Initial check

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [sections])

  const scrollToSection = (index: number) => {
    const section = document.getElementById(sections[index])
    if (section) {
      section.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="nav-dots">
      {sections.map((section, index) => (
        <div
          key={section}
          className={`nav-dot ${index === activeSection ? "active" : ""}`}
          onClick={() => scrollToSection(index)}
          aria-label={`Scroll to ${section} section`}
        />
      ))}
    </div>
  )
}

