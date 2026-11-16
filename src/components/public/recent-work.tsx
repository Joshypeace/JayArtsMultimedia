"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import ShootGallery from "@/components/public/shoot-gallery"

export default function RecentWork() {
  return (
    <section className="relative px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">
            Recent <span className="text-primary">Shoots</span>
          </h2>
          <p className="text-lg text-foreground/60">Real moments we captured for our clients</p>
        </motion.div>
        <ShootGallery limit={12} />
        <div className="mt-10 text-center">
          <Link
            href="/portfolio"
            className="inline-block rounded-lg border-2 border-primary px-8 py-3 text-primary transition-colors hover:bg-primary/10"
          >
            See more of our work
          </Link>
        </div>
      </div>
    </section>
  )
}
