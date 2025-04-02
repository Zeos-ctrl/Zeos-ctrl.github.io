"use client"

import { useEffect, useRef } from "react"

interface DotMatrixProps {
  dotCount?: number
  dotSize?: number
  dotColor?: string
  maxDistance?: number
  pattern?: "grid" | "wave"
}

export default function DotMatrix({
  dotCount = 400,
  dotSize = 3,
  dotColor = "hsla(211, 100%, 45%, 0.4)",
  maxDistance = 100,
  pattern = "grid",
}: DotMatrixProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const dotsRef = useRef<HTMLDivElement[]>([])
  const mousePosition = useRef({ x: 0, y: 0 })
  const animationFrameId = useRef<number | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Clear any existing dots
    dotsRef.current.forEach((dot) => {
      if (dot.parentNode === container) {
        container.removeChild(dot)
      }
    })
    dotsRef.current = []

    // Create dots
    for (let i = 0; i < dotCount; i++) {
      const dot = document.createElement("div")
      dot.className = "dot"
      dot.style.width = `${dotSize}px`
      dot.style.height = `${dotSize}px`
      dot.style.backgroundColor = dotColor

      if (pattern === "grid") {
        // Position dots in a grid pattern
        const cols = Math.ceil(Math.sqrt(dotCount * 1.5)) // Make grid wider than tall
        const rows = Math.ceil(dotCount / cols)

        const colSpacing = container.clientWidth / cols
        const rowSpacing = container.clientHeight / rows

        const col = i % cols
        const row = Math.floor(i / cols)

        dot.style.left = `${col * colSpacing + (Math.random() * 0.4 - 0.2) * colSpacing}px`
        dot.style.top = `${row * rowSpacing + (Math.random() * 0.4 - 0.2) * rowSpacing}px`
      } else if (pattern === "wave") {
        // Create a wave pattern similar to the screenshot
        const width = container.clientWidth
        const height = container.clientHeight

        // Distribute dots more densely at the bottom
        const x = Math.random() * width
        const y = height - Math.pow(Math.random(), 0.5) * height * 0.8

        dot.style.left = `${x}px`
        dot.style.top = `${y}px`
      }

      container.appendChild(dot)
      dotsRef.current.push(dot)
    }

    // Track mouse position
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = { x: e.clientX, y: e.clientY }
    }

    // Handle touch for mobile
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mousePosition.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        }
      }
    }

    // Animation loop
    const animate = () => {
      dotsRef.current.forEach((dot) => {
        const rect = dot.getBoundingClientRect()
        const dotX = rect.left + rect.width / 2
        const dotY = rect.top + rect.height / 2

        const dx = mousePosition.current.x - dotX
        const dy = mousePosition.current.y - dotY
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < maxDistance) {
          // Calculate movement based on distance (closer = more movement)
          const factor = 1 - distance / maxDistance
          const moveX = dx * factor * 0.3
          const moveY = dy * factor * 0.3

          // Apply transform
          dot.style.transform = `translate(${moveX}px, ${moveY}px) scale(${1 + factor * 0.5})`
          dot.style.opacity = `${0.4 + factor * 0.6}`
        } else {
          // Reset position
          dot.style.transform = "translate(0, 0) scale(1)"
          dot.style.opacity = "0.4"
        }
      })

      animationFrameId.current = requestAnimationFrame(animate)
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("touchmove", handleTouchMove, { passive: true })
    animationFrameId.current = requestAnimationFrame(animate)

    // Handle window resize
    const handleResize = () => {
      if (!container) return

      dotsRef.current.forEach((dot, i) => {
        if (pattern === "grid") {
          const cols = Math.ceil(Math.sqrt(dotCount * 1.5))
          const rows = Math.ceil(dotCount / cols)

          const colSpacing = container.clientWidth / cols
          const rowSpacing = container.clientHeight / rows

          const col = i % cols
          const row = Math.floor(i / cols)

          dot.style.left = `${col * colSpacing + (Math.random() * 0.4 - 0.2) * colSpacing}px`
          dot.style.top = `${row * rowSpacing + (Math.random() * 0.4 - 0.2) * rowSpacing}px`
        } else if (pattern === "wave") {
          const width = container.clientWidth
          const height = container.clientHeight

          const x = Math.random() * width
          const y = height - Math.pow(Math.random(), 0.5) * height * 0.8

          dot.style.left = `${x}px`
          dot.style.top = `${y}px`
        }
      })
    }

    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("touchmove", handleTouchMove)
      window.removeEventListener("resize", handleResize)

      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }

      dotsRef.current.forEach((dot) => {
        if (dot.parentNode === container) {
          container.removeChild(dot)
        }
      })
      dotsRef.current = []
    }
  }, [dotCount, dotSize, dotColor, maxDistance, pattern])

  return <div ref={containerRef} className="dot-matrix" />
}

