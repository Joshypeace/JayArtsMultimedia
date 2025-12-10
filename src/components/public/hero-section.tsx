"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import Link from "next/link"

export default function HeroSection() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], [0, 200])
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.5])

  return (
    <section ref={ref} className="relative min-h-screen overflow-hidden pt-20 flex flex-col justify-center">
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background"
        style={{ y, opacity }}
      />

      {/* Gold accent patches */}
      <div className="absolute top-10 right-5 w-72 h-72 bg-primary/15 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-5 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center px-4 py-12 sm:py-16 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-center max-w-3xl w-full"
        >
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 text-balance"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <span className="text-foreground">Cinematic </span>
            <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              Storytelling
            </span>
            <span className="text-foreground"> Through Multimedia</span>
          </motion.h1>

          <motion.p
            className="text-base sm:text-lg md:text-xl text-foreground/70 mb-6 sm:mb-8 text-balance px-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            We craft stunning visual experiences for brands that demand excellence in photography, videography, and
            graphic design.
          </motion.p>

          <motion.div
            className="flex gap-3 sm:gap-4 justify-center flex-wrap px-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            <Link
              href="/portfolio"
              className="px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-lg hover:shadow-lg hover:shadow-primary/40 transition-all font-medium text-sm sm:text-base"
            >
              View Portfolio
            </Link>
            <Link
              href="/booking"
              className="px-6 sm:px-8 py-2 sm:py-3 border-2 border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors font-medium text-sm sm:text-base"
            >
              Book a Session
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
        >
          <div className="flex flex-col items-center gap-2">
            {/* <span className="text-xs sm:text-sm text-foreground/50">Scroll to explore</span> */}
            <div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center">
              <motion.div
                className="w-1 h-2 bg-primary rounded-full"
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
