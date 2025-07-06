"use client"

import type { ReactNode } from "react"

interface InfoBoxProps {
  title: string
  children: ReactNode
  className?: string
  onClick?: () => void
}

export function InfoBox({ title, children, className = "", onClick }: InfoBoxProps) {
  return (
    <div
      className={`bg-white rounded-2xl p-2 md:p-4 border border-gray-200 ${className} ${onClick ? "cursor-pointer" : ""}`}
      onClick={onClick}
    >
      {title && <h3 className="text-[10px] md:text-sm font-semibold mb-1 md:mb-3 text-black">{title}</h3>}
      <div className="text-black flex-1">{children}</div>
    </div>
  )
}
