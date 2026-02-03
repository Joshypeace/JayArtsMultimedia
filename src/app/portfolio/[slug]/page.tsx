// app/portfolio/[slug]/page.tsx
import { notFound } from "next/navigation"
import { CldImage } from 'next-cloudinary'
import { Calendar, Eye, Tag, User, ArrowLeft } from "lucide-react"
import PublicNavBar from "@/components/public/navbar"
import Footer from "@/components/public/footer"
import Link from "next/link"

interface PortfolioDetailPageProps {
  params: { slug: string }
}

// This function fetches data directly from your database
async function getPortfolioItem(slug: string) {
  try {
    // Import your Prisma client directly
    const { prisma } = await import("@/lib/prisma")
    
    // First, increment the view count
    await prisma.portfolioItem.update({
      where: { slug },
      data: {
        views: { increment: 1 }
      }
    })
    
    // Then fetch the item with user details
    const portfolioItem = await prisma.portfolioItem.findUnique({
      where: { slug },
      include: {
        user: {
          select: {
            name: true,
          }
        }
      }
    })
    
    return portfolioItem
  } catch (error) {
    console.error("Error fetching portfolio item:", error)
    return null
  }
}

export default async function PortfolioDetailPage({ params }: PortfolioDetailPageProps) {
  // Destructure params directly (they're not a Promise in latest Next.js)
  const { slug } = params
  
  // Debug log
  console.log("Slug received:", slug)
  
  if (!slug) {
    console.error("No slug provided")
    notFound()
  }
  
  const item = await getPortfolioItem(slug)
  
  if (!item) {
    console.error("Portfolio item not found for slug:", slug)
    notFound()
  }
  
  return (
    <div className="bg-background text-foreground min-h-screen">
      <PublicNavBar />
      
      <main className="pt-20">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Back button */}
          <Link 
            href="/portfolio"
            className="inline-flex items-center gap-2 text-foreground/70 hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft size={20} />
            Back to Portfolio
          </Link>
          
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{item.title}</h1>
            
            <div className="flex flex-wrap gap-4 items-center text-foreground/60">
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                <span>{new Date(item.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Eye size={18} />
                <span>{(item.views || 0).toLocaleString()} views</span>
              </div>
              
              {item.user && (
                <div className="flex items-center gap-2">
                  <User size={18} />
                  <span>{item.user.name}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="relative h-[500px] rounded-xl overflow-hidden mb-6">
                <CldImage
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 66vw"
                  className="object-cover"
                  priority
                />
              </div>
              
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-xl text-foreground/80">{item.description}</p>
              </div>
              
              {item.videoUrl && (
                <div className="mt-8">
                  <h3 className="text-2xl font-bold mb-4">Video</h3>
                  <div className="aspect-video rounded-xl overflow-hidden">
                    <iframe
                      src={item.videoUrl.replace("watch?v=", "embed/")}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-6">
              <div className="bg-card rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4">Details</h3>
                
                <div className="space-y-3">
                  <div>
                    <span className="text-foreground/60 block mb-1">Category:</span>
                    <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full font-medium">
                      {item.category}
                    </div>
                  </div>
                  
                  {item.featured && (
                    <div className="inline-block px-3 py-1 bg-yellow-500/10 text-yellow-500 rounded-full">
                      ⭐ Featured Work
                    </div>
                  )}
                  
                  {item.tags && item.tags.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Tag size={18} className="text-foreground/60" />
                        <span className="text-foreground/60 font-medium">Tags:</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {item.tags.map((tag: string, i: number) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-input text-foreground/70 rounded-full text-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {item.user && (
                <div className="bg-card rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-4">Photographer</h3>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                      <User size={24} className="text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{item.user.name}</h4>
                     
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}

// Generate static params
export async function generateStaticParams() {
  try {
    const { prisma } = await import("@/lib/prisma")
    
    const items = await prisma.portfolioItem.findMany({
      select: {
        slug: true
      }
    })
    
    return items.map((item) => ({
      slug: item.slug,
    }))
  } catch (error) {
    console.error("Error generating static params:", error)
    return []
  }
}