import { notFound } from "next/navigation"
import { Calendar, Clock, User, Tag, Share2, ArrowLeft, Eye } from "lucide-react"
import PublicNavBar from "@/components/public/navbar"
import Footer from "@/components/public/footer"
import Link from "next/link"
import Image from "next/image"

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage: string
  category: string
  readTime: number
  publishedAt: string | null
  isFeatured: boolean
  tags: string[]
  views: number
  likes: number
  createdAt: string
  updatedAt: string
  author: {
    name: string
    avatar?: string
    bio?: string
  }
}

interface BlogPostPageProps {
  params: { slug: string }
}

async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
    const response = await fetch(`${baseUrl}/api/blog/${slug}`, {
      next: { revalidate: 60 } // Revalidate every 60 seconds
    })
    
    if (!response.ok) {
      return null
    }
    
    return await response.json()
  } catch (error) {
    console.error("Error fetching blog post:", error)
    return null
  }
}

async function getRelatedPosts(currentSlug: string): Promise<BlogPost[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
    const response = await fetch(`${baseUrl}/api/blog?limit=3`)
    
    if (!response.ok) {
      return []
    }
    
    const data = await response.json()
    return data.posts.filter((post: BlogPost) => post.slug !== currentSlug).slice(0, 3)
  } catch (error) {
    console.error("Error fetching related posts:", error)
    return []
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = params
  
  const post = await getBlogPost(slug)
  
  if (!post) {
    notFound()
  }
  
  const relatedPosts = await getRelatedPosts(slug)
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not published"
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="bg-background text-foreground min-h-screen">
      <PublicNavBar />

      <main className="pt-20">
        {/* Back Button */}
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Blog
          </Link>
        </div>

        {/* Article Header */}
        <article className="max-w-4xl mx-auto px-4 py-8">
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                {post.category}
              </span>
              {post.isFeatured && (
                <span className="px-3 py-1 bg-yellow-500/10 text-yellow-500 rounded-full text-sm font-medium">
                  Featured
                </span>
              )}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{post.title}</h1>
            
            <div className="flex flex-wrap items-center gap-6 text-foreground/60 mb-8">
              <div className="flex items-center gap-2">
                {post.author.avatar ? (
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <User size={16} className="text-primary" />
                  </div>
                )}
                <div>
                  <p className="font-medium text-foreground">{post.author.name}</p>
                  {post.author.bio && (
                    <p className="text-xs text-foreground/60">{post.author.bio}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>{formatDate(post.publishedAt)}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>{post.readTime} min read</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Eye size={16} />
                  <span>{post.views.toLocaleString()} views</span>
                </div>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-8">
            <Image
              src={post.coverImage || "/placeholder.svg"}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Excerpt */}
          {post.excerpt && (
            <div className="bg-card/50 border-l-4 border-primary pl-4 py-2 mb-8">
              <p className="text-lg italic text-foreground/80">{post.excerpt}</p>
            </div>
          )}

          {/* Content */}
          <div 
            className="prose prose-lg dark:prose-invert max-w-none mb-8"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <Tag size={18} className="text-foreground/60" />
                <span className="text-foreground/60 font-medium">Tags</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-input text-foreground/70 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Share Section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-6 border-t border-border">
            <div>
              <p className="text-foreground/60 text-sm mb-2">Share this article</p>
              <div className="flex gap-3">
                {[
                  { name: 'Twitter', url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://yourdomain.com/blog/${post.slug}`)}` },
                  { name: 'Facebook', url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://yourdomain.com/blog/${post.slug}`)}` },
                  { name: 'LinkedIn', url: `https://www.linkedin.com/shareArticle?mini=true&title=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://yourdomain.com/blog/${post.slug}`)}` }
                ].map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-primary/10 hover:border-primary transition-colors"
                  >
                    <Share2 size={16} className="text-primary" />
                  </a>
                ))}
              </div>
            </div>
            
            <div className="text-sm text-foreground/60">
              <p>Last updated: {formatDate(post.updatedAt)}</p>
            </div>
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="py-16 px-4 bg-card/30">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-8">You might also like</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`} className="group">
                    <div className="bg-background border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all h-full">
                      <div className="relative h-40 overflow-hidden">
                        <Image
                          src={relatedPost.coverImage || "/placeholder.svg"}
                          alt={relatedPost.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-4">
                        <span className="text-xs text-primary font-medium">{relatedPost.category}</span>
                        <h3 className="font-bold group-hover:text-primary transition-colors line-clamp-2 mt-2 mb-2">
                          {relatedPost.title}
                        </h3>
                        <p className="text-xs text-foreground/50">{formatDate(relatedPost.publishedAt)}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Author Bio */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-start gap-4">
                {post.author.avatar ? (
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    width={80}
                    height={80}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                    <User size={32} className="text-primary" />
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold mb-2">About {post.author.name}</h3>
                  {post.author.bio ? (
                    <p className="text-foreground/70">{post.author.bio}</p>
                  ) : (
                    <p className="text-foreground/70">
                      {post.author.name} is a contributor to the JayArts blog, sharing insights and expertise in {post.category.toLowerCase()}.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

// Generate static params for better performance
export async function generateStaticParams() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
    const response = await fetch(`${baseUrl}/api/blog`)
    
    if (!response.ok) {
      return []
    }
    
    const data = await response.json()
    const posts = data.posts || []
    
    return posts.map((post: BlogPost) => ({
      slug: post.slug,
    }))
  } catch (error) {
    console.error("Error generating static params:", error)
    return []
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BlogPostPageProps) {
  const post = await getBlogPost(params.slug)
  
  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The blog post you are looking for does not exist.'
    }
  }
  
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
      type: 'article',
      publishedTime: post.publishedAt || post.createdAt,
      authors: [post.author.name],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
    }
  }
}