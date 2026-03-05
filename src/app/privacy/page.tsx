"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import PublicNavBar from "@/components/public/navbar"
import Footer from "@/components/public/footer"
import { Shield, Eye, Lock, Mail, Calendar, Database, Cookie, Users, FileText, Globe } from "lucide-react"

export default function PrivacyPolicy() {
  const lastUpdated = "March 5, 2026"

  const sections = [
    {
      icon: Shield,
      title: "Introduction",
      content: `JayArts Multimedia ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.`
    },
    {
      icon: Database,
      title: "Information We Collect",
      content: `We may collect personal information that you voluntarily provide to us when you express an interest in obtaining information about us or our products and services, when you participate in activities on the website, or otherwise when you contact us. The personal information we collect may include:`,
      list: [
        "Name and contact information (email address, phone number)",
        "Booking details and preferences",
        "Event dates and locations",
        "Payment information (processed securely through third-party providers)",
        "Communications you send to us",
        "Photography preferences and requirements"
      ]
    },
    {
      icon: Globe,
      title: "Information Automatically Collected",
      content: `When you visit our website, we may automatically collect certain information about your device and usage patterns. This information may include:`,
      list: [
        "IP address and browser type",
        "Device information (operating system, screen resolution)",
        "Pages visited and time spent on pages",
        "Referring website addresses",
        "Cookies and similar tracking technologies"
      ]
    },
    {
      icon: Eye,
      title: "How We Use Your Information",
      content: `We use the information we collect to:`,
      list: [
        "Process and manage your bookings",
        "Communicate with you about your projects",
        "Send you updates, marketing communications, and promotional materials",
        "Improve our website and services",
        "Comply with legal obligations",
        "Protect against fraudulent or unauthorized transactions"
      ]
    },
    {
      icon: Lock,
      title: "Sharing Your Information",
      content: `We do not sell, trade, or rent your personal information to third parties. We may share your information with:`,
      list: [
        "Service providers who assist in operating our website and conducting our business",
        "Payment processors for secure transaction handling",
        "Professional advisors (lawyers, accountants) when necessary",
        "Law enforcement or government agencies when required by law"
      ]
    },
    {
      icon: Cookie,
      title: "Cookies and Tracking Technologies",
      content: `We use cookies and similar tracking technologies to track activity on our website and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our website.`
    },
    {
      icon: Mail,
      title: "Your Privacy Rights",
      content: `Depending on your location, you may have the following rights regarding your personal information:`,
      list: [
        "Access the personal information we hold about you",
        "Request correction of inaccurate information",
        "Request deletion of your information",
        "Object to processing of your information",
        "Request transfer of your information",
        "Withdraw consent at any time"
      ]
    },
    {
      icon: Calendar,
      title: "Data Retention",
      content: `We will retain your personal information only for as long as necessary to fulfill the purposes outlined in this privacy policy, unless a longer retention period is required or permitted by law. When we have no ongoing legitimate business need to process your personal information, we will either delete or anonymize it.`
    },
    {
      icon: Users,
      title: "Children's Privacy",
      content: `Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If you become aware that a child has provided us with personal information, please contact us immediately.`
    },
    {
      icon: FileText,
      title: "Changes to This Privacy Policy",
      content: `We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.`
    }
  ]

  return (
    <div className="bg-background text-foreground min-h-screen">
      <PublicNavBar />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 px-4 relative overflow-hidden">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
                <Shield className="w-10 h-10 text-primary" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Privacy <span className="text-primary">Policy</span>
              </h1>
              <p className="text-xl text-foreground/70 mb-4">
                How we protect and handle your information
              </p>
              <p className="text-sm text-foreground/50">
                Last Updated: {lastUpdated}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-12 px-4 relative overflow-hidden">
          <div className="max-w-4xl mx-auto">
            {/* Quick Summary Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-primary/5 border border-primary/20 rounded-2xl p-8 mb-12"
            >
              <h2 className="text-2xl font-bold mb-4 text-primary">Quick Summary</h2>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <Lock className="w-6 h-6 text-primary" />
                  </div>
                  <p className="font-medium">Your data is secure</p>
                </div>
                <div>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <Eye className="w-6 h-6 text-primary" />
                  </div>
                  <p className="font-medium">We never sell your info</p>
                </div>
                <div>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <p className="font-medium">You control your data</p>
                </div>
              </div>
            </motion.div>

            {/* Policy Sections */}
            <div className="space-y-8">
              {sections.map((section, idx) => {
                const Icon = section.icon
                return (
                  <motion.div
                    key={section.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * idx }}
                    className="bg-card border border-border rounded-xl p-6 hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-xl font-bold mb-3">{section.title}</h2>
                        <p className="text-foreground/70 leading-relaxed mb-4">
                          {section.content}
                        </p>
                        {section.list && (
                          <ul className="space-y-2">
                            {section.list.map((item, i) => (
                              <li key={i} className="flex items-start gap-2 text-foreground/70">
                                <span className="text-primary mt-1">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Contact Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="mt-12 bg-gradient-to-br from-primary/10 via-secondary/5 to-primary/5 border border-primary/20 rounded-2xl p-8 text-center"
            >
              <h2 className="text-2xl font-bold mb-4">Questions About Privacy?</h2>
              <p className="text-foreground/70 mb-6">
                If you have any questions about this Privacy Policy, please contact us.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-opacity-90 transition-all"
                >
                  <Mail size={18} />
                  Contact Us
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-all"
                >
                  Return Home
                </Link>
              </div>
            </motion.div>

            {/* Footer Note */}
            <div className="mt-8 text-center text-sm text-foreground/40">
              <p>© {new Date().getFullYear()} JayArts Multimedia. All rights reserved.</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}