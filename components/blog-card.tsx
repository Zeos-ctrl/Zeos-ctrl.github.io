"use client"

import { Calendar, Clock, Tag } from "lucide-react"
import Link from "next/link"

interface BlogPost {
  id: string
  title: string
  excerpt: string
  date: string
  readTime: string
  tags: string[]
  category: string
  featured: boolean
}

interface BlogCardProps {
  post: BlogPost
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.id}`}>
      <div className="bg-white rounded-2xl p-4 md:p-6 border border-gray-200 cursor-pointer hover:bg-gray-50 transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg">
        {/* Featured Badge */}
        {post.featured && (
          <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200 mb-3">
            Featured
          </div>
        )}

        {/* Category */}
        <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 mb-3">
          {post.category}
        </div>

        {/* Title */}
        <h3 className="text-lg md:text-xl font-bold text-black mb-3 line-clamp-2">{post.title}</h3>

        {/* Excerpt */}
        <p className="text-sm md:text-base text-gray-700 mb-4 line-clamp-3">{post.excerpt}</p>

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{new Date(post.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{post.readTime}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {post.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
            >
              <Tag className="w-3 h-3 mr-1" />
              {tag}
            </span>
          ))}
          {post.tags.length > 3 && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-600">
              +{post.tags.length - 3} more
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
