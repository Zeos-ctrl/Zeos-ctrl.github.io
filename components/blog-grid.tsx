"use client"

import { BlogCard } from "@/components/blog-card"

interface BlogPost {
  id: string
  title: string
  excerpt: string
  content?: string
  date: string
  readTime: string
  tags: string[]
  category: string
  author: string
  featured: boolean
  heroImage?: string
}

interface BlogGridProps {
  posts: BlogPost[]
}

export function BlogGrid({ posts }: BlogGridProps) {
  // Separate featured and regular posts
  const featuredPosts = posts.filter((post) => post.featured)
  const regularPosts = posts.filter((post) => !post.featured)

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-black mb-8">Featured Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* All Posts */}
      <section>
        <h2 className="text-2xl md:text-3xl font-bold text-black mb-8">
          {featuredPosts.length > 0 ? "All Posts" : "Latest Posts"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      {/* Empty State */}
      {posts.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-gray-600 mb-4">No posts yet</h3>
          <p className="text-gray-500">Check back soon for new content!</p>
        </div>
      )}
    </div>
  )
}
