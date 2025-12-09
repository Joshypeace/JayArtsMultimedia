"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"

const portfolioItems = [
  { id: 1, title: "Premium Brand Campaign", category: "Photography", image: "/luxury-brand-photography.jpg" },
  { id: 2, title: "Corporate Video Production", category: "Videography", image: "/corporate-video-production.png" },
  { id: 3, title: "Identity System Design", category: "Design", image: "/modern-brand-identity.jpg" },
]

export default function PortfolioPreview() {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Featured Work</h2>
          <p className="text-foreground/60 text-lg">Explore our latest projects</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {portfolioItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              className="relative group overflow-hidden rounded-xl h-64 cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />
              <Image
                src={item.image || "/placeholder.svg"}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 z-20">
                <h3 className="text-white font-semibold">{item.title}</h3>
                <p className="text-primary text-sm">{item.category}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/portfolio"
            className="inline-block px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-opacity-90 transition-all hover:shadow-lg hover:shadow-primary/20"
          >
            View All Projects
          </Link>
        </div>
      </div>
    </section>
  )
}
