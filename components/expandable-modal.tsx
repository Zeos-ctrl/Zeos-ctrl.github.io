"use client"

import type React from "react"

import { X } from "lucide-react"
import { useEffect } from "react"

interface ExpandableModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export function ExpandableModal({ isOpen, onClose, title, children }: ExpandableModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
      // Add a small delay to ensure smooth animation
      setTimeout(() => {
        const modal = document.querySelector("[data-modal]")
        if (modal) {
          modal.classList.add("animate-in", "fade-in-0", "zoom-in-95")
        }
      }, 10)
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div
        data-modal
        className="relative bg-white rounded-2xl max-w-4xl max-h-[90vh] w-full mx-4 overflow-hidden transform transition-all duration-300 ease-out"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl md:text-3xl font-bold text-black">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">{children}</div>
      </div>
    </div>
  )
}
