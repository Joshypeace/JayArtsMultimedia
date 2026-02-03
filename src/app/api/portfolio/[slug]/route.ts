// app/api/portfolio/[slug]/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// Define params type for Next.js 14
export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const params = await context.params
    const slug = params.slug
    
    console.log("API Route - Fetching portfolio item with slug:", slug)
    
    if (!slug) {
      return NextResponse.json(
        { error: "Slug is required" },
        { status: 400 }
      )
    }
    
    // Find the portfolio item
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
    
    if (!portfolioItem) {
      return NextResponse.json(
        { error: "Portfolio item not found" },
        { status: 404 }
      )
    }
    
    // Increment view count
    await prisma.portfolioItem.update({
      where: { slug },
      data: {
        views: { increment: 1 }
      }
    })
    
    return NextResponse.json(portfolioItem)
  } catch (error) {
    console.error("Portfolio item fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch portfolio item" },
      { status: 500 }
    )
  }
}