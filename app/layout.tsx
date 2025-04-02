import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

export const metadata: Metadata = {
  title: "ZEOS.SYSTEMS | Machine Learning & Cybersecurity Consultancy",
  description:
    "Specialized consultancy in machine learning workflow design and cybersecurity solutions for modern enterprises.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <style>
          {`
            /* Fallback font loading strategy */
            body {
              font-family: 'Aeonik', sans-serif;
            }
          `}
        </style>
      </head>
      <body className="font-sans">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'