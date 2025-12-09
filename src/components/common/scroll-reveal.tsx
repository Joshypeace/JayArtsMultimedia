"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface ScrollRevealProps {
  children: ReactNode
  delay?: number
  duration?: number
  className?: string
  once?: boolean
}

export default function ScrollReveal({
  children,
  delay = 0,
  duration = 0.6,
  className = "",
  once = true,
}: ScrollRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay, duration }}
      viewport={{ once }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
