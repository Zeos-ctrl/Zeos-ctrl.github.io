"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

const images = [
  "/images/connor_bryan.webp?height=400&width=400",
  "/images/connor_explore.webp?height=400&width=400",
  "/images/connor_swimming.webp?height=400&width=400",
]

export function ImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-white rounded-2xl border border-gray-200 h-full max-h-[90vh] flex flex-col overflow-hidden">
      <div className="flex-1 relative min-h-0">
        <div
          className="flex transition-transform duration-500 ease-in-out h-full"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((src, index) => (
            <div key={index} className="w-full h-full flex-shrink-0 relative">
              <Image
                src={src || "/placeholder.svg"}
                alt={`Portfolio image ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Carousel Indicators */}
      <div className="flex justify-center space-x-2 py-3 bg-white flex-shrink-0">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-colors ${index === currentIndex ? "bg-black" : "bg-gray-400"}`}
          />
        ))}
      </div>
    </div>
  )
}
