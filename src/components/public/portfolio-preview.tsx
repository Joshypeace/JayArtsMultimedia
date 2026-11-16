"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"

const portfolioItems = [
  { id: 1, title: "Engagements & Weddings", category: "Photography", image: "/gallery/engagement-couple-walk.jpg" },
  { id: 2, title: "Graduation Portraits", category: "Photography", image: "/gallery/graduation-studio.jpg" },
  { id: 3, title: "Events & Coverage", category: "Photography · Videography", image: "/gallery/event-venue-wide.jpg" },
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
              className="relative group overflow-hidden rounded-xl h-72 sm:h-80 md:h-96 cursor-pointer border border-border/60"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />
              <Image
                src={item.image || "/placeholder.svg"}
                alt={item.title}
                fill
                sizes="(min-width:768px) 33vw, 100vw"
                className="object-cover object-top group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent md:opacity-0 md:group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 z-20">
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
