"use client"

import { motion } from "framer-motion"
import { Camera, Video, Palette } from "lucide-react"
import Link from "next/link"

const services = [
  {
    id: 1,
    title: "Photography",
    description: "Stunning visual narratives captured with precision and artistry",
    icon: Camera,
    color: "from-primary",
  },
  {
    id: 2,
    title: "Videography",
    description: "Cinematic videos that tell your brand story with impact",
    icon: Video,
    color: "from-secondary",
  },
  {
    id: 3,
    title: "Graphic Design",
    description: "Innovative designs that elevate your brand identity",
    icon: Palette,
    color: "from-primary",
  },
]

export default function ServicesPreview() {
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
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h2>
          <p className="text-foreground/60 text-lg max-w-2xl mx-auto">
            We specialize in delivering high-quality multimedia solutions
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {services.map((service, idx) => {
            const Icon = service.icon
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="group"
              >
                <div className="glass-effect p-8 rounded-xl border border-border hover:border-primary/30 transition-all duration-300">
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-br ${service.color} to-primary/20 flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:shadow-primary/20 transition-all`}
                  >
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                  <p className="text-foreground/60 text-sm mb-4">{service.description}</p>
                  <Link
                    href="/services"
                    className="text-primary hover:text-primary/80 text-sm font-medium inline-flex items-center gap-2"
                  >
                    Learn more →
                  </Link>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
