"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import PublicNavBar from "@/components/public/navbar"
import Footer from "@/components/public/footer"

const teamMembers = [
  {
    name: "Jordan Jay",
    role: "Creative Director",
    bio: "Visionary filmmaker with 10+ years in cinematic production",
    image: "/team-member-1.jpg",
  },
  {
    name: "Alex Rivers",
    role: "Lead Photographer",
    bio: "Award-winning photographer specializing in luxury brands",
    image: "/team-member-2.jpg",
  },
  {
    name: "Sam Morgan",
    role: "Design Lead",
    bio: "Brand strategist and graphic design innovator",
    image: "/team-member-3.jpg",
  },
  {
    name: "Casey Wilson",
    role: "Video Producer",
    bio: "Expert in post-production and visual effects",
    image: "/team-member-4.jpg",
  },
]

const values = [
  { title: "Excellence", description: "We deliver premium work that exceeds expectations" },
  { title: "Innovation", description: "Constantly pushing creative boundaries" },
  { title: "Collaboration", description: "Partnering closely with clients for success" },
  { title: "Integrity", description: "Building trust through honesty and professionalism" },
]

export default function About() {
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
              About <span className="text-primary">JayArts</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-xl text-foreground/70"
            >
              Crafting visual stories that inspire, engage, and transform brands
            </motion.p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20 px-4 relative overflow-hidden">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Image
                src="/about-image.jpg"
                alt="JayArts workspace"
                width={500}
                height={400}
                className="rounded-xl object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold mb-4 text-primary">Our Mission</h2>
                  <p className="text-foreground/70 leading-relaxed">
                    To deliver exceptional multimedia solutions that transform brands and captivate audiences through
                    innovative storytelling, technical excellence, and creative vision.
                  </p>
                </div>
                <div>
                  <h2 className="text-3xl font-bold mb-4 text-primary">Our Vision</h2>
                  <p className="text-foreground/70 leading-relaxed">
                    To be the most trusted multimedia partner for brands seeking to make a lasting impact through
                    photography, videography, and design that transcends expectations.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 px-4 bg-card/50 relative overflow-hidden">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-4xl font-bold text-center mb-16"
            >
              Our <span className="text-primary">Core Values</span>
            </motion.h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, idx) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                  className="glass-effect p-6 rounded-xl border border-border"
                >
                  <h3 className="text-xl font-semibold text-primary mb-3">{value.title}</h3>
                  <p className="text-foreground/60 text-sm">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-20 px-4 relative overflow-hidden">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-4xl font-bold text-center mb-16"
            >
              Meet the <span className="text-primary">Team</span>
            </motion.h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamMembers.map((member, idx) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8 }}
                  className="group"
                >
                  <div className="relative overflow-hidden rounded-xl mb-4 h-64">
                    <Image
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-lg font-semibold">{member.name}</h3>
                  <p className="text-primary text-sm mb-2">{member.role}</p>
                  <p className="text-foreground/60 text-sm">{member.bio}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* History */}
        <section className="py-20 px-4 bg-card/50 relative overflow-hidden">
          <div className="max-w-4xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-4xl font-bold text-center mb-12"
            >
              Our <span className="text-primary">Journey</span>
            </motion.h2>

            <div className="space-y-8">
              {[
                { year: "2015", title: "Founded", desc: "JayArts began as a passion project for visual storytelling" },
                { year: "2017", title: "First Milestone", desc: "Expanded team and opened first studio" },
                { year: "2020", title: "Digital Innovation", desc: "Embraced new technologies and expanded services" },
                { year: "2024", title: "Industry Leaders", desc: "Recognized as top creative agency in the region" },
              ].map((item, idx) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className={`flex gap-6 ${idx % 2 === 1 ? "flex-row-reverse" : ""}`}
                >
                  <div className="flex-shrink-0 w-24">
                    <div className="text-3xl font-bold text-primary">{item.year}</div>
                  </div>
                  <div className="flex-grow glass-effect p-6 rounded-xl border border-border">
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-foreground/60">{item.desc}</p>
                  </div>
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
