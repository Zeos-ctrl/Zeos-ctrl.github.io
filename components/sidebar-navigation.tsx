"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface SidebarNavigationProps {
  sections: { id: string; label: string }[]
}

export default function SidebarNavigation({ sections }: SidebarNavigationProps) {
  const [activeSection, setActiveSection] = useState("")
  const [isMobile, setIsMobile] = useState(false)

  // Check if mobile on mount and when window resizes
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  // Set up fade-in animations for content
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    }

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible")
        }
      })
    }

    const observer = new IntersectionObserver(handleIntersect, observerOptions)

    // Observe all elements with fade-in class
    document.querySelectorAll(".fade-in").forEach((el) => {
      observer.observe(el)
    })

    return () => {
      observer.disconnect()
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

  // Mobile navigation at the bottom
  if (isMobile) {
    return (
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 flex justify-center">
        <div className="bg-black/80 backdrop-blur-sm border border-neutral-800 rounded-full px-4 py-2 flex space-x-3">
          {sections.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollToSection(id)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                activeSection === id ? "bg-apple-blue scale-125" : "bg-white/20"
              }`}
              aria-label={`Scroll to ${label} section`}
            />
          ))}
        </div>
      </div>
    )
  }

  // Desktop sidebar navigation
  return (
    <div className="fixed left-8 top-1/2 transform -translate-y-1/2 z-50 hidden lg:block">
      <div className="flex flex-col items-start space-y-6">
        {sections.map(({ id, label }) => (
          <div
            key={id}
            className="group flex items-center space-x-4 cursor-pointer"
            onClick={() => scrollToSection(id)}
          >
            <div className="relative h-2 w-2">
              <motion.div
                className="absolute inset-0 bg-white rounded-full"
                initial={{ scale: 0.5, opacity: 0.2 }}
                animate={{
                  scale: activeSection === id ? 1 : 0.5,
                  opacity: activeSection === id ? 1 : 0.2,
                  backgroundColor: activeSection === id ? "#0A84FF" : "#FFFFFF",
                }}
                transition={{ duration: 0.3 }}
              />
            </div>

            <motion.div
              className="overflow-hidden"
              initial={{ width: 0, opacity: 0 }}
              animate={{
                width: activeSection === id ? "auto" : 0,
                opacity: activeSection === id ? 1 : 0,
              }}
              transition={{ duration: 0.3 }}
            >
              <span className="whitespace-nowrap text-apple-blue text-xs">{label}</span>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  )
}

