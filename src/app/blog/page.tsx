"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import PublicNavBar from "@/components/public/navbar"
import Footer from "@/components/public/footer"
import { Calendar, ArrowRight } from "lucide-react"
import { useState } from "react"

const blogPosts = [
  {
    id: 1,
    slug: "mastering-product-photography",
    title: "Mastering Product Photography",
    excerpt: "Learn the essential techniques and lighting setups for stunning product shots",
    author: "Alex Rivers",
    date: "December 1, 2024",
    category: "Photography",
    image: "/blog-image-1.jpg",
    readTime: "5 min read",
  },
  {
    id: 2,
    slug: "cinematic-video-storytelling",
    title: "The Art of Cinematic Video Storytelling",
    excerpt: "Discover how to craft compelling video narratives that captivate your audience",
    author: "Jordan Jay",
    date: "November 28, 2024",
    category: "Videography",
    image: "/blog-image-2.jpg",
    readTime: "8 min read",
  },
  {
    id: 3,
    slug: "brand-identity-design-trends",
    title: "2024 Brand Identity Design Trends",
    excerpt: "Explore the latest trends shaping modern brand design and visual identity",
    author: "Sam Morgan",
    date: "November 25, 2024",
    category: "Design",
    image: "/blog-image-3.jpg",
    readTime: "6 min read",
  },
  {
    id: 4,
    slug: "lighting-techniques-photography",
    title: "Professional Lighting Techniques for Every Scenario",
    excerpt: "Master lighting concepts from studio to on-location shoots",
    author: "Alex Rivers",
    date: "November 20, 2024",
    category: "Photography",
    image: "/blog-image-4.jpg",
    readTime: "7 min read",
  },
  {
    id: 5,
    slug: "color-grading-workflow",
    title: "Color Grading Workflow & Best Practices",
    excerpt: "Create a consistent color grading workflow for professional results",
    author: "Casey Wilson",
    date: "November 18, 2024",
    category: "Videography",
    image: "/blog-image-5.jpg",
    readTime: "9 min read",
  },
  {
    id: 6,
    slug: "typography-matters",
    title: "Why Typography Matters in Brand Design",
    excerpt: "Understanding how typography shapes brand perception and identity",
    author: "Sam Morgan",
    date: "November 15, 2024",
    category: "Design",
    image: "/blog-image-6.jpg",
    readTime: "5 min read",
  },
]

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const categories = Array.from(new Set(blogPosts.map((post) => post.category)))

  const filteredPosts = selectedCategory ? blogPosts.filter((post) => post.category === selectedCategory) : blogPosts

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
          </div>
        </section>

        <section className="py-12 px-4 relative overflow-hidden">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="flex flex-wrap gap-3 justify-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(null)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  selectedCategory === null
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-foreground/70 hover:text-foreground hover:border-primary/50"
                }`}
              >
                All Posts
              </motion.button>
              {categories.map((category) => (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-full font-medium transition-all ${
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border border-border text-foreground/70 hover:text-foreground hover:border-primary/50"
                  }`}
                >
                  {category}
                </motion.button>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-20 px-4 relative overflow-hidden">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              {filteredPosts.map((post, idx) => (
                <motion.article
                  key={post.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: idx * 0.05, duration: 0.4 }}
                  whileHover={{ y: -8 }}
                  className="group"
                >
                  <Link href={`/blog/${post.slug}`} className="block h-full">
                    <div className="glass-effect border border-border rounded-xl overflow-hidden flex flex-col h-full hover:border-primary/50 transition-all duration-300">
                      {/* Image */}
                      <div className="relative overflow-hidden h-48 bg-gradient-to-br from-primary/20 to-transparent">
                        <Image
                          src={post.image || "/placeholder.svg"}
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
                      </div>

                      {/* Content */}
                      <div className="p-6 flex flex-col flex-grow">
                        <h2 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                          {post.title}
                        </h2>
                        <p className="text-foreground/60 text-sm mb-4 line-clamp-2 flex-grow">{post.excerpt}</p>

                        {/* Meta */}
                        <div className="border-t border-border pt-4 space-y-3">
                          <div className="flex items-center gap-4 text-xs text-foreground/50">
                            <motion.div
                              className="flex items-center gap-1"
                              whileHover={{ x: 3 }}
                              transition={{ type: "spring" }}
                            >
                              <Calendar size={14} />
                              {post.date}
                            </motion.div>
                            <div>{post.readTime}</div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-primary/20" />
                              <span className="text-xs font-medium text-foreground/70">{post.author}</span>
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

            {/* Empty state */}
            {filteredPosts.length === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
                <p className="text-foreground/60 text-lg">No posts found in this category.</p>
              </motion.div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
