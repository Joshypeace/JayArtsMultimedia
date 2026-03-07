/* eslint-disable @next/next/no-img-element */
"use client"

import Link from "next/link"
import { Mail, Phone, MapPin,  } from "lucide-react"
import { siFacebook, siInstagram, } from "simple-icons"
import { motion } from "framer-motion"

export default function Footer() {
  const currentYear = new Date().getFullYear()

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

  const socialLinks = [
    { icon: siInstagram, label: "Instagram", link: "https://www.instagram.com/jay_arts_multimedia?igsh=MWZ5YTl4Mjh3ZG9ndA%3D%3D&utm_source=qr" },
    { icon: siFacebook, label: "Facebook", link: "https://www.facebook.com/share/14Sc9c7Ddb2/?mibextid=wwXIfr" },
  ]

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <motion.div
          className="grid md:grid-cols-4 gap-8 mb-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Brand */}
         <motion.div variants={itemVariants}>
            <div className="flex items-center gap-2 mb-4">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <img
                  src="/Jayarts.png"
                  alt="JayArts Logo"
                  width={100}
                  height={100}
                  className="object-contain"
                />
              </motion.div>
          
            </div>
          
            <p className="text-foreground/60 text-sm">
              Professional multimedia agency creating cinematic visual experiences.
            </p>
          </motion.div>

          {/* Links */}
          <motion.div variants={itemVariants}>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {[
                { label: "About", href: "/about" },
                { label: "Services", href: "/services" },
                { label: "Portfolio", href: "/portfolio" },
                { label: "Blog", href: "/blog" },
              ].map((link) => (
                <motion.li key={link.href} whileHover={{ x: 5 }} transition={{ type: "spring" }}>
                  <Link href={link.href} className="text-foreground/60 hover:text-primary text-sm transition-colors">
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div variants={itemVariants}>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              {[
                { icon: Mail, text: "joelchilapondwa@gmail.com" },
                { icon: Phone, text: "(+265) 884-849-879" },
                { icon: MapPin, text: "Lilongwe, Malawi" },
              ].map((item, idx) => {
                const Icon = item.icon
                return (
                  <motion.li
                    key={idx}
                    className="flex items-center gap-2 text-foreground/60 text-sm"
                    whileHover={{ x: 5 }}
                  >
                    <Icon size={16} className="text-primary" />
                    {item.text}
                  </motion.li>
                )
              })}
            </ul>
          </motion.div>

          {/* Social */}
          <motion.div variants={itemVariants}>
            <h3 className="font-semibold mb-4">Follow Us</h3>
            <div className="flex gap-3">
              {socialLinks.map((link, idx) => {
                return (
                  <motion.a
                    key={idx}
                    href={link.link}
                    className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-primary/10 transition-colors"
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-primary" dangerouslySetInnerHTML={{ __html: link.icon.svg }} />
                  </motion.a>
                )
              })}
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="text-foreground/60 text-sm">© {currentYear} JayArts Multimedia. All rights reserved.</p>
          <div className="flex gap-6">
  {[
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ].map((item) => (
    <motion.div
      key={item.label} // <-- FIX HERE
      whileHover={{ x: 3 }}
      transition={{ type: "spring" }}
    >
      <Link href={item.href} className="text-foreground/60 hover:text-primary text-sm transition-colors">
        {item.label}
      </Link>
    </motion.div>
  ))}
</div>

        </motion.div>
      </div>
    </footer>
  )
}
