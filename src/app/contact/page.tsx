"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react"
import PublicNavBar from "@/components/public/navbar"
import Footer from "@/components/public/footer"
import { siFacebook, siInstagram } from "simple-icons"
import type { SimpleIcon } from "simple-icons"

// Service categories from your schema
const serviceCategories = [
  "PHOTOGRAPHY",
  "VIDEOGRAPHY",
  "GRAPHIC_DESIGN"
] as const

const SimpleIconRenderer = ({ icon, className = "w-5 h-5" }: { icon: SimpleIcon; className?: string }) => (
  <svg
    className={className}
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
  >
    <title>{icon.title}</title>
    <path d={icon.path} />
  </svg>
);

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    message: "",
    category: ""
  })

  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [, setFocusedField] = useState<string | null>(null)

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
      if (!formData.name || !formData.email || !formData.subject || !formData.message) {
        throw new Error("Please fill in all required fields")
      }

      // Validate name length
      if (formData.name.length < 2) {
        throw new Error("Name must be at least 2 characters long")
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        throw new Error("Please enter a valid email address")
      }

      // Validate phone if provided (Malawi format)
      if (formData.phone) {
        const phoneRegex = /^(?:\+265|0)[1-9]\d{7,8}$/
        if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
          throw new Error("Please enter a valid Malawian phone number")
        }
      }

      // Validate message length
      if (formData.message.length < 10) {
        throw new Error("Message must be at least 10 characters long")
      }
      if (formData.message.length > 5000) {
        throw new Error("Message must not exceed 5000 characters")
      }

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          company: formData.company || null,
          subject: formData.subject,
          message: formData.message,
          category: formData.category || null,
          source: "contact_form"
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message')
      }

      // Success!
      setSubmitted(true)
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        subject: "",
        message: "",
        category: ""
      })
      
      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' })
      
      // Clear success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message')
    } finally {
      setLoading(false)
    }
  }

  const contactInfo = [
    { 
      icon: Mail, 
      label: "Email", 
      value: "joelchilapondwa@gmail.com", 
      href: "mailto:joelchilapondwa@gmail.com",
      primary: true
    },
    { 
      icon: Phone, 
      label: "Phone", 
      value: "(+265) 884-849-879", 
      href: "tel:+265884849879",
      primary: true
    },
    { 
      icon: MapPin, 
      label: "Location", 
      value: "Lilongwe, Malawi", 
      href: "https://maps.google.com/?q=Lilongwe,Malawi",
      primary: true
    },
  ]

  // Character counter for message
  const messageLength = formData.message.length
  const maxMessageLength = 5000

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
              Get in <span className="text-primary">Touch</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-xl text-foreground/70"
            >
              Have questions? We&apos;d love to hear from you. Send us a message!
            </motion.p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-20 px-4 relative overflow-hidden">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-effect border border-border rounded-2xl p-8"
            >
              <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400"
                >
                  {error}
                </motion.div>
              )}

              {/* Success Message */}
              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-6 bg-green-500/10 border border-green-500/20 rounded-lg"
                >
                  <h3 className="text-xl font-bold text-green-400 mb-2">Message Sent!</h3>
                  <p className="text-green-400/80">
                    Thank you for contacting us. We&apos;ll get back to you within 24 hours.
                  </p>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold mb-3 text-foreground">
                    Full Name <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("name")}
                    onBlur={() => setFocusedField(null)}
                    required
                    minLength={2}
                    maxLength={100}
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold mb-3 text-foreground">
                    Email <span className="text-primary">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    required
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  />
                </div>

                {/* Phone Field (Optional) */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold mb-3 text-foreground">
                    Phone Number <span className="text-foreground/60">(Optional)</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="0999 123 456 or +265 999 123 456"
                    value={formData.phone}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("phone")}
                    onBlur={() => setFocusedField(null)}
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  />
                </div>

                {/* Company Field (Optional) */}
                <div>
                  <label htmlFor="company" className="block text-sm font-semibold mb-3 text-foreground">
                    Company/Organization <span className="text-foreground/60">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    placeholder="Your company name"
                    value={formData.company}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("company")}
                    onBlur={() => setFocusedField(null)}
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  />
                </div>

                {/* Category Field (Optional) */}
                <div>
                  <label htmlFor="category" className="block text-sm font-semibold mb-3 text-foreground">
                    Interested Service <span className="text-foreground/60">(Optional)</span>
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("category")}
                    onBlur={() => setFocusedField(null)}
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  >
                    <option value="">Select a service (optional)</option>
                    {serviceCategories.map((category) => (
                      <option key={category} value={category}>
                        {category.charAt(0) + category.slice(1).toLowerCase()}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Subject Field */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold mb-3 text-foreground">
                    Subject <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    placeholder="What's this about?"
                    value={formData.subject}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("subject")}
                    onBlur={() => setFocusedField(null)}
                    required
                    minLength={3}
                    maxLength={200}
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  />
                </div>

                {/* Message Field */}
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold mb-3 text-foreground">
                    Message <span className="text-primary">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    placeholder="Tell us more about your project, question, or inquiry..."
                    value={formData.message}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("message")}
                    onBlur={() => setFocusedField(null)}
                    required
                    minLength={10}
                    maxLength={maxMessageLength}
                    rows={5}
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none"
                  />
                  <div className="flex justify-end mt-2">
                    <span className={`text-xs ${
                      messageLength > maxMessageLength * 0.9 
                        ? 'text-yellow-500' 
                        : 'text-foreground/60'
                    }`}>
                      {messageLength}/{maxMessageLength} characters
                    </span>
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:bg-opacity-90 transition-all font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Send Message
                    </>
                  )}
                </motion.button>

                <p className="text-xs text-foreground/60 text-center">
                  By submitting this form, you agree to our{" "}
                  <a href="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </a>
                  .
                </p>
              </form>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                <p className="text-foreground/70 leading-relaxed mb-8">
                  Reach out to us through any of the following channels. We&apos;re here to answer your questions and help
                  bring your vision to life.
                </p>
              </div>

              <div className="space-y-4">
                {contactInfo.map((info) => {
                  const Icon = info.icon
                  return (
                    <motion.a
                      key={info.label}
                      href={info.href}
                      target={info.label === "Location" ? "_blank" : undefined}
                      rel={info.label === "Location" ? "noopener noreferrer" : undefined}
                      whileHover={{ x: 8 }}
                      className="flex items-center gap-4 p-4 glass-effect border border-border rounded-xl hover:border-primary/50 transition-all group"
                    >
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-foreground/60">{info.label}</p>
                        <p className="font-semibold text-foreground">{info.value}</p>
                      </div>
                    </motion.a>
                  )
                })}
              </div>

              {/* Social Links */}
                <div>
                 <h3 className="font-semibold mb-4">Follow Us</h3>
                 <div className="flex gap-4">
                   {[
                     { name: "Instagram", url: "https://www.instagram.com/jay_arts_multimedia?igsh=MWZ5YTl4Mjh3ZG9ndA%3D%3D&utm_source=qr", icon: siInstagram },
                     { name: "Facebook", url: "https://www.facebook.com/share/14Sc9c7Ddb2/?mibextid=wwXIfr", icon: siFacebook },
                   ].map((social) => (
                     <motion.a
                       key={social.name}
                       href={social.url}
                       target="_blank"
                       rel="noopener noreferrer"
                       whileHover={{ scale: 1.1, y: -2 }}
                       className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-primary/10 transition-all text-foreground/60 hover:text-primary hover:border-primary/50"
                       title={social.name}
                     >
                       <SimpleIconRenderer icon={social.icon} />
                     </motion.a>
                   ))}
                 </div>
               </div>

              {/* Map */}
              <div className="glass-effect border border-border rounded-xl overflow-hidden h-64">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d247812.0774011914!2d33.62774924699226!3d-13.954812235920192!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1921d31ffc299805%3A0x4b7eb9f20a03ff9!2sLilongwe!5e0!3m2!1sen!2smw!4v1768295567936!5m2!1sen!2smw" 
                  width="100%" 
                  height="100%"
                  style={{ border: 0 }} 
                  allowFullScreen
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Lilongwe Map"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Business Hours */}
              <div className="glass-effect border border-border rounded-xl p-6">
                <h3 className="font-semibold mb-3">Business Hours</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-foreground/60">Monday - Friday</span>
                    <span className="font-medium">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/60">Saturday</span>
                    <span className="font-medium">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/60">Sunday</span>
                    <span className="font-medium">Closed</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 px-4 bg-card/50 relative overflow-hidden">
          <div className="max-w-4xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-center mb-12"
            >
              Frequently Asked <span className="text-primary">Questions</span>
            </motion.h2>

            <div className="space-y-4">
              {[
                {
                  q: "What's your typical turnaround time?",
                  a: "Standard projects take 1-2 weeks for editing and delivery. Rush services are available for additional fees.",
                },
                {
                  q: "Do you offer revisions?",
                  a: "Yes! All packages include revision rounds. The number depends on your service tier.",
                },
                {
                  q: "Can you work with our existing brand guidelines?",
                  a: "We love collaborating with existing brand systems and can adapt our work accordingly.",
                },
                {
                  q: "What's included in your packages?",
                  a: "Each package includes deliverables like edited files, web-optimized versions, and rights to use the content.",
                },
                {
                  q: "How do I book a service?",
                  a: "You can book directly through our booking page or contact us for custom quotes.",
                },
                {
                  q: "Do you offer discounts for multiple services?",
                  a: "Yes! We offer package deals when booking multiple services. Contact us for a custom quote.",
                },
              ].map((faq, idx) => (
                <motion.div
                  key={faq.q}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                  className="glass-effect border border-border rounded-xl p-6 hover:border-primary/30 transition-colors"
                >
                  <h3 className="font-semibold text-primary mb-2">{faq.q}</h3>
                  <p className="text-foreground/70 text-sm">{faq.a}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}