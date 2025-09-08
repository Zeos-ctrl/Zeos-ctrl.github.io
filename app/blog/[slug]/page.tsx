import { notFound } from "next/navigation"
import { TopNavigation } from "@/components/top-navigation"
import { BlogContent } from "@/components/blog-content"
import { getBlogPost, getAllBlogSlugs } from "@/data/blog-posts"

interface BlogPostPageProps {
  params: { slug: string }
}

export function generateStaticParams() {
  const slugs = getAllBlogSlugs()
  return slugs.map((slug) => ({
    slug: slug,
  }))
}

export function generateMetadata({ params }: BlogPostPageProps) {
  const slug = params.slug
  const post = getBlogPost(slug)

  if (!post) {
    return {
      title: "Post Not Found",
    }
  }

  return {
    title: `${post.title} | Connor Bryan`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
    },
  }
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const slug = params.slug
  const post = getBlogPost(slug)

  if (!post) {
    notFound()
  }

  return (
    <>
      <TopNavigation />
      <div className="pt-12 md:pt-20">
        <BlogContent post={post} />
      </div>
    </>
  )
}
