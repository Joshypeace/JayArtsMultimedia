import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
  try {
    const portfolioItems = await prisma.portfolioItem.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        service: {
          select: {
            name: true
          }
        },
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })
    
    return NextResponse.json(portfolioItems)
  } catch (error) {
    console.error("Portfolio fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch portfolio items" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    // Get the current user session
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const data = await request.json()
    
    // Generate slug from title
    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    
    const portfolioItem = await prisma.portfolioItem.create({
      data: {
        title: data.title,
        slug: slug,
        description: data.description,
        category: data.category,
        imageUrl: data.imageUrl,
        videoUrl: data.videoUrl || null,
        thumbnailUrl: data.thumbnailUrl,
        featured: data.featured || false,
        tags: data.tags || [],
        userId: session.user.id, // Use the authenticated user's ID
        publishedAt: null,
        serviceId: null // You can add service selection later
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })
    
    return NextResponse.json(portfolioItem)
  } catch (error: unknown) {
    console.error("Portfolio create error:", error)
    
    if (error && typeof error === 'object' && 'code' in error && (error as { code: string }).code === 'P2003') {
      return NextResponse.json(
        { error: "User not found. Please log in again." },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: "Failed to create portfolio item" },
      { status: 500 }
    )
  }
}