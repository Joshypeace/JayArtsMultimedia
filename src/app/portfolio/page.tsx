"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CldImage } from 'next-cloudinary'
import { X, Play, Tag } from "lucide-react"
import PublicNavBar from "@/components/public/navbar"
import Footer from "@/components/public/footer"

interface PortfolioItem {
  id: string
  title: string
  slug: string
  description: string
  category: "PHOTOGRAPHY" | "VIDEOGRAPHY" | "GRAPHIC_DESIGN"
  imageUrl: string
  videoUrl: string | null
  thumbnailUrl: string
  featured: boolean
  tags: string[]
  views: number
  createdAt: string
}

const categories = ["ALL", "PHOTOGRAPHY", "VIDEOGRAPHY", "GRAPHIC_DESIGN"]

export default function Portfolio() {
  const [items, setItems] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("ALL")
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchPortfolioItems()
  }, [])

  const fetchPortfolioItems = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/portfolio')
      if (!response.ok) throw new Error("Failed to fetch portfolio")
      const data = await response.json()
      setItems(data)
    } catch (err) {
      console.error("Failed to load portfolio:", err)
    } finally {
      setLoading(false)
    }
  }

  const filteredItems = items
    .filter(item => {
      if (selectedCategory === "ALL") return true
      return item.category === selectedCategory
    })
    .filter(item => {
      if (!searchTerm) return true
      const term = searchTerm.toLowerCase()
      return (
        item.title.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term) ||
        item.tags.some(tag => tag.toLowerCase().includes(term))
      )
    })
    .sort((a, b) => {
      if (a.featured && !b.featured) return -1
      if (!a.featured && b.featured) return 1
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

  if (loading) {
    return (
      <div className="bg-background text-foreground min-h-screen">
        <PublicNavBar />
        <main className="pt-20 flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-foreground/60">Loading portfolio...</p>
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
        <section className="py-12 sm:py-16 md:py-20 px-4 relative overflow-hidden">
          <div className="absolute top-5 right-5 w-64 sm:w-80 h-64 sm:h-80 bg-primary/15 rounded-full blur-3xl" />
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6"
            >
              Our <span className="text-primary">Portfolio</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-base sm:text-lg md:text-xl text-foreground/70"
            >
              Showcasing our best work across photography, videography, and design
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-sm text-foreground/60 mt-4"
            >
              {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'} found
            </motion.p>
          </div>
        </section>

        <section className="py-8 sm:py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
              <div className="flex justify-center gap-2 sm:gap-4 flex-wrap">
                {categories.map((category) => (
                  <motion.button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
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
                  placeholder="Search portfolio..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:border-primary w-full md:w-64"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-8 sm:py-16 px-4">
          <div className="max-w-7xl mx-auto">
            {filteredItems.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-foreground/60 text-lg">No portfolio items found</p>
                <p className="text-foreground/40 mt-2">Try a different category or search term</p>
              </div>
            ) : (
              <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="wait">
                  {filteredItems.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => setSelectedItem(item)}
                      className="group cursor-pointer relative overflow-hidden rounded-xl"
                    >
                      <div className="relative h-64">
                        {/* Using CldImage for optimized delivery */}
                        <CldImage
                          src={item.imageUrl}
                          alt={item.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          crop={{
                            type: 'fill',
                            gravity: 'auto',
                            source: true
                          }}
                          effects={[{
                            background: 'black'
                          }]}
                          loading="lazy"
                        />
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        {item.videoUrl && (
                          <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full p-2">
                            <Play size={20} className="text-white" />
                          </div>
                        )}
                        
                        {item.featured && (
                          <div className="absolute top-4 left-4 bg-primary/90 text-white text-xs font-bold px-3 py-1 rounded-full">
                            Featured
                          </div>
                        )}
                        
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                          <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                          <p className="text-primary text-sm mb-2">{item.category}</p>
                          <p className="text-sm text-white/80 line-clamp-2">{item.description}</p>
                          
                          {item.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-3">
                              {item.tags.slice(0, 3).map((tag, i) => (
                                <span key={i} className="text-xs bg-white/20 px-2 py-1 rounded-full">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="p-4 bg-card">
                        <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                        <div className="flex justify-between items-center">
                          <span className="text-primary text-sm">{item.category}</span>
                          <span className="text-xs text-foreground/60">
                            {item.views.toLocaleString()} views
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </section>
      </main>

      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedItem(null)}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-background rounded-xl"
            >
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors z-10"
              >
                <X size={24} />
              </button>
              
              <div className="relative w-full h-96">
                {/* Using CldImage for lightbox with better optimization */}
                <CldImage
                  src={selectedItem.imageUrl}
                  alt={selectedItem.title}
                  fill
                  sizes="100vw"
                  className="object-contain"
                  crop={{
                    type: 'fill',
                    gravity: 'auto',
                    source: true
                  }}
                  dpr="auto"
                  quality="auto"
                  loading="eager"
                />
                
                {selectedItem.videoUrl && (
                  <a
                    href={selectedItem.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-4 right-4 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                  >
                    <Play size={20} />
                    Watch Video
                  </a>
                )}
              </div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">{selectedItem.title}</h2>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-full">
                        {selectedItem.category}
                      </span>
                      {selectedItem.featured && (
                        <span className="px-3 py-1 bg-yellow-500/10 text-yellow-400 rounded-full">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-sm text-foreground/60">
                    {selectedItem.views.toLocaleString()} views
                  </span>
                </div>
                
                <p className="text-lg text-foreground/70 mb-6">{selectedItem.description}</p>
                
                {selectedItem.tags.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Tag size={18} className="text-foreground/60" />
                      <h3 className="font-medium">Tags</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.tags.map((tag, i) => (
                        <span key={i} className="px-3 py-1 bg-input text-foreground/70 rounded-full text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  )
}