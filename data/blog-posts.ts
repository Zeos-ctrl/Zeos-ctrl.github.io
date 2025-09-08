interface BlogPost {
  id: string
  title: string
  excerpt: string
  date: string
  readTime: string
  tags: string[]
  category: string
  author: string
  featured: boolean
  heroImage?: string
  content?: string
}

export const blogPosts: BlogPost[] = [
  {
    id: "test-post",
    title: "Welcome to My Blog",
    excerpt: "A simple test post to demonstrate the blog functionality.",
    date: "2024-12-15",
    readTime: "2 min read",
    tags: ["Welcome", "Test"],
    category: "General",
    author: "Connor Bryan",
    featured: true,
    heroImage: "/placeholder.svg?height=400&width=800",
    content: `# Welcome to My Blog

![Welcome](/placeholder.svg?height=400&width=800&query=welcome+blog+header "Welcome to my blog")

Welcome to my personal blog! This is where I'll be sharing thoughts on machine learning, software development, research, and the intersection of technology and athletics.

## What You'll Find Here

This blog will cover a variety of topics:

- **Machine Learning & AI**: Research insights, practical applications, and industry trends
- **Software Development**: Best practices, tools, and lessons learned
- **Research**: Deep dives into my academic work and findings
- **Personal Development**: How my background in competitive swimming shapes my approach to tech

## A Quick Test

Here's a simple code example to test our syntax highlighting:

\`\`\`python
def hello_world():
    print("Welcome to my blog!")
    return "Thanks for reading!"

message = hello_world()
\`\`\`

## Stay Connected

Feel free to reach out if you have questions or want to discuss any of these topics. I'm always excited to connect with fellow developers, researchers, and anyone interested in the intersection of technology and human performance.

Thanks for stopping by!`,
  },
]

export function getBlogPosts(): BlogPost[] {
  return blogPosts
}

export function getBlogPost(slug: string): BlogPost | null {
  return blogPosts.find((post) => post.id === slug) || null
}

export function getAllBlogSlugs(): string[] {
  return blogPosts.map((post) => post.id)
}
