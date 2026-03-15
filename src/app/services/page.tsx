"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"
import PublicNavBar from "@/components/public/navbar"
import Footer from "@/components/public/footer"
import Link from "next/link"

const services = [
  {
    title: "Photography",
    description: "Professional photography services for brands and events",
    image: "/service-photography.jpg",
    deliverables: [
      "High-resolution edited photos",
      "Web-optimized versions",
      "Proof gallery",
      "Flash disk delivery",
      "Print releases",
    ],
    details: "From corporate events and product photography to portraits and special occasions, our photography services capture moments with artistic precision and technical excellence. We use professional-grade equipment and advanced editing techniques to deliver stunning visuals that tell your story.",
  },
  {
    title: "Videography",
    description: "Cinematic video production for commercials, events, and content",
    image: "/service-videography.jpg",
    deliverables: [
      "4K video files",
      "Multiple formats",
      "Color grading",
      "Sound design",
      "Flash disk delivery",
      "Video highlights",
    ],
    details: "Bring your vision to life with our cinematic videography services. Whether it's brand commercials, event coverage, music videos, or corporate content, we combine creative storytelling with technical expertise to produce compelling visual narratives that engage and inspire your audience.",
  },
  {
    title: "Graphic Design",
    description: "Custom design solutions for brands, print, and digital",
    image: "/service-design.jpg",
    deliverables: [
      "Logo files (All formats)",
      "Brand guidelines",
      "Posters",
      "Banners",
      "Flyers",
      "Brochures",
      "Print-ready files",
    ],
    details: "Transform your brand identity with our comprehensive graphic design solutions. From logo design and brand development to marketing materials and digital assets, we create cohesive visual identities that communicate your brand's essence and leave lasting impressions on your target audience.",
  },
  {
    title: "Live Streaming",
    description: "Professional live streaming for events, conferences, and online content",
    image: "/service-live-streaming.jpg",
    deliverables: [
      "Multi-camera setup",
      "Professional audio",
      "Real-time graphics",
      "Stream to multiple platforms",
      "Recording included",
      "Technical support",
    ],
    details: "Reach a global audience with our professional live streaming services. Whether it's corporate conferences, live events, product launches, or online content, we provide high-quality multi-camera setups, professional audio, and real-time graphics to deliver an engaging broadcast experience that connects with viewers wherever they are.",
  },
]

export default function Services() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <PublicNavBar />

      <main className="pt-20">
        {/* Hero Section with Gold Accent */}
        <section className="py-12 sm:py-16 md:py-20 px-4 relative overflow-hidden">
          <div className="absolute top-10 sm:top-20 right-5 sm:right-10 w-64 sm:w-96 h-64 sm:h-96 bg-primary/15 rounded-full blur-3xl" />
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 text-balance"
            >
              Our{" "}
              <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                Services
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-base sm:text-lg md:text-xl text-foreground/70 px-2"
            >
              Comprehensive multimedia solutions tailored to your needs
            </motion.p>
          </div>
        </section>

        {/* Services */}
        <section className="py-16 sm:py-20 px-4 relative overflow-hidden">
          <div className="absolute top-40 left-2 sm:left-5 w-64 sm:w-80 h-64 sm:h-80 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 sm:bottom-20 right-2 sm:right-5 w-72 sm:w-96 h-72 sm:h-96 bg-primary/10 rounded-full blur-3xl" />

          <div className="max-w-6xl mx-auto space-y-20 sm:space-y-28 relative z-10">
            {services.map((service, serviceIdx) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="grid md:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-start">
                  {/* Image placeholder - you can replace with actual images */}
                  <motion.div
                    initial={{ opacity: 0, x: serviceIdx % 2 === 1 ? 50 : -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    viewport={{ once: true }}
                    className={`${serviceIdx % 2 === 1 ? "md:order-2" : ""}`}
                  >
                    <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20 aspect-video">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-primary/30 text-2xl font-bold">{service.title}</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Content */}
                  <motion.div
                    initial={{ opacity: 0, x: serviceIdx % 2 === 1 ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    viewport={{ once: true }}
                    className={`${serviceIdx % 2 === 1 ? "md:order-1" : ""}`}
                  >
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-primary">
                      {service.title}
                    </h2>
                    <p className="text-lg sm:text-xl text-foreground/80 mb-6 leading-relaxed">
                      {service.description}
                    </p>
                    
                    {/* Detailed description */}
                    <p className="text-foreground/70 mb-8 leading-relaxed">
                      {service.details}
                    </p>

                    {/* Deliverables */}
                    <div>
                      <h3 className="text-xl font-semibold text-primary mb-4">What You Get:</h3>
                      <ul className="grid sm:grid-cols-2 gap-3">
                        {service.deliverables.map((item) => (
                          <li key={item} className="flex items-center gap-3">
                            <Check className="w-5 h-5 text-primary flex-shrink-0" />
                            <span className="text-sm sm:text-base text-foreground/70">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA Button */}
                    <div className="mt-8">
                      <Link
                        href={`/booking?service=${service.title}`}
                        className="inline-flex px-6 py-3 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-lg font-medium hover:shadow-lg hover:shadow-primary/40 transition-all"
                      >
                        Book {service.title}
                      </Link>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-16 sm:py-20 px-4 bg-card/50">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl font-bold mb-12"
            >
              Why Choose <span className="text-primary">JayArts</span>
            </motion.h2>

            <div className="grid sm:grid-cols-3 gap-6">
              {[
                {
                  title: "Professional Quality",
                  description: "Industry-leading equipment and expert techniques"
                },
                {
                  title: "Creative Excellence",
                  description: "Artistic vision that brings your ideas to life"
                },
                {
                  title: "Client Focused",
                  description: "Tailored solutions that meet your specific needs"
                }
              ].map((item, idx) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                  className="glass-effect p-6 rounded-xl border border-border"
                >
                  <h3 className="text-lg font-semibold text-primary mb-2">{item.title}</h3>
                  <p className="text-sm text-foreground/60">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-primary/10 via-secondary/5 to-primary/5 border border-primary/20 rounded-2xl p-8 sm:p-12"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                Ready to Start Your Project?
              </h2>
              <p className="text-foreground/70 mb-8 max-w-2xl mx-auto">
                Contact us to discuss your specific requirements. We&apos;re here to bring your vision to life.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/booking"
                  className="px-6 sm:px-8 py-3 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-lg font-medium hover:shadow-lg hover:shadow-primary/40 transition-all"
                >
                  Book Now
                </Link>
                <Link
                  href="/contact"
                  className="px-6 sm:px-8 py-3 border-2 border-primary text-primary rounded-lg font-medium hover:bg-primary/10 transition-all"
                >
                  Contact Us
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}