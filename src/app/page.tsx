"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import PublicNavBar from "@/components/public/navbar"
import Footer from "@/components/public/footer"
import HeroSection from "@/components/public/hero-section"
import ServicesPreview from "@/components/public/services-preview"
import PortfolioPreview from "@/components/public/portfolio-preview"
import CallToAction from "@/components/public/call-to-action"

export default function Home() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref })
  const progressScale = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <div ref={ref} className="bg-background text-foreground min-h-screen">
      <PublicNavBar />

      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary origin-left z-50"
        style={{ scaleX: progressScale }}
      />

      <main>
        <HeroSection />
        <ServicesPreview />
        <PortfolioPreview />
        <CallToAction />
      </main>

      <Footer />
    </div>
  )
}
