import { TopNavigation } from "@/components/top-navigation"
import { BlogGrid } from "@/components/blog-grid"
import { getBlogPosts } from "@/data/blog-posts"

export default function BlogPage() {
  const posts = getBlogPosts()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Top Navigation */}
      <TopNavigation />

      {/* Blog Header */}
      <div className="bg-black pt-12 md:pt-20 pb-12 md:pb-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6 text-center py-16">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Blog & Insights</h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            Thoughts on machine learning, software development, research, and the intersection of technology and
            athletics.
          </p>
        </div>
      </div>

      {/* Blog Content */}
      <div className="bg-gray-50 min-h-screen">
        <BlogGrid posts={posts} />
      </div>
    </div>
  )
}
