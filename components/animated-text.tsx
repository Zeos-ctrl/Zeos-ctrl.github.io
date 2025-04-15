"use client"

import { useEffect, useRef, useState, memo } from "react"
import GlitchText from "./glitch-text"
import type { JSX } from "react/jsx-runtime"

interface AnimatedTextProps {
  text: string
  className?: string
  glitchDelay?: number
  glitchSpeed?: number
  glitchCount?: number
  tag?: "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "span" | "div"
  useGlitch?: boolean
}

// Memoize the component to prevent unnecessary re-renders
const AnimatedText = memo(function AnimatedText({
  text,
  className = "",
  glitchDelay = 15, // Reverted to more moderate speed
  glitchSpeed = 15, // Reverted to more moderate speed
  glitchCount = 2, // Reverted to show more of the effect
  tag = "p",
  useGlitch = false, // Default to no glitch effect
}: AnimatedTextProps) {
  const [isVisible, setIsVisible] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Use a single observer instance for performance
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true)
          observer.disconnect() // Disconnect once visible for performance
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px 50px 0px", // Start animation slightly before element is in view
      },
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // Create the element based on the tag prop
  const Tag = tag as keyof JSX.IntrinsicElements

  return (
    <div ref={elementRef} className={`fade-in ${className}`}>
      <Tag className="m-0">
        {isVisible ? (
          useGlitch ? (
            <GlitchText text={text} revealDelay={glitchDelay} cycleSpeed={glitchSpeed} cycleCount={glitchCount} />
          ) : (
            <span>{text}</span>
          )
        ) : (
          // Return invisible placeholder with the same dimensions to prevent layout shifts
          <span className="opacity-0">{text}</span>
        )}
      </Tag>
    </div>
  )
})

export default AnimatedText
