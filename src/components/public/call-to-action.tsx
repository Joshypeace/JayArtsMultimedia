"use client"

import { motion } from "framer-motion"
import Link from "next/link"

export default function CallToAction() {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="glass-effect border border-border rounded-2xl p-12 md:p-16 text-center gold-glow"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">
            Ready to Create Something <span className="text-primary">Extraordinary</span>?
          </h2>
          <p className="text-foreground/70 text-lg mb-8 max-w-2xl mx-auto">
            Let's bring your vision to life with stunning multimedia solutions
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/booking"
              className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-opacity-90 transition-all hover:shadow-lg hover:shadow-primary/20 font-medium"
            >
              Get Started Today
            </Link>
            <Link
              href="/contact"
              className="px-8 py-3 border-2 border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors font-medium"
            >
              Send Inquiry
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
