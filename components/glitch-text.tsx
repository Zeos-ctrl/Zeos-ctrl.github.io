"use client"

import { useState, useEffect, useRef, useCallback } from "react"

interface GlitchTextProps {
  text: string
  className?: string
  revealDelay?: number
  cycleSpeed?: number
  cycleCount?: number
  onComplete?: () => void
}

export default function GlitchText({
  text,
  className = "",
  revealDelay = 30, // Reverted to a more moderate speed
  cycleSpeed = 20, // Reverted to a more moderate speed
  cycleCount = 2, // Reverted to show more of the effect
  onComplete,
}: GlitchTextProps) {
  const [displayedText, setDisplayedText] = useState<string[]>(Array(text.length).fill(""))
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const cyclesRef = useRef<number[]>(Array(text.length).fill(0))

  // Memoize the glitch characters to avoid recreating on each render
  const glitchChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/"

  // Reset state when text changes
  useEffect(() => {
    setDisplayedText(Array(text.length).fill(""))
    setCurrentIndex(0)
    setIsComplete(false)
    cyclesRef.current = Array(text.length).fill(0)
  }, [text])

  // Memoize the cycleCharacter function to avoid recreating it on each render
  const cycleCharacter = useCallback(
    (index: number) => {
      if (index >= text.length) return

      const targetChar = text[index]
      const cycles = cyclesRef.current[index]

      // If we've cycled enough times, set the final character
      if (cycles >= cycleCount) {
        setDisplayedText((prev) => {
          const newText = [...prev]
          newText[index] = targetChar
          return newText
        })
        setCurrentIndex(index + 1)
        return
      }

      // Otherwise, set a random character and schedule the next cycle
      const randomChar =
        targetChar === " "
          ? " " // Don't glitch spaces
          : glitchChars[Math.floor(Math.random() * glitchChars.length)]

      setDisplayedText((prev) => {
        const newText = [...prev]
        newText[index] = randomChar
        return newText
      })

      // Increment the cycle count
      cyclesRef.current[index] = cycles + 1

      // Schedule the next cycle
      setTimeout(() => cycleCharacter(index), cycleSpeed)
    },
    [text, cycleCount, cycleSpeed, glitchChars],
  )

  // Start revealing characters when currentIndex changes
  useEffect(() => {
    if (currentIndex >= text.length) {
      if (!isComplete) {
        setIsComplete(true)
        onComplete?.()
      }
      return
    }

    // Start revealing the next character
    const revealTimer = setTimeout(() => {
      cycleCharacter(currentIndex)
    }, revealDelay)

    return () => clearTimeout(revealTimer)
  }, [currentIndex, text, revealDelay, isComplete, onComplete, cycleCharacter])

  return (
    <div className={`${className}`}>
      {displayedText.map((char, index) => (
        <span key={index} className={char ? "visible" : "invisible"}>
          {char || " "}
        </span>
      ))}
      {currentIndex < text.length && <span className="animate-pulse">_</span>}
    </div>
  )
}
