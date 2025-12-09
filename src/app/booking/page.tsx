"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import PublicNavBar from "@/components/public/navbar"
import Footer from "@/components/public/footer"

const eventTypes = ["Photography", "Videography", "Design Consultation", "Multi-Service Package"]

export default function Booking() {
  const [formData, setFormData] = useState({
    eventType: "",
    date: "",
    time: "",
    venue: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    budgetRange: "",
    additionalNotes: "",
  })

  const [submitted, setSubmitted] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  const formSections = [
    {
      title: "Event Details",
      fields: ["eventType", "date", "time", "venue", "budgetRange"],
    },
    {
      title: "Contact Information",
      fields: ["contactName", "contactEmail", "contactPhone"],
    },
    {
      title: "Additional Information",
      fields: ["additionalNotes"],
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <div className="bg-background text-foreground min-h-screen">
      <PublicNavBar />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 px-4 relative overflow-hidden">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-6xl font-bold mb-6"
            >
              Book Your <span className="text-primary">Session</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-xl text-foreground/70"
            >
              Let's create something amazing together
            </motion.p>
          </div>
        </section>

        {/* Booking Form */}
        <section className="py-20 px-4 relative overflow-hidden">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-effect border border-border rounded-2xl p-8 md:p-12"
            >
              <form onSubmit={handleSubmit} className="space-y-8">
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
                  {formSections.map((section, sectionIdx) => (
                    <motion.div key={section.title} variants={itemVariants} className="space-y-4">
                      <h3 className="text-lg font-semibold text-primary border-b border-border pb-3">
                        {section.title}
                      </h3>

                      {section.title === "Event Details" && (
                        <>
                          <div>
                            <label className="block text-sm font-semibold mb-3 text-foreground">Event Type *</label>
                            <select
                              name="eventType"
                              value={formData.eventType}
                              onChange={handleChange}
                              onFocus={() => setFocusedField("eventType")}
                              onBlur={() => setFocusedField(null)}
                              required
                              className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:border-primary transition-colors"
                            >
                              <option value="">Select an event type</option>
                              {eventTypes.map((type) => (
                                <option key={type} value={type}>
                                  {type}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-semibold mb-3 text-foreground">Date *</label>
                              <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:border-primary transition-colors"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold mb-3 text-foreground">Time *</label>
                              <input
                                type="time"
                                name="time"
                                value={formData.time}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:border-primary transition-colors"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold mb-3 text-foreground">Venue/Location *</label>
                            <input
                              type="text"
                              name="venue"
                              placeholder="Where will the event take place?"
                              value={formData.venue}
                              onChange={handleChange}
                              required
                              className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:border-primary transition-colors"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold mb-3 text-foreground">Budget Range *</label>
                            <select
                              name="budgetRange"
                              value={formData.budgetRange}
                              onChange={handleChange}
                              required
                              className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:border-primary transition-colors"
                            >
                              <option value="">Select budget range</option>
                              <option value="under-1000">Under $1,000</option>
                              <option value="1000-2500">$1,000 - $2,500</option>
                              <option value="2500-5000">$2,500 - $5,000</option>
                              <option value="5000-10000">$5,000 - $10,000</option>
                              <option value="10000+">$10,000+</option>
                            </select>
                          </div>
                        </>
                      )}

                      {section.title === "Contact Information" && (
                        <>
                          <div>
                            <label className="block text-sm font-semibold mb-3 text-foreground">Full Name *</label>
                            <input
                              type="text"
                              name="contactName"
                              placeholder="Your full name"
                              value={formData.contactName}
                              onChange={handleChange}
                              required
                              className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:border-primary transition-colors"
                            />
                          </div>

                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-semibold mb-3 text-foreground">Email *</label>
                              <input
                                type="email"
                                name="contactEmail"
                                placeholder="your@email.com"
                                value={formData.contactEmail}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:border-primary transition-colors"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold mb-3 text-foreground">Phone *</label>
                              <input
                                type="tel"
                                name="contactPhone"
                                placeholder="(555) 123-4567"
                                value={formData.contactPhone}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:border-primary transition-colors"
                              />
                            </div>
                          </div>
                        </>
                      )}

                      {section.title === "Additional Information" && (
                        <div>
                          <label className="block text-sm font-semibold mb-3 text-foreground">Additional Notes</label>
                          <textarea
                            name="additionalNotes"
                            placeholder="Tell us more about your project, vision, or any special requests..."
                            value={formData.additionalNotes}
                            onChange={handleChange}
                            rows={5}
                            className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:border-primary transition-colors resize-none"
                          />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </motion.div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:bg-opacity-90 transition-all font-semibold text-lg"
                >
                  {submitted ? "Booking Request Received!" : "Send Booking Request"}
                </motion.button>

                {submitted && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-center"
                  >
                    Thank you! We'll get back to you within 24 hours.
                  </motion.div>
                )}
              </form>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
