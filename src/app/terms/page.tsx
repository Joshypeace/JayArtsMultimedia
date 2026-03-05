"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import PublicNavBar from "@/components/public/navbar"
import Footer from "@/components/public/footer"
import { 
  FileText, 
  Scale, 
  Camera, 
  DollarSign, 
  Calendar, 
  Shield, 
  Clock, 
  AlertCircle,
  CheckCircle,
  XCircle,
  HelpCircle
} from "lucide-react"

export default function TermsOfService() {
  const lastUpdated = "March 5, 2026"

  const sections = [
    {
      icon: FileText,
      title: "1. Agreement to Terms",
      content: `By accessing or using the services provided by JayArts Multimedia ("we," "our," or "us"), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access our services. These terms apply to all visitors, users, and others who wish to access or use our services.`
    },
    {
      icon: Scale,
      title: "2. Services Description",
      content: `JayArts Multimedia provides professional photography, videography, and graphic design services. Our services include but are not limited to:`,
      list: [
        "Wedding and event photography",
        "Commercial and corporate photography",
        "Portrait sessions",
        "Event videography",
        "Commercial video production",
        "Brand identity design",
        "Logo design and branding packages"
      ]
    },
    {
      icon: Camera,
      title: "3. Bookings and Scheduling",
      content: `When booking our services, you agree to:`,
      list: [
        "Provide accurate and complete information",
        "Confirm the date, time, and location of your event",
        "Ensure access to the venue at the scheduled time",
        "Notify us of any changes or cancellations at least 48 hours in advance",
        "Arrive at the scheduled time (for portrait sessions)"
      ]
    },
    {
      icon: DollarSign,
      title: "4. Pricing and Payments",
      content: `Our pricing structure is as follows:`,
      list: [
        "A 50% deposit is required to secure your booking",
        "The remaining balance is due on or before the day of service",
        "All prices are quoted in Malawian Kwacha (MWK)",
        "Custom packages may be arranged upon request",
        "Prices are subject to change with notice"
      ]
    },
    {
      icon: Calendar,
      title: "5. Cancellation and Refund Policy",
      content: `Our cancellation policy is as follows:`,
      list: [
        "Cancellations made 7+ days before the event: Full refund of deposit",
        "Cancellations made 3-6 days before the event: 50% refund of deposit",
        "Cancellations made less than 48 hours before: No refund",
        "In case of illness or emergency, we will work with you to reschedule",
        "If we need to cancel due to unforeseen circumstances, you'll receive a full refund"
      ]
    },
    {
      icon: Clock,
      title: "6. Delivery Timeline",
      content: `We strive to deliver your final products within the following timeframes:`,
      list: [
        "Event photography: 2-3 weeks",
        "Portrait sessions: 1-2 weeks",
        "Videography projects: 3-4 weeks",
        "Design projects: 1-2 weeks (depending on complexity)",
        "Rush delivery options available for additional fee"
      ]
    },
    {
      icon: Shield,
      title: "7. Intellectual Property",
      content: `All images, videos, and designs created by JayArts Multimedia remain our intellectual property until full payment is received. Upon full payment, you receive:`,
      list: [
        "A license to use the images for personal or commercial use as agreed",
        "Digital files in agreed-upon formats",
        "Print release for personal printing",
        "We retain the right to use images in our portfolio and marketing"
      ]
    },
    {
      icon: AlertCircle,
      title: "8. Client Responsibilities",
      content: `As a client, you agree to:`,
      list: [
        "Obtain necessary permissions for photography at your venue",
        "Inform guests that photography/videography will take place",
        "Provide accurate information about your event",
        "Communicate any special requirements in advance",
        "Treat our team with respect and professionalism"
      ]
    },
    {
      icon: CheckCircle,
      title: "9. Limitation of Liability",
      content: `To the maximum extent permitted by law, JayArts Multimedia shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:`,
      list: [
        "Your access to or use of or inability to access or use the services",
        "Any conduct or content of any third party on the services",
        "Any content obtained from the services",
        "Unauthorized access, use, or alteration of your transmissions or content"
      ]
    },
    {
      icon: XCircle,
      title: "10. Termination",
      content: `We may terminate or suspend your access to our services immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the services will immediately cease.`
    },
    {
      icon: HelpCircle,
      title: "11. Governing Law",
      content: `These Terms shall be governed and construed in accordance with the laws of Malawi, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.`
    }
  ]

  const faqs = [
    {
      q: "What happens if it rains on my outdoor event?",
      a: "We monitor weather conditions and will work with you to find alternative arrangements. If conditions are unsafe, we can reschedule at no additional cost."
    },
    {
      q: "Can I get raw/unedited images?",
      a: "We provide professionally edited images only. Raw files are not included in our packages as they don't represent our professional standards."
    },
    {
      q: "How many photos will I receive?",
      a: "This depends on your package and event duration. Typically, you can expect 50-100 photos per hour of coverage, all professionally edited."
    },
    {
      q: "Do you travel for events?",
      a: "Yes, we travel throughout Malawi and internationally. Travel fees may apply for locations outside Lilongwe."
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
                <Scale className="w-10 h-10 text-primary" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Terms of <span className="text-primary">Service</span>
              </h1>
              <p className="text-xl text-foreground/70 mb-4">
                Please read these terms carefully before using our services
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
            {/* Important Notice */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-yellow-500/5 border border-yellow-500/20 rounded-2xl p-6 mb-12"
            >
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-lg mb-2">Important Notice</h3>
                  <p className="text-foreground/70">
                    By booking our services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you are booking on behalf of an organization, you represent that you have the authority to bind that organization to these terms.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Terms Sections */}
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

            {/* FAQ Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="mt-16"
            >
              <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
              <div className="grid gap-4">
                {faqs.map((faq, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.3 + idx * 0.1 }}
                    className="bg-card border border-border rounded-xl p-6 hover:border-primary/30 transition-colors"
                  >
                    <h3 className="font-bold text-lg mb-2 text-primary">{faq.q}</h3>
                    <p className="text-foreground/70">{faq.a}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Contact Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6 }}
              className="mt-12 bg-gradient-to-br from-primary/10 via-secondary/5 to-primary/5 border border-primary/20 rounded-2xl p-8 text-center"
            >
              <h2 className="text-2xl font-bold mb-4">Have Questions?</h2>
              <p className="text-foreground/70 mb-6">
                If you have any questions about these Terms of Service, please contact us.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-opacity-90 transition-all"
                >
                  Contact Us
                </Link>
                <Link
                  href="/booking"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-all"
                >
                  Book Services
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