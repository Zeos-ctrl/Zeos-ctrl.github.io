import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Connor Portfolio',
  description: 'Hi, I\'m Connor Bryan. I used to be a swimmer for Great Britain and now I’m studying for a Master’s degree in Data Intensive Physics. Feel free to check out my portfolio to see my previous projects, work experience, and recent achievements. These days, I’m especially interested in studying gravitational waves and how they help us understand the universe!',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
