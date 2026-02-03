import { notFound } from "next/navigation"
import { CldImage } from 'next-cloudinary'
import { Calendar, Eye, Tag, User } from "lucide-react"
import PublicNavBar from "@/components/public/navbar"
import Footer from "@/components/public/footer"

interface PortfolioDetailPageProps {
  params: {
    slug: string
  }
}

async function getPortfolioItem(slug: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/portfolio/${slug}`, {
    cache: 'no-store'
  })
  
  if (!response.ok) {
    notFound()
  }
  
  return response.json()
}

export default async function PortfolioDetailPage({ params }: PortfolioDetailPageProps) {
  const item = await getPortfolioItem(params.slug)

  return (
    <div className="bg-background text-foreground min-h-screen">
      <PublicNavBar />
      
      <main className="pt-20">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{item.title}</h1>
            
            <div className="flex flex-wrap gap-4 items-center text-foreground/60">
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                <span>{new Date(item.createdAt).toLocaleDateString()}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Eye size={18} />
                <span>{item.views.toLocaleString()} views</span>
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
                  crop="fill"
                  gravity="auto"
                  preload
                />
              </div>
              
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-xl">{item.description}</p>
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
                    <span className="text-foreground/60">Category:</span>
                    <div className="font-medium">{item.category}</div>
                  </div>
                  
                  {item.featured && (
                    <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full">
                      Featured Work
                    </div>
                  )}
                  
                  {item.tags.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Tag size={18} className="text-foreground/60" />
                        <span className="text-foreground/60">Tags:</span>
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
                      {item.user.bio && (
                        <p className="text-foreground/60 mt-1">{item.user.bio}</p>
                      )}
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