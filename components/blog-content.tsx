"use client"

import { Calendar, Clock, Tag, User, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import type React from "react"

interface BlogPost {
  id: string
  title: string
  content: string
  date: string
  readTime: string
  tags: string[]
  category: string
  author: string
  featured: boolean
  heroImage?: string
}

interface BlogContentProps {
  post: BlogPost
}

export function BlogContent({ post }: BlogContentProps) {
  // Convert markdown-like content to JSX with image support
  const formatContent = (content: string) => {
    const lines = content.split("\n")
    const elements: React.JSX.Element[] = []
    let currentIndex = 0

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]

      if (line.startsWith("![")) {
        // Handle images: ![alt text](image-url "optional title")
        const imageMatch = line.match(/!\[(.*?)\]$$(.*?)(?:\s+"(.*?)")?$$/)
        if (imageMatch) {
          const [, alt, src, title] = imageMatch
          elements.push(
            <div key={currentIndex++} className="my-8">
              <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden">
                <Image
                  src={src || "/placeholder.svg"}
                  alt={alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                />
              </div>
              {title && <p className="text-sm text-gray-600 text-center mt-2 italic">{title}</p>}
            </div>,
          )
        }
      } else if (line.startsWith("## ")) {
        elements.push(
          <h2 key={currentIndex++} className="text-2xl md:text-3xl font-bold text-black mt-12 mb-6">
            {line.replace("## ", "")}
          </h2>,
        )
      } else if (line.startsWith("### ")) {
        elements.push(
          <h3 key={currentIndex++} className="text-xl md:text-2xl font-semibold text-black mt-8 mb-4">
            {line.replace("### ", "")}
          </h3>,
        )
      } else if (line.startsWith("#### ")) {
        elements.push(
          <h4 key={currentIndex++} className="text-lg md:text-xl font-semibold text-black mt-6 mb-3">
            {line.replace("#### ", "")}
          </h4>,
        )
      } else if (line.startsWith("```")) {
        // Handle code blocks
        const language = line.replace("```", "").trim()
        const codeLines: string[] = []
        i++ // Skip opening \`\`\`
        while (i < lines.length && !lines[i].startsWith("```")) {
          codeLines.push(lines[i])
          i++
        }
        elements.push(
          <div key={currentIndex++} className="my-6">
            {language && (
              <div className="bg-gray-800 text-gray-300 px-4 py-2 text-sm font-mono rounded-t-lg border-b border-gray-700">
                {language}
              </div>
            )}
            <pre
              className={`bg-gray-900 text-gray-100 p-4 overflow-x-auto ${language ? "rounded-b-lg" : "rounded-lg"}`}
            >
              <code>{codeLines.join("\n")}</code>
            </pre>
          </div>,
        )
      } else if (line.startsWith("| ")) {
        // Handle tables
        const tableRows: string[] = [line]
        i++
        while (i < lines.length && lines[i].startsWith("|")) {
          tableRows.push(lines[i])
          i++
        }
        i-- // Back up one since the loop will increment

        const headers = tableRows[0]
          .split("|")
          .map((h) => h.trim())
          .filter((h) => h)
        const rows = tableRows.slice(2).map((row) =>
          row
            .split("|")
            .map((cell) => cell.trim())
            .filter((cell) => cell),
        )

        elements.push(
          <div key={currentIndex++} className="overflow-x-auto my-8">
            <table className="min-w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  {headers.map((header, idx) => (
                    <th key={idx} className="px-4 py-3 text-left font-semibold text-gray-900 border-b">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, rowIdx) => (
                  <tr key={rowIdx} className="border-b hover:bg-gray-50">
                    {row.map((cell, cellIdx) => (
                      <td key={cellIdx} className="px-4 py-3 text-gray-700">
                        {cell.includes("**") ? <strong>{cell.replace(/\*\*/g, "")}</strong> : cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>,
        )
      } else if (line.startsWith("- ") || line.startsWith("* ")) {
        // Handle bullet points
        const listItems: string[] = [line]
        i++
        while (i < lines.length && (lines[i].startsWith("- ") || lines[i].startsWith("* "))) {
          listItems.push(lines[i])
          i++
        }
        i-- // Back up one

        elements.push(
          <ul key={currentIndex++} className="list-disc list-inside space-y-2 my-6 text-gray-700 leading-relaxed">
            {listItems.map((item, idx) => (
              <li key={idx} className="ml-4">
                {item.replace(/^[*-] /, "")}
              </li>
            ))}
          </ul>,
        )
      } else if (/^\d+\. /.test(line)) {
        // Handle numbered lists
        const listItems: string[] = [line]
        i++
        while (i < lines.length && /^\d+\. /.test(lines[i])) {
          listItems.push(lines[i])
          i++
        }
        i-- // Back up one

        elements.push(
          <ol key={currentIndex++} className="list-decimal list-inside space-y-2 my-6 text-gray-700 leading-relaxed">
            {listItems.map((item, idx) => (
              <li key={idx} className="ml-4">
                {item.replace(/^\d+\. /, "")}
              </li>
            ))}
          </ol>,
        )
      } else if (line.startsWith("> ")) {
        // Handle blockquotes
        const quoteLines: string[] = [line]
        i++
        while (i < lines.length && lines[i].startsWith("> ")) {
          quoteLines.push(lines[i])
          i++
        }
        i-- // Back up one

        elements.push(
          <blockquote
            key={currentIndex++}
            className="border-l-4 border-blue-500 pl-6 py-4 my-6 bg-blue-50 rounded-r-lg"
          >
            <div className="text-gray-700 italic">
              {quoteLines.map((quoteLine, idx) => (
                <p key={idx} className={idx > 0 ? "mt-2" : ""}>
                  {quoteLine.replace(/^> /, "")}
                </p>
              ))}
            </div>
          </blockquote>,
        )
      } else if (line.trim() && !line.startsWith("#")) {
        // Regular paragraphs
        const formattedLine = line
          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
          .replace(/\*(.*?)\*/g, "<em>$1</em>")
          .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono">$1</code>')
          .replace(
            /\[([^\]]+)\]$$([^)]+)$$/g,
            '<a href="$2" class="text-blue-600 hover:text-blue-500 underline" target="_blank" rel="noopener noreferrer">$1</a>',
          )

        elements.push(
          <p
            key={currentIndex++}
            className="text-gray-700 leading-relaxed mb-6 text-base md:text-lg"
            dangerouslySetInnerHTML={{ __html: formattedLine }}
          />,
        )
      } else if (line.trim() === "") {
        // Add spacing for empty lines
        elements.push(<div key={currentIndex++} className="h-4" />)
      }
    }

    return elements
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Back to Blog Button */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-4">
          <Link href="/blog" className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Hero Image */}
        {post.heroImage && (
          <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden mb-8">
            <Image
              src={post.heroImage || "/placeholder.svg"}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
              priority
            />
          </div>
        )}

        {/* Header */}
        <header className="mb-12">
          {/* Category and Featured Badge */}
          <div className="flex items-center gap-3 mb-6">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
              {post.category}
            </span>
            {post.featured && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 border border-orange-200">
                Featured
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-bold text-black mb-8 leading-tight">{post.title}</h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-8">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{post.readTime}</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </span>
            ))}
          </div>
        </header>

        {/* Content */}
        <div className="prose prose-lg max-w-none">{formatContent(post.content)}</div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-200">
          <div className="text-center">
            <p className="text-gray-600 mb-6 text-lg">
              Thanks for reading! If you enjoyed this post, feel free to share it or reach out with questions.
            </p>
            <div className="flex justify-center space-x-6">
              <a href="mailto:swimconnor4@gmail.com" className="text-blue-600 hover:text-blue-500 font-medium text-lg">
                Get in Touch
              </a>
              <span className="text-gray-300">•</span>
              <Link href="/" className="text-blue-600 hover:text-blue-500 font-medium text-lg">
                Back to Portfolio
              </Link>
              <span className="text-gray-300">•</span>
              <Link href="/blog" className="text-blue-600 hover:text-blue-500 font-medium text-lg">
                More Posts
              </Link>
            </div>
          </div>
        </footer>
      </article>
    </div>
  )
}
