"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface FloatingElementProps {
  children: ReactNode
  duration?: number
  distance?: number
  className?: string
}

export default function FloatingElement({
  children,
  duration = 3,
  distance = 20,
  className = "",
}: FloatingElementProps) {
  return (
    <motion.div
      animate={{ y: [-distance, distance, -distance] }}
      transition={{
        duration,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
