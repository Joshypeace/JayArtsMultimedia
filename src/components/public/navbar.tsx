"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function PublicNavBar() {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ]

  return (
    <nav className="fixed top-0 w-full z-40 glass-effect border-b border-primary/20">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full animate-gold-shimmer" />
          <span className="text-primary font-bold tracking-wide">JayArts</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-foreground/80 hover:text-primary transition-colors text-sm font-medium"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Booking Button */}
        <Link
          href="/booking"
          className="hidden md:inline-block px-6 py-2 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-lg hover:shadow-lg hover:shadow-primary/30 transition-all font-medium"
        >
          Book Now
        </Link>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-primary hover:text-primary/80 transition-colors"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            transition={{ type: "spring", damping: 25, stiffness: 120 }}
            className="fixed top-16 right-0 bottom-0 w-64 bg-background/95 backdrop-blur border-l border-primary/20 md:hidden"
          >
            <div className="px-4 py-6 flex flex-col gap-4 h-full">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-foreground/80 hover:text-primary transition-colors font-medium py-2 px-4 hover:bg-primary/10 rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="border-t border-primary/20 pt-4 mt-4">
                <Link
                  href="/booking"
                  className="block px-4 py-3 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-lg text-center font-medium hover:shadow-lg hover:shadow-primary/30 transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  Book Now
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
