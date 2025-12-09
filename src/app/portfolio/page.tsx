"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { X } from "lucide-react"
import PublicNavBar from "@/components/public/navbar"
import Footer from "@/components/public/footer"

const portfolioItems = [
  {
    id: 1,
    title: "Luxury Brand Campaign",
    category: "Photography",
    image: "/portfolio-photo-1.jpg",
    description: "High-end product photography for premium beauty brand",
  },
  {
    id: 2,
    title: "Corporate Documentary",
    category: "Videography",
    image: "/portfolio-video-1.jpg",
    description: "Company story told through cinematic videography",
  },
  {
    id: 3,
    title: "Brand Identity System",
    category: "Design",
    image: "/portfolio-design-1.jpg",
    description: "Complete branding system with guidelines",
  },
  {
    id: 4,
    title: "Event Photography",
    category: "Photography",
    image: "/portfolio-photo-2.jpg",
    description: "Capturing moments from high-profile events",
  },
  {
    id: 5,
    title: "Commercial Production",
    category: "Videography",
    image: "/portfolio-video-2.jpg",
    description: "30-second commercial for television and digital",
  },
  {
    id: 6,
    title: "UI/UX Design",
    category: "Design",
    image: "/portfolio-design-2.jpg",
    description: "User interface design for tech startup",
  },
]

const categories = ["All", "Photography", "Videography", "Design"]

export default function Portfolio() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedItem, setSelectedItem] = useState<(typeof portfolioItems)[0] | null>(null)

  const filteredItems =
    selectedCategory === "All" ? portfolioItems : portfolioItems.filter((item) => item.category === selectedCategory)

  return (
    <div className="bg-background text-foreground min-h-screen">
      <PublicNavBar />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-12 sm:py-16 md:py-20 px-4 relative overflow-hidden">
          <div className="absolute top-5 right-5 w-64 sm:w-80 h-64 sm:h-80 bg-primary/15 rounded-full blur-3xl" />
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 text-balance"
            >
              Our <span className="text-primary">Portfolio</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-base sm:text-lg md:text-xl text-foreground/70 px-2"
            >
              Showcasing our best work across photography, videography, and design
            </motion.p>
          </div>
        </section>

        {/* Filter Tabs */}
        <section className="py-8 sm:py-12 px-4 relative overflow-hidden">
          <div className="max-w-6xl mx-auto">
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
          </div>
        </section>

        {/* Portfolio Grid */}
        <section className="py-16 sm:py-20 px-4 relative overflow-hidden">
          <div className="absolute bottom-20 left-5 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
          <div className="max-w-6xl mx-auto relative z-10">
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
                    className="group cursor-pointer relative overflow-hidden rounded-xl h-48 sm:h-56 lg:h-64"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3 sm:p-4 z-20">
                      <h3 className="text-white font-semibold text-sm sm:text-lg">{item.title}</h3>
                      <p className="text-primary text-xs sm:text-sm">{item.category}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedItem(null)}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-2xl w-full"
            >
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute -top-10 right-0 text-primary hover:text-primary/80 transition-colors z-10"
              >
                <X size={32} />
              </button>
              <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                <Image
                  src={selectedItem.image || "/placeholder.svg"}
                  alt={selectedItem.title}
                  fill
                  className="object-cover"
                />
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-4 sm:mt-6 text-center"
              >
                <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-primary">{selectedItem.title}</h2>
                <p className="text-primary text-base sm:text-lg mb-4">{selectedItem.category}</p>
                <p className="text-foreground/70 text-sm sm:text-base">{selectedItem.description}</p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  )
}
