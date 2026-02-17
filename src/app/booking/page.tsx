"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import PublicNavBar from "@/components/public/navbar"
import Footer from "@/components/public/footer"
import { useSearchParams } from "next/navigation"

const eventTypes = [
  "Wedding Photography",
  "Corporate Event Photography",
  "Product Photography",
  "Portrait Photography",
  "Event Videography",
  "Commercial Videography",
  "Brand Design",
  "Logo Design",
  "Multi-Service Package"
]

const budgetRanges = [
  { value: "under-500000", label: "Under MWK 500,000" },
  { value: "500000-1000000", label: "MWK 500,000 - 1,000,000" },
  { value: "1000000-2500000", label: "MWK 1,000,000 - 2,500,000" },
  { value: "2500000-5000000", label: "MWK 2,500,000 - 5,000,000" },
  { value: "5000000+", label: "MWK 5,000,000+" }
]

export default function Booking() {
  const searchParams = useSearchParams()
  const serviceParam = searchParams.get('service')
  const packageParam = searchParams.get('package')

  const [formData, setFormData] = useState({
    eventType: "",
    eventDate: "",
    time: "",
    venue: "",
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    company: "",
    budgetRange: "",
    additionalNotes: "",
  })

  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [, setFocusedField] = useState<string | null>(null)

  // Pre-fill form if coming from services page
  useEffect(() => {
    if (serviceParam) {
      setFormData(prev => ({
        ...prev,
        eventType: serviceParam,
        additionalNotes: packageParam 
          ? `Interested in: ${packageParam} package\n${prev.additionalNotes}`
          : `Interested in: ${serviceParam} service\n${prev.additionalNotes}`
      }))
    }
  }, [serviceParam, packageParam])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSubmitted(false)

    try {
      // Validate required fields
      if (!formData.eventType || !formData.eventDate || !formData.clientName || !formData.clientEmail) {
        throw new Error("Please fill in all required fields")
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.clientEmail)) {
        throw new Error("Please enter a valid email address")
      }

      // Validate phone number (basic validation)
      if (formData.clientPhone && formData.clientPhone.length < 10) {
        throw new Error("Please enter a valid phone number")
      }

      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventType: formData.eventType,
          eventDate: formData.eventDate,
          time: formData.time,
          venue: formData.venue,
          clientName: formData.clientName,
          clientEmail: formData.clientEmail,
          clientPhone: formData.clientPhone,
          company: formData.company || null,
          budgetRange: formData.budgetRange,
          additionalNotes: formData.additionalNotes,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit booking')
      }

      // Success!
      setSubmitted(true)
      
      // Reset form
      setFormData({
        eventType: "",
        eventDate: "",
        time: "",
        venue: "",
        clientName: "",
        clientEmail: "",
        clientPhone: "",
        company: "",
        budgetRange: "",
        additionalNotes: "",
      })
      
      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' })
      
      // Clear success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit booking. Please try again.')
      console.error('Booking submission error:', err)
    } finally {
      setLoading(false)
    }
  }

  const formSections = [
    {
      title: "Event Details",
      fields: ["eventType", "eventDate", "time", "venue", "budgetRange"],
    },
    {
      title: "Contact Information",
      fields: ["clientName", "clientEmail", "clientPhone", "company"],
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

  // Get today's date for min attribute
  const today = new Date().toISOString().split('T')[0]

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
              Let&apos;s create something amazing together
            </motion.p>
          </div>
        </section>

        {/* Booking Form */}
        <section className="py-20 px-4 relative overflow-hidden">
          <div className="max-w-2xl mx-auto">
            {/* Success Message */}
            {submitted && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-6 bg-green-500/10 border border-green-500/20 rounded-lg"
              >
                <h3 className="text-xl font-bold text-green-400 mb-2">Booking Request Received!</h3>
                <p className="text-green-400/80">
                  Thank you for your booking request. We&apos;ll review your details and get back to you within 24 hours.
                </p>
                <p className="text-sm text-green-400/60 mt-2">
                  A confirmation has been sent to your email.
                </p>
              </motion.div>
            )}

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400"
              >
                {error}
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-effect border border-border rounded-2xl p-8 md:p-12"
            >
              <form onSubmit={handleSubmit} className="space-y-8">
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
                  {formSections.map((section) => (
                    <motion.div key={section.title} variants={itemVariants} className="space-y-4">
                      <h3 className="text-lg font-semibold text-primary border-b border-border pb-3">
                        {section.title}
                      </h3>

                      {section.title === "Event Details" && (
                        <>
                          <div>
                            <label htmlFor="eventType" className="block text-sm font-semibold mb-3 text-foreground">
                              Service Type <span className="text-primary">*</span>
                            </label>
                            <select
                              id="eventType"
                              name="eventType"
                              value={formData.eventType}
                              onChange={handleChange}
                              onFocus={() => setFocusedField("eventType")}
                              onBlur={() => setFocusedField(null)}
                              required
                              className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                            >
                              <option value="">Select a service type</option>
                              {eventTypes.map((type) => (
                                <option key={type} value={type}>
                                  {type}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="eventDate" className="block text-sm font-semibold mb-3 text-foreground">
                                Event Date <span className="text-primary">*</span>
                              </label>
                              <input
                                type="date"
                                id="eventDate"
                                name="eventDate"
                                value={formData.eventDate}
                                onChange={handleChange}
                                min={today}
                                required
                                className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                              />
                            </div>
                            <div>
                              <label htmlFor="time" className="block text-sm font-semibold mb-3 text-foreground">
                                Preferred Time <span className="text-primary">*</span>
                              </label>
                              <input
                                type="time"
                                id="time"
                                name="time"
                                value={formData.time}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                              />
                            </div>
                          </div>

                          <div>
                            <label htmlFor="venue" className="block text-sm font-semibold mb-3 text-foreground">
                              Venue/Location <span className="text-primary">*</span>
                            </label>
                            <input
                              type="text"
                              id="venue"
                              name="venue"
                              placeholder="Where will the event take place?"
                              value={formData.venue}
                              onChange={handleChange}
                              required
                              className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                            />
                          </div>

                          <div>
                            <label htmlFor="budgetRange" className="block text-sm font-semibold mb-3 text-foreground">
                              Budget Range <span className="text-primary">*</span>
                            </label>
                            <select
                              id="budgetRange"
                              name="budgetRange"
                              value={formData.budgetRange}
                              onChange={handleChange}
                              required
                              className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                            >
                              <option value="">Select budget range (MWK)</option>
                              {budgetRanges.map((range) => (
                                <option key={range.value} value={range.value}>
                                  {range.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </>
                      )}

                      {section.title === "Contact Information" && (
                        <>
                          <div>
                            <label htmlFor="clientName" className="block text-sm font-semibold mb-3 text-foreground">
                              Full Name <span className="text-primary">*</span>
                            </label>
                            <input
                              type="text"
                              id="clientName"
                              name="clientName"
                              placeholder="Your full name"
                              value={formData.clientName}
                              onChange={handleChange}
                              required
                              className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                            />
                          </div>

                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="clientEmail" className="block text-sm font-semibold mb-3 text-foreground">
                                Email <span className="text-primary">*</span>
                              </label>
                              <input
                                type="email"
                                id="clientEmail"
                                name="clientEmail"
                                placeholder="your@email.com"
                                value={formData.clientEmail}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                              />
                            </div>
                            <div>
                              <label htmlFor="clientPhone" className="block text-sm font-semibold mb-3 text-foreground">
                                Phone <span className="text-primary">*</span>
                              </label>
                              <input
                                type="tel"
                                id="clientPhone"
                                name="clientPhone"
                                placeholder="0999 123 456"
                                value={formData.clientPhone}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                              />
                            </div>
                          </div>

                          <div>
                            <label htmlFor="company" className="block text-sm font-semibold mb-3 text-foreground">
                              Company/Organization (Optional)
                            </label>
                            <input
                              type="text"
                              id="company"
                              name="company"
                              placeholder="Your company name"
                              value={formData.company}
                              onChange={handleChange}
                              className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                            />
                          </div>
                        </>
                      )}

                      {section.title === "Additional Information" && (
                        <div>
                          <label htmlFor="additionalNotes" className="block text-sm font-semibold mb-3 text-foreground">
                            Project Details & Special Requests
                          </label>
                          <textarea
                            id="additionalNotes"
                            name="additionalNotes"
                            placeholder="Tell us more about your project, vision, or any special requests..."
                            value={formData.additionalNotes}
                            onChange={handleChange}
                            rows={5}
                            className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none"
                          />
                          <p className="text-xs text-foreground/60 mt-2">
                            Max 500 characters
                          </p>
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
                  disabled={loading}
                  className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:bg-opacity-90 transition-all font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    "Send Booking Request"
                  )}
                </motion.button>

                <p className="text-xs text-foreground/60 text-center">
                  By submitting this form, you agree to our{" "}
                  <a href="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </a>
                  .
                </p>
              </form>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}