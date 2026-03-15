"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import PublicNavBar from "@/components/public/navbar"
import Footer from "@/components/public/footer"

// Social icon component for consistent styling
const SocialIcon = ({ 
  href, 
  label, 
  children,
  hoverColor = "bg-primary" 
}: { 
  href: string
  label: string
  children: React.ReactNode
  hoverColor?: string
}) => (
  <a 
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`p-2 bg-white/10 backdrop-blur-sm rounded-full hover:${hoverColor} transition-colors duration-300`}
    aria-label={label}
  >
    {children}
  </a>
)

const teamMembers = [
  {
    name: "Joel Chilapondwa",
    role: "Founder & Creative Director",
    bio: "Visionary filmmaker with 10+ years in cinematic production",
    image: "/IMG_4769.JPEG",
    social: {
      instagram: "https://www.instagram.com/jay_arts_multimedia?igsh=MWZ5YTl4Mjh3ZG9ndA%3D%3D&utm_source=qr",
      linkedin: "https://linkedin.com/in/joel",
      facebook: "https://www.facebook.com/share/14Sc9c7Ddb2/?mibextid=wwXIfr"
    }
  },
  {
    name: "Joshua Simengwa",
    role: "Cinematographer & Director of Cinematography",
    bio: "Award-winning photographer specializing in luxury brands",
    image: "/jay.jpeg",
    social: {
      instagram: "https://instagram.com/joshua",
      twitter: "https://twitter.com/joshua",
      linkedin: "https://linkedin.com/in/joshua"
    }
  },
  {
    name: "Hasheem Deza",
    role: "Lead Photographer & Videographer",
    bio: "Brand strategist and graphic design innovator",
    image: "/Classic-6256.jpg",
    social: {
      instagram: "https://www.instagram.com/skyeem_mw?igsh=MTVkcWR2ZTI5eTV2ag==",
      facebook: "https://www.facebook.com/yonexhashim.deza",
      tiktok: "https://www.tiktok.com/@skyeem_mw?_r=1&_t=ZS-926qLKlZp2r",
    }
  },
]

const values = [
  { title: "Excellence", description: "Creativity - We bring ideas to life through innovative visual storytelling" },
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
                    To become the leading multimedia production company seeking to make a lasting impact through 
                    photography, videography, livestreaming and graphic designs that transcend expectations.
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
    
        <div className="flex flex-wrap justify-center gap-6">
          {teamMembers.map((member, idx) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="group w-[260px] relative"
            >
              <div className="relative rounded-xl mb-4 h-64 bg-zinc-900 flex items-center justify-center overflow-hidden">
                <Image
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  fill
                  className="object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Social Links Overlay - Visible on hover for desktop, always visible on mobile */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent 
                              flex items-end justify-center pb-6
                              opacity-0 group-hover:opacity-100 transition-opacity duration-300
                              md:opacity-0 md:group-hover:opacity-100
                              opacity-100 md:opacity-0"> {/* This makes it visible on mobile */}
                  <div className="flex gap-4">
                    {/* Instagram */}
                    {member.social.instagram && (
                      <SocialIcon 
                        href={member.social.instagram}
                        label={`${member.name}'s Instagram`}
                        hoverColor="bg-pink-600"
                      >
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
                        </svg>
                      </SocialIcon>
                    )}
                    
                    {/* LinkedIn */}
                    {member.social.linkedin && (
                      <SocialIcon 
                        href={member.social.linkedin}
                        label={`${member.name}'s LinkedIn`}
                        hoverColor="bg-blue-700"
                      >
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      </SocialIcon>
                    )}
                    
                    {/* Twitter */}
                    {member.social.twitter && (
                      <SocialIcon 
                        href={member.social.twitter}
                        label={`${member.name}'s Twitter`}
                        hoverColor="bg-blue-400"
                      >
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.213c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                      </SocialIcon>
                    )}
                    
                    {/* Facebook */}
                    {member.social.facebook && (
                      <SocialIcon 
                        href={member.social.facebook}
                        label={`${member.name}'s Facebook`}
                        hoverColor="bg-blue-600"
                      >
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      </SocialIcon>
                    )}
                    
                    {/* TikTok */}
                    {member.social.tiktok && (
                      <SocialIcon 
                        href={member.social.tiktok}
                        label={`${member.name}'s TikTok`}
                        hoverColor="bg-black"
                      >
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 01-.02-3.4 2.9 2.9 0 012.3-1.13c.3 0 .6.04.9.1V7.47A6.27 6.27 0 005 7.39v2.75a4.77 4.77 0 00-1.59-.27A4.86 4.86 0 004.86 17 4.86 4.86 0 009.72 12v-5.2A7.41 7.41 0 0012 6.54v5.14a2.9 2.9 0 002.35-1.13 2.89 2.89 0 00-.02-3.4 2.9 2.9 0 00-2.32-1.14V2A4.88 4.88 0 0116 2.32a4.87 4.87 0 003.59 4.37z"/>
                        </svg>
                      </SocialIcon>
                    )}
                  </div>
                </div>
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