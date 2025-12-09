"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"
import PublicNavBar from "@/components/public/navbar"
import Footer from "@/components/public/footer"

const services = [
  {
    title: "Photography",
    description: "Professional photography services for brands and events",
    image: "/service-photography.jpg",
    packages: [
      {
        name: "Bronze",
        price: "MWK 400,000",
        features: ["1 Photographer", "50+ Edited Photos", "Pictures in flash disk", "Event Coverage"],
      },
      {
        name: "Silver",
        price: "MWK 650,000",
        features: [
          "1 Photographer",
          "100+ Edited Photos",
          "Pictures in flash disk",
          "1 A4 Framed Picture",
          "100 Hardcopy Pictures",
        ],
        isPopular: true,
      },
      {
        name: "Gold",
        price: "MWK 900,000",
        features: [
          "1 Photographer",
          "Unlimited Photos",
          "1 A3 Framed Picture",
          "100 Hardcopy Pictures in Album",
          "Premium Editing",
        ],
      },
    ],
    deliverables: [
      "High-resolution edited photos",
      "Web-optimized versions",
      "Proof gallery",
      "Flash disk delivery",
      "Print releases",
    ],
  },
  {
    title: "Videography",
    description: "Cinematic video production for commercials, events, and content",
    image: "/service-videography.jpg",
    packages: [
      {
        name: "Bronze",
        price: "MWK 400,000",
        features: ["1 Video Camera", "Full Video in Flash Disk", "Video Highlights", "1 Photographer"],
      },
      {
        name: "Silver",
        price: "MWK 650,000",
        features: [
          "2 Video Cameras",
          "Full Video in Flash Disk",
          "Video Highlights",
          "1 Photographer",
          "1 A4 Framed Picture",
        ],
        isPopular: true,
      },
      {
        name: "Gold",
        price: "MWK 900,000",
        features: [
          "3 Video Cameras",
          "Full Video in Flash Disk",
          "Video Highlights",
          "1 A3 Framed Picture",
          "100 Hardcopy Pictures in Album",
        ],
      },
    ],
    deliverables: [
      "4K video files",
      "Multiple formats",
      "Color grading",
      "Sound design",
      "Flash disk delivery",
      "Video highlights",
    ],
  },
  {
    title: "Graphic Design",
    description: "Custom design solutions for brands, print, and digital",
    image: "/service-design.jpg",
    packages: [
      {
        name: "Bronze",
        price: "MWK 400,000",
        features: ["Logo Design", "3 Concepts", "2 Revisions", "Basic Deliverables"],
      },
      {
        name: "Silver",
        price: "MWK 650,000",
        features: ["Full Branding Kit", "5+ Concepts", "4 Revisions", "Brand Guidelines", "Extended Support"],
        isPopular: true,
      },
      {
        name: "Gold",
        price: "MWK 900,000",
        features: [
          "Complete Brand System",
          "Unlimited Concepts",
          "Unlimited Revisions",
          "Print & Digital Assets",
          "Premium Support",
        ],
      },
    ],
    deliverables: [
      "Logo files (All formats)",
      "Brand guidelines",
      "Color palette",
      "Typography guide",
      "Social media templates",
      "Print-ready files",
    ],
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

          <div className="max-w-6xl mx-auto space-y-16 sm:space-y-20 relative z-10">
            {services.map((service, serviceIdx) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center mb-12 sm:mb-16">
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    viewport={{ once: true }}
                    className={serviceIdx % 2 === 1 ? "md:order-2" : ""}
                  >
                    <div className="bg-gradient-to-br from-primary/25 to-transparent rounded-xl aspect-video" />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    viewport={{ once: true }}
                    className={serviceIdx % 2 === 1 ? "md:order-1" : ""}
                  >
                    <h2 className="text-3xl sm:text-4xl md:text-4xl font-bold mb-3 sm:mb-4 text-primary">
                      {service.title}
                    </h2>
                    <p className="text-base sm:text-lg text-foreground/70 mb-6 sm:mb-8">{service.description}</p>

                    <div>
                      <h3 className="text-lg font-semibold text-primary mb-4">Deliverables:</h3>
                      <ul className="space-y-2 sm:space-y-3">
                        {service.deliverables.map((item) => (
                          <li key={item} className="flex items-center gap-3">
                            <Check className="w-5 h-5 text-primary flex-shrink-0" />
                            <span className="text-sm sm:text-base text-foreground/70">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                </div>

                {/* Packages */}
                <div>
                  <h3 className="text-2xl sm:text-2xl font-bold mb-6 sm:mb-8 text-center text-primary">
                    Service Packages
                  </h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {service.packages.map((pkg, pkgIdx) => (
                      <motion.div
                        key={pkg.name}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: pkgIdx * 0.1, duration: 0.6 }}
                        viewport={{ once: true }}
                        className={`glass-effect rounded-xl p-4 sm:p-6 transition-all relative overflow-hidden group ${
                          pkg.isPopular
                            ? "border-2 border-primary lg:scale-110 shadow-lg shadow-primary/30 sm:scale-105"
                            : "border-2 border-border hover:border-primary/50"
                        }`}
                      >
                        {pkg.isPopular && (
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/15 to-transparent pointer-events-none" />
                        )}

                        {pkg.isPopular && (
                          <div className="text-center mb-4">
                            <span className="inline-block px-3 sm:px-4 py-1 bg-primary text-primary-foreground rounded-full text-xs sm:text-sm font-semibold">
                              POPULAR
                            </span>
                          </div>
                        )}
                        <h4 className="text-xl sm:text-2xl font-bold mb-2 text-primary">{pkg.name}</h4>
                        <div className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                          {pkg.price}
                        </div>
                        <ul className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                          {pkg.features.map((feature) => (
                            <li key={feature} className="flex items-center gap-2">
                              <Check className="w-4 h-4 text-primary flex-shrink-0" />
                              <span className="text-xs sm:text-sm text-foreground/70">{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <button
                          className={`w-full py-2 sm:py-3 rounded-lg font-medium transition-all relative z-10 text-sm sm:text-base ${
                            pkg.isPopular
                              ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:shadow-lg hover:shadow-primary/40"
                              : "bg-primary/20 text-primary hover:bg-primary/30"
                          }`}
                        >
                          Get Started
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
