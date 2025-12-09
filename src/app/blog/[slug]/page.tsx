"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Calendar, ArrowLeft, Share2 } from "lucide-react"
import PublicNavBar from "@/components/public/navbar"
import Footer from "@/components/public/footer"

interface BlogPost {
  title: string
  author: string
  date: string
  category: string
  image: string
  readTime: string
  content: string
}

const blogPosts: Record<string, BlogPost> = {
  "mastering-product-photography": {
    title: "Mastering Product Photography",
    author: "Alex Rivers",
    date: "December 1, 2024",
    category: "Photography",
    image: "/blog-image-1.jpg",
    readTime: "5 min read",
    content: `
      <h2>Introduction</h2>
      <p>Product photography is more than just pointing a camera at an object. It's about telling a story, creating desire, and showcasing the product in its best light—literally.</p>

      <h2>Essential Equipment</h2>
      <p>You don't need expensive gear to start. The fundamentals include:</p>
      <ul>
        <li>A good camera (DSLR or mirrorless)</li>
        <li>Prime lenses (50mm for general, 100mm for macro)</li>
        <li>Basic lighting setup (3-point lighting)</li>
        <li>Reflectors and diffusers</li>
        <li>Sturdy tripod</li>
      </ul>

      <h2>Lighting Techniques</h2>
      <p>Proper lighting is the foundation of great product photography. The three-point lighting setup consists of:</p>
      
      <h3>Key Light</h3>
      <p>Your main light source, positioned at 45 degrees from the subject. This creates dimension and highlights the product's features.</p>

      <h3>Fill Light</h3>
      <p>A secondary light that fills in shadows, creating a balanced exposure. Use this to control contrast.</p>

      <h3>Back Light</h3>
      <p>Positioned behind the product, this light separates the subject from the background and adds depth.</p>

      <h2>Camera Settings</h2>
      <p>Start with these baseline settings and adjust based on your specific setup:</p>
      <ul>
        <li>Aperture: f/5.6 - f/16 (for sharp focus across the product)</li>
        <li>Shutter Speed: 1/60s or faster (depending on lighting)</li>
        <li>ISO: Keep as low as possible (100-400)</li>
        <li>White Balance: Custom or daylight</li>
      </ul>

      <h2>Composition Tips</h2>
      <p>Great composition makes all the difference:</p>
      <ul>
        <li>Use the rule of thirds for dynamic composition</li>
        <li>Leave negative space around the product</li>
        <li>Shoot from multiple angles</li>
        <li>Show the product in context when appropriate</li>
      </ul>

      <h2>Post-Processing</h2>
      <p>Professional product images often require post-processing. Focus on:</p>
      <ul>
        <li>Adjusting white balance and exposure</li>
        <li>Enhancing colors and contrast</li>
        <li>Removing unwanted elements (dust, marks)</li>
        <li>Creating consistent branding across all images</li>
      </ul>

      <h2>Conclusion</h2>
      <p>Mastering product photography takes practice and experimentation. Start with these fundamentals, and gradually develop your style. Remember, the best camera is the one you have with you, and the best light is the one that tells your product's story best.</p>
    `,
  },
  "cinematic-video-storytelling": {
    title: "The Art of Cinematic Video Storytelling",
    author: "Jordan Jay",
    date: "November 28, 2024",
    category: "Videography",
    image: "/blog-image-2.jpg",
    readTime: "8 min read",
    content: `
      <h2>What Makes Video Cinematic?</h2>
      <p>Cinematic video goes beyond technical specifications. It's about creating an emotional connection with your audience through visual storytelling.</p>

      <h2>Frame Composition</h2>
      <p>Strong composition is the foundation of cinematic video. Consider:</p>
      <ul>
        <li>Leading lines to guide viewer attention</li>
        <li>Depth of field for visual interest</li>
        <li>Layering elements in the frame</li>
        <li>Using negative space effectively</li>
      </ul>

      <h2>Color and Tone</h2>
      <p>Color grading is essential for setting mood and tone. Establish a color palette that aligns with your story's emotional arc.</p>

      <h2>Sound Design</h2>
      <p>Never underestimate sound. It's 50% of the viewing experience. Invest time in:</p>
      <ul>
        <li>Capturing clean dialogue</li>
        <li>Recording ambient sound</li>
        <li>Selecting appropriate music</li>
        <li>Creating sound effects</li>
      </ul>

      <h2>Pacing and Editing</h2>
      <p>Edit with intention. Every cut should serve your story. Match editing pace to the music and emotional beats.</p>

      <h2>Conclusion</h2>
      <p>Cinematic storytelling is a craft that combines technical skills with creative vision. Keep practicing, stay inspired, and always put story first.</p>
    `,
  },
  "brand-identity-design-trends": {
    title: "2024 Brand Identity Design Trends",
    author: "Sam Morgan",
    date: "November 25, 2024",
    category: "Design",
    image: "/blog-image-3.jpg",
    readTime: "6 min read",
    content: `
      <h2>Overview</h2>
      <p>Brand identity design continues to evolve. Here are the key trends shaping the landscape in 2024.</p>

      <h2>Trend 1: Sustainable Design</h2>
      <p>Brands are increasingly focusing on sustainable and ethical design practices. This includes eco-friendly materials in physical branding and responsible digital design.</p>

      <h2>Trend 2: Authentic Personalization</h2>
      <p>Generic branding is out. Authentic, personalized brand experiences that reflect genuine values are in.</p>

      <h2>Trend 3: Minimalist Maximalism</h2>
      <p>A paradox that works: Minimal design with maximum impact. Clean lines combined with bold, meaningful elements.</p>

      <h2>Trend 4: Inclusive Design</h2>
      <p>Accessibility and inclusivity aren't afterthoughts—they're core to brand design. Consider all users from the start.</p>

      <h2>Trend 5: Dynamic Branding</h2>
      <p>Static logos are evolving. Animated, responsive brands that adapt to different contexts are becoming standard.</p>

      <h2>Conclusion</h2>
      <p>Stay authentic to your brand while embracing innovation. The best brands balance timeless design with contemporary relevance.</p>
    `,
  },
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = blogPosts[params.slug]

  if (!post) {
    return (
      <div className="bg-background text-foreground min-h-screen">
        <PublicNavBar />
        <main className="pt-20">
          <section className="py-20 px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
            <Link href="/blog" className="text-primary hover:underline">
              Back to Blog
            </Link>
          </section>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="bg-background text-foreground min-h-screen">
      <PublicNavBar />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-12 px-4 relative overflow-hidden">
          <div className="max-w-3xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-6 transition-colors"
              >
                <ArrowLeft size={16} />
                Back to Blog
              </Link>

              <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full mb-4">
                {post.category}
              </span>

              <h1 className="text-5xl md:text-6xl font-bold mb-6">{post.title}</h1>

              <div className="flex flex-wrap gap-6 text-foreground/60 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/20" />
                  <div>
                    <p className="font-semibold text-foreground">{post.author}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  {post.date}
                </div>
                <div>{post.readTime}</div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Featured Image */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="py-8 px-4"
        >
          <div className="max-w-3xl mx-auto">
            <div className="relative w-full aspect-video rounded-xl overflow-hidden">
              <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
            </div>
          </div>
        </motion.section>

        {/* Article Content */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="py-16 px-4"
        >
          <div className="max-w-3xl mx-auto">
            <article
              className="prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{
                __html: post.content
                  .replace(/<([h2-h3])>/g, '<$1 className="font-bold text-2xl mt-8 mb-4">')
                  .replace(/<p>/g, '<p className="text-foreground/80 leading-relaxed mb-4">')
                  .replace(/<ul>/g, '<ul className="list-disc list-inside space-y-2 text-foreground/80 mb-4">')
                  .replace(/<li>/g, '<li className="ml-4">'),
              }}
            />

            {/* Share Section */}
            <motion.div className="mt-12 pt-8 border-t border-border flex items-center justify-between">
              <div>
                <p className="text-foreground/60 text-sm mb-2">Share this article</p>
                <div className="flex gap-3">
                  {["Twitter", "Facebook", "LinkedIn"].map((social) => (
                    <button
                      key={social}
                      className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-primary/10 hover:border-primary transition-colors"
                    >
                      <Share2 size={16} className="text-primary" />
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Related Posts */}
        <section className="py-20 px-4 bg-card/50">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">More from the Blog</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(blogPosts)
                .slice(0, 2)
                .map(([slug, relatedPost]) => (
                  <Link key={slug} href={`/blog/${slug}`} className="group">
                    <div className="glass-effect border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all">
                      <div className="relative h-40 bg-gradient-to-br from-primary/20 to-transparent" />
                      <div className="p-4">
                        <h3 className="font-bold group-hover:text-primary transition-colors line-clamp-2">
                          {relatedPost.title}
                        </h3>
                        <p className="text-xs text-foreground/50 mt-2">{relatedPost.date}</p>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
