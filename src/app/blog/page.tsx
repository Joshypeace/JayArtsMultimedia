"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import PublicNavBar from "@/components/public/navbar"
import Footer from "@/components/public/footer"
import { Calendar, ArrowRight, Clock, User} from "lucide-react"

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
  author: {
    name: string
    avatar?: string
  }
}

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL")
  const [categories, setCategories] = useState<string[]>(["ALL"])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams()
        if (selectedCategory !== "ALL") params.append('category', selectedCategory)
        if (searchTerm) params.append('search', searchTerm)
        params.append('page', currentPage.toString())
        
        const response = await fetch(`/api/blog?${params}`)
        if (!response.ok) throw new Error("Failed to fetch blog posts")
        const data = await response.json()
        setPosts(data.posts)
        setTotalPages(data.pagination?.pages || 1)
      } catch (err) {
        console.error("Failed to load blog posts:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchBlogPosts()
    fetchCategories()
  }, [selectedCategory, currentPage, searchTerm])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/blog/categories')
      if (!response.ok) return
      const data: { category: string }[] = await response.json()
      const categoryList = ["ALL", ...data.map((cat) => cat.category)]
      setCategories(categoryList)
    } catch (err) {
      console.error("Failed to load categories:", err)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading && posts.length === 0) {
    return (
      <div className="bg-background text-foreground min-h-screen">
        <PublicNavBar />
        <main className="pt-20 flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-foreground/60">Loading blog posts...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="bg-background text-foreground min-h-screen">
      <PublicNavBar />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 px-4 relative overflow-hidden">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-6xl font-bold mb-6"
            >
              JayArts <span className="text-primary">Blog</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-xl text-foreground/70"
            >
              Tips, tricks, and insights from our creative team
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-sm text-foreground/60 mt-4"
            >
              {posts.length} {posts.length === 1 ? 'post' : 'posts'} found
            </motion.p>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
              <div className="flex justify-center gap-2 flex-wrap">
                {categories.map((category) => (
                  <motion.button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category)
                      setCurrentPage(1)
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 sm:px-6 py-2 rounded-lg font-medium transition-all text-sm sm:text-base ${
                      selectedCategory === category
                        ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg shadow-primary/40"
                        : "border border-border text-foreground/70 hover:border-primary hover:text-primary"
                    }`}
                  >
                    {category}
                  </motion.button>
                ))}
              </div>
              
              <div className="flex justify-center">
                <input
                  type="text"
                  placeholder="Search blog posts..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:border-primary w-full md:w-64"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Featured Posts */}
        {posts.filter(post => post.isFeatured).length > 0 && (
          <section className="py-8 px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">Featured Posts</h2>
              <div className="grid md:grid-cols-2 gap-6 mb-12">
                {posts
                  .filter(post => post.isFeatured)
                  .slice(0, 2)
                  .map((post) => (
                    <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                      <div className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all h-full">
                        <div className="relative h-48 overflow-hidden">
                          <Image
                            src={post.coverImage || "/placeholder.svg"}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 bg-primary/80 text-primary-foreground text-xs font-semibold rounded-full">
                              Featured
                            </span>
                          </div>
                        </div>
                        <div className="p-6">
                          <span className="text-xs text-primary font-medium">{post.category}</span>
                          <h3 className="text-xl font-bold mt-2 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                            {post.title}
                          </h3>
                          <p className="text-foreground/60 text-sm line-clamp-2 mb-4">{post.excerpt}</p>
                          <div className="flex items-center justify-between text-sm text-foreground/50">
                            <div className="flex items-center gap-2">
                              <User size={14} />
                              <span>{post.author.name}</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                              <Clock size={14} />
                              <span>{post.readTime} min</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          </section>
        )}

        {/* Blog Posts Grid */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            {posts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-foreground/60 text-lg">No blog posts found</p>
                <p className="text-foreground/40 mt-2">Try a different category or search term</p>
              </div>
            ) : (
              <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post, idx) => (
                  <motion.article
                    key={post.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05, duration: 0.4 }}
                    whileHover={{ y: -8 }}
                    className="group"
                  >
                    <Link href={`/blog/${post.slug}`} className="block h-full">
                      <div className="glass-effect border border-border rounded-xl overflow-hidden flex flex-col h-full hover:border-primary/50 transition-all duration-300">
                        {/* Image */}
                        <div className="relative overflow-hidden h-48 bg-gradient-to-br from-primary/20 to-transparent">
                          <Image
                            src={post.coverImage || "/placeholder.svg"}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <motion.div
                            className="absolute top-4 left-4"
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2, duration: 0.4 }}
                          >
                            <span className="px-3 py-1 bg-primary/80 text-primary-foreground text-xs font-semibold rounded-full">
                              {post.category}
                            </span>
                          </motion.div>
                          {post.isFeatured && (
                            <div className="absolute top-4 right-4">
                              <span className="px-3 py-1 bg-yellow-500/80 text-yellow-50 text-xs font-semibold rounded-full">
                                Featured
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-6 flex flex-col flex-grow">
                          <h2 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                            {post.title}
                          </h2>
                          <p className="text-foreground/60 text-sm mb-4 line-clamp-2 flex-grow">{post.excerpt}</p>

                          {/* Tags */}
                          {post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-4">
                              {post.tags.slice(0, 3).map((tag, i) => (
                                <span key={i} className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Meta */}
                          <div className="border-t border-border pt-4 space-y-3">
                            <div className="flex items-center justify-between text-xs text-foreground/50">
                              <motion.div
                                className="flex items-center gap-1"
                                whileHover={{ x: 3 }}
                                transition={{ type: "spring" }}
                              >
                                <Calendar size={14} />
                                <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                              </motion.div>
                              <div className="flex items-center gap-1">
                                <Clock size={14} />
                                <span>{post.readTime} min read</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {post.author.avatar ? (
                                  <Image
                                    src={post.author.avatar}
                                    alt={post.author.name}
                                    width={24}
                                    height={24}
                                    className="rounded-full"
                                  />
                                ) : (
                                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                                    <User size={14} className="text-primary" />
                                  </div>
                                )}
                                <span className="text-xs font-medium text-foreground/70">{post.author.name}</span>
                              </div>
                              <motion.div initial={{ x: 0 }} whileHover={{ x: 4 }} transition={{ type: "spring" }}>
                                <ArrowRight className="w-4 h-4 text-primary" />
                              </motion.div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </motion.div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12 gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary"
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === i + 1
                        ? "bg-primary text-primary-foreground"
                        : "border border-border hover:border-primary"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}