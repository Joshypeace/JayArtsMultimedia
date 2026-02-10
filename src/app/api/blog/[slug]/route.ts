import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

interface RouteParams {
  params: Promise<{ slug: string }>
}

export async function GET(
  request: Request,
  { params }: RouteParams
) {
  try {
    const { slug } = await params
    
    // Increment view count
    await prisma.blogPost.updateMany({
      where: { slug, isPublished: true },
      data: {
        views: { increment: 1 }
      }
    })
    
    // Get the post
    const blogPost = await prisma.blogPost.findUnique({
      where: { slug, isPublished: true },
      include: {
        author: {
          select: {
            id: true,
            name: true,
           
          }
        }
      }
    })
    
    if (!blogPost) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      )
    }
    
    return NextResponse.json(blogPost)
  } catch (error) {
    console.error("Blog post fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch blog post" },
      { status: 500 }
    )
  }
}