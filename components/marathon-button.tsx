"use client"

import type React from "react"

interface MarathonButtonProps {
  children: React.ReactNode
  onClick?: () => void
  href?: string
  className?: string
  type?: "button" | "submit" | "reset"
  variant?: "outline" | "solid" | "text"
  disabled?: boolean
}

export default function MarathonButton({
  children,
  onClick,
  href,
  className = "",
  type = "button",
  variant = "text",
  disabled = false,
}: MarathonButtonProps) {
  const baseClasses = "uppercase font-mono tracking-wide transition-all duration-200"

  const variantClasses = {
    outline: "border border-neon text-white hover:bg-neon hover:text-black px-4 py-2",
    solid: "bg-neon text-black hover:bg-white px-4 py-2",
    text: "marathon-button",
  }

  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${className}`

  if (href) {
    return (
      <a href={href} className={buttonClasses}>
        {children}
      </a>
    )
  }

  return (
    <button onClick={onClick} className={buttonClasses} type={type} disabled={disabled}>
      {children}
    </button>
  )
}
