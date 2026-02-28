"use client"

import { useState, useEffect } from "react"
import { notFound, useRouter } from "next/navigation"
import { CldImage } from 'next-cloudinary'
import { 
  Calendar, 
  Eye, 
  Tag, 
  User, 
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Grid,
  X,
  Maximize2,
  Play,
  Pause,
  Loader2
} from "lucide-react"
import PublicNavBar from "@/components/public/navbar"
import Footer from "@/components/public/footer"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

interface PortfolioImage {
  url: string
  thumbnail: string
  caption?: string
  order: number
}

interface PortfolioItem {
  id: string
  title: string
  slug: string
  description: string
  category: "PHOTOGRAPHY" | "VIDEOGRAPHY" | "GRAPHIC_DESIGN"
  images: PortfolioImage[]
  imageUrl: string
  videoUrl: string | null
  thumbnailUrl: string
  featured: boolean
  publishedAt: string | null
  tags: string[]
  views: number
  createdAt: string
  user: {
    name: string
    avatar?: string
    bio?: string
  } | null
}

interface PortfolioDetailPageProps {
  params: Promise<{ slug: string }>
}

export default function PortfolioDetailPage({ params }: PortfolioDetailPageProps) {
  const [item, setItem] = useState<PortfolioItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchPortfolioItem = async () => {
      try {
        const { slug } = await params
        
        if (!slug) {
          notFound()
          return
        }

        const response = await fetch(`/api/portfolio/${slug}`)
        
        if (!response.ok) {
          if (response.status === 404) {
            notFound()
            return
          }
          throw new Error("Failed to fetch portfolio item")
        }
        
        const data = await response.json()
        setItem(data)
      } catch (err) {
        console.error("Error fetching portfolio item:", err)
        setError("Failed to load portfolio item")
      } finally {
        setLoading(false)
      }
    }

    fetchPortfolioItem()
  }, [params, router])

  if (loading) {
    return (
      <div className="bg-background text-foreground min-h-screen">
        <PublicNavBar />
        <main className="pt-20 flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
            <p className="text-foreground/60">Loading portfolio item...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !item) {
    return (
      <div className="bg-background text-foreground min-h-screen">
        <PublicNavBar />
        <main className="pt-20 flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <p className="text-foreground/60">{error || "Item not found"}</p>
            <Link 
              href="/portfolio"
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              <ArrowLeft size={16} />
              Back to Portfolio
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // Process images - ensure we have an array
  const images = item.images && item.images.length > 0 
    ? item.images.sort((a, b) => a.order - b.order)
    : [{ 
        url: item.imageUrl, 
        thumbnail: item.thumbnailUrl || item.imageUrl,
        caption: item.title,
        order: 0 
      }]

  return (
    <div className="bg-background text-foreground min-h-screen">
      <PublicNavBar />
      
      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Back button */}
          <Link 
            href="/portfolio"
            className="inline-flex items-center gap-2 text-foreground/70 hover:text-primary transition-colors mb-8 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Back to Portfolio
          </Link>
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{item.title}</h1>
            
            <div className="flex flex-wrap gap-4 items-center text-foreground/60">
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                <span>{new Date(item.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Eye size={18} />
                <span>{(item.views || 0).toLocaleString()} views</span>
              </div>
              
              {item.user && (
                <div className="flex items-center gap-2">
                  <User size={18} />
                  <span>{item.user.name}</span>
                </div>
              )}

              <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                {item.category}
              </span>

              {item.featured && (
                <span className="px-3 py-1 bg-yellow-500/10 text-yellow-500 text-sm font-medium rounded-full">
                  ⭐ Featured
                </span>
              )}
            </div>
          </div>

          {/* Gallery Component */}
          <GalleryComponent images={images} title={item.title} />
          
          {/* Content Grid */}
          <div className="grid lg:grid-cols-3 gap-12 mt-16">
            <div className="lg:col-span-2">
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <h2 className="text-2xl font-bold mb-4 text-primary">About This Project</h2>
                <div className="text-foreground/80 leading-relaxed whitespace-pre-wrap">
                  {item.description}
                </div>
              </div>
              
              {item.videoUrl && (
                <div className="mt-12">
                  <h3 className="text-2xl font-bold mb-4 text-primary">Video Showcase</h3>
                  <div className="aspect-video rounded-xl overflow-hidden bg-black shadow-2xl">
                    <iframe
                      src={item.videoUrl.replace("watch?v=", "embed/")}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-8">
              <DetailsCard item={item} imagesCount={images.length} />
              
              {item.user && (
                <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/30 transition-colors">
                  <h3 className="text-xl font-bold mb-4 text-primary">Photographer</h3>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center overflow-hidden">
                      {item.user.avatar ? (
                        <CldImage
                          src={item.user.avatar}
                          alt={item.user.name}
                          width={64}
                          height={64}
                          className="object-cover"
                        />
                      ) : (
                        <User size={32} className="text-primary" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{item.user.name}</h4>
                      <p className="text-sm text-foreground/60">Creative Professional</p>
                      {item.user.bio && (
                        <p className="text-sm text-foreground/70 mt-2">{item.user.bio}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}

// Gallery Component
function GalleryComponent({ images, title }: { images: PortfolioImage[], title: string }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showLightbox, setShowLightbox] = useState(false)
  const [isAutoPlaying, setIsAutoPlaying] = useState(false)
  const [showThumbnails, setShowThumbnails] = useState(true)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  // Minimum swipe distance
  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance
    
    if (isLeftSwipe) {
      nextImage()
    } else if (isRightSwipe) {
      prevImage()
    }
  }

  // Auto-play effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isAutoPlaying && !showLightbox) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length)
      }, 3000)
    }
    return () => clearInterval(interval)
  }, [isAutoPlaying, images.length, showLightbox])

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const selectImage = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    <>
      {/* Main Gallery */}
      <div className="space-y-4">
        {/* Main Image */}
        <motion.div 
          layoutId="main-image"
          className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-card/50 group cursor-pointer border border-border"
          onClick={() => setShowLightbox(true)}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="relative w-full h-full"
            >
              <CldImage
                src={images[currentIndex]?.url || images[0].url}
                alt={title}
                fill
                sizes="(max-width: 1280px) 100vw, 1280px"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
            </motion.div>
          </AnimatePresence>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          {/* Image Counter */}
          <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium border border-white/20">
            {currentIndex + 1} / {images.length}
          </div>

          {/* Navigation Arrows (visible on hover) */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/70 backdrop-blur-sm text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-primary hover:scale-110 border border-white/20"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/70 backdrop-blur-sm text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-primary hover:scale-110 border border-white/20"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          {/* Image Caption */}
          {images[currentIndex]?.caption && (
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-black/70 backdrop-blur-sm text-white p-3 rounded-lg inline-block max-w-lg border border-white/20">
                <p className="text-sm">{images[currentIndex].caption}</p>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="absolute bottom-4 right-4 flex gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); setShowThumbnails(!showThumbnails); }}
              className="w-10 h-10 bg-black/70 backdrop-blur-sm text-white rounded-lg flex items-center justify-center hover:bg-primary transition-colors border border-white/20"
              title={showThumbnails ? "Hide thumbnails" : "Show thumbnails"}
            >
              <Grid size={18} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setShowLightbox(true); }}
              className="w-10 h-10 bg-black/70 backdrop-blur-sm text-white rounded-lg flex items-center justify-center hover:bg-primary transition-colors border border-white/20"
              title="View fullscreen"
            >
              <Maximize2 size={18} />
            </button>
          </div>
        </motion.div>

        {/* Thumbnails Strip */}
        <AnimatePresence>
          {showThumbnails && images.length > 1 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative"
            >
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
                {images.map((image, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => selectImage(index)}
                    className={`relative flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden transition-all border-2 ${
                      index === currentIndex 
                        ? 'border-primary scale-105 shadow-lg shadow-primary/20' 
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <CldImage
                      src={image.thumbnail || image.url}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </motion.button>
                ))}
              </div>

              {/* Auto-play Controls */}
              <div className="absolute -top-8 right-0 flex gap-2">
                <button
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm transition-colors ${
                    isAutoPlaying 
                      ? 'bg-primary/20 text-primary border border-primary/30' 
                      : 'bg-card hover:bg-primary/10 border border-border'
                  }`}
                >
                  {isAutoPlaying ? (
                    <>
                      <Pause size={14} />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play size={14} />
                      Slideshow
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {showLightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
            onClick={() => setShowLightbox(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative w-full h-full flex items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setShowLightbox(false)}
                className="absolute top-4 right-4 text-white hover:text-primary z-50 bg-black/50 backdrop-blur-sm w-12 h-12 rounded-full flex items-center justify-center border border-white/20"
              >
                <X size={24} />
              </button>

              {/* Image counter */}
              <div className="absolute top-4 left-4 text-white bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full text-sm border border-white/20">
                {currentIndex + 1} / {images.length}
              </div>

              {/* Navigation */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-black/50 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-primary transition-colors border border-white/20 z-50"
                  >
                    <ChevronLeft size={28} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-black/50 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-primary transition-colors border border-white/20 z-50"
                  >
                    <ChevronRight size={28} />
                  </button>
                </>
              )}

              {/* Main lightbox image */}
              <div className="relative w-full h-full flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="relative w-full h-full"
                  >
                    <CldImage
                      src={images[currentIndex]?.url || images[0].url}
                      alt={title}
                      fill
                      sizes="100vw"
                      className="object-contain"
                      priority
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Caption in lightbox */}
              {images[currentIndex]?.caption && (
                <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-center">
                  <div className="bg-black/70 backdrop-blur-sm text-white px-6 py-3 rounded-lg border border-white/20">
                    <p className="text-sm">{images[currentIndex].caption}</p>
                  </div>
                </div>
              )}

              {/* Thumbnails in lightbox */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-[90vw] pb-2 px-4">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`relative flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden transition-all border-2 ${
                      index === currentIndex 
                        ? 'border-primary scale-110 shadow-lg shadow-primary/50' 
                        : 'border-transparent opacity-50 hover:opacity-100'
                    }`}
                  >
                    <CldImage
                      src={image.thumbnail || image.url}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// Details Card Component
function DetailsCard({ item, imagesCount }: { item: PortfolioItem; imagesCount: number }) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/30 transition-colors">
      <h3 className="text-xl font-bold mb-4 text-primary">Project Details</h3>
      
      <div className="space-y-4">
        <div>
          <span className="text-foreground/60 block mb-2 text-sm">Category</span>
          <div className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full font-medium text-sm">
            {item.category}
          </div>
        </div>
        
        {item.featured && (
          <div>
            <span className="text-foreground/60 block mb-2 text-sm">Status</span>
            <div className="inline-block px-4 py-2 bg-yellow-500/10 text-yellow-500 rounded-full font-medium text-sm flex items-center gap-1">
              <span>⭐</span> Featured Work
            </div>
          </div>
        )}
        
        {item.tags && item.tags.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Tag size={16} className="text-primary" />
              <span className="text-foreground/60 text-sm font-medium">Tags</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {item.tags.map((tag: string, i: number) => (
                <span
                  key={i}
                  className="px-3 py-1.5 bg-input text-foreground/70 rounded-full text-xs hover:bg-primary/10 hover:text-primary transition-colors cursor-default border border-border"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Image count and details */}
        <div className="pt-4 border-t border-border mt-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-foreground/60">Total Images:</span>
            <span className="font-medium bg-primary/5 px-3 py-1 rounded-full">
              {imagesCount} {imagesCount === 1 ? 'image' : 'images'}
            </span>
          </div>
          {item.videoUrl && (
            <div className="flex justify-between text-sm">
              <span className="text-foreground/60">Video Included:</span>
              <span className="text-green-500 font-medium flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Yes
              </span>
            </div>
          )}
          <div className="flex justify-between text-sm mt-2">
            <span className="text-foreground/60">Created:</span>
            <span className="font-medium">{new Date(item.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}