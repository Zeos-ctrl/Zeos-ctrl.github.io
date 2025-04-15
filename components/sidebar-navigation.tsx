"use client"

import { useState, useEffect } from "react"

interface SidebarNavigationProps {
  sections: { id: string; label: string }[]
}

export default function SidebarNavigation({ sections }: SidebarNavigationProps) {
  const [activeSection, setActiveSection] = useState("")
  const [isMobile, setIsMobile] = useState(false)
  const [hoveredSection, setHoveredSection] = useState<string | null>(null)

  // Check if mobile on mount and when window resizes or orientation changes
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)
    window.addEventListener("orientationchange", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
      window.removeEventListener("orientationchange", checkIfMobile)
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      // Get all section elements
      const sectionElements = sections.map(({ id }) => document.getElementById(id)).filter(Boolean)

      // Get viewport height and current scroll position
      const viewportHeight = window.innerHeight
      const scrollY = window.scrollY

      // Calculate which section is most visible in the viewport
      let maxVisibleSection = ""
      let maxVisibleRatio = 0

      sectionElements.forEach((element) => {
        if (!element) return

        const rect = element.getBoundingClientRect()
        const sectionHeight = rect.height

        // Calculate how much of the section is visible in the viewport
        const visibleTop = Math.max(0, rect.top)
        const visibleBottom = Math.min(viewportHeight, rect.bottom)
        const visibleHeight = Math.max(0, visibleBottom - visibleTop)

        // Calculate the ratio of visibility (0 to 1)
        const visibilityRatio = visibleHeight / Math.min(sectionHeight, viewportHeight)

        // If this section has more visible area than previous max, update
        if (visibilityRatio > maxVisibleRatio) {
          maxVisibleRatio = visibilityRatio
          maxVisibleSection = element.id
        }
      })

      // Update active section if we found one with sufficient visibility
      if (maxVisibleSection && maxVisibleSection !== activeSection) {
        setActiveSection(maxVisibleSection)
      }
    }

    window.addEventListener("scroll", handleScroll)
    // Initial check with a slight delay to ensure DOM is ready
    setTimeout(handleScroll, 200)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [sections, activeSection])

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id)
    if (section) {
      // Use smooth scrolling with a slight offset for the header
      const headerOffset = 80 // Adjust based on your header height
      const elementPosition = section.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }
  }

  // Mobile navigation on the left side - ultra thin version
  if (isMobile) {
    return (
      <div className="fixed left-1 top-1/2 transform -translate-y-1/2 z-50">
        <div className="bg-black/70 backdrop-blur-sm border border-white/10 rounded-lg py-3 px-1 flex flex-col space-y-5">
          {sections.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollToSection(id)}
              className="flex items-center"
              aria-label={`Scroll to ${label} section`}
              title={label}
            >
              <div
                className={`w-1 h-6 rounded-full transition-all duration-300 ${
                  activeSection === id ? "bg-neon" : "bg-white/20 hover:bg-white/40"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    )
  }

  // Desktop sidebar navigation - matching mobile style with hover labels
  return (
    <div className="fixed left-8 top-1/2 transform -translate-y-1/2 z-50 hidden lg:block">
      <div className="bg-black/70 backdrop-blur-sm border border-white/10 rounded-lg py-3 px-1 flex flex-col space-y-5">
        {sections.map(({ id, label }) => (
          <div
            key={id}
            className="relative group"
            onClick={() => scrollToSection(id)}
            onMouseEnter={() => setHoveredSection(id)}
            onMouseLeave={() => setHoveredSection(null)}
          >
            <button className="flex items-center cursor-pointer" aria-label={`Scroll to ${label} section`}>
              <div
                className={`w-1 h-8 rounded-full transition-all duration-300 ${
                  activeSection === id ? "bg-neon" : "bg-white/20 group-hover:bg-white/40"
                }`}
              />
            </button>

            {/* Label that appears on hover */}
            <div
              className={`absolute left-4 top-1/2 -translate-y-1/2 whitespace-nowrap bg-black/90 px-2 py-1 rounded text-xs text-neon opacity-0 transition-opacity duration-200 pointer-events-none ${
                hoveredSection === id ? "opacity-100" : ""
              }`}
            >
              {label}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
