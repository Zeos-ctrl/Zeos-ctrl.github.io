"use client"

import { Mail } from "lucide-react"

export function TopNavigation() {
  const handleGetInTouch = () => {
    window.location.href = "mailto:swimconnor4@gmail.com"
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-black/90 backdrop-blur-md border-b border-gray-800 px-4 md:px-6 py-3 md:py-6 h-12 md:h-20">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo/Name */}
        <div className="text-white font-bold text-sm md:text-xl">Connor Bryan</div>

        {/* Get in Touch Button */}
        <button
          onClick={handleGetInTouch}
          className="bg-white text-black px-3 py-1 md:px-6 md:py-2 rounded-full font-medium hover:bg-gray-100 transition-colors items-center space-x-1 md:space-x-2 flex text-xs md:text-base"
        >
          <Mail className="w-3 h-3 md:w-4 md:h-4" />
          <span>Get in Touch</span>
        </button>
      </div>
    </nav>
  )
}
