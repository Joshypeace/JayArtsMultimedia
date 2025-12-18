import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const portfolioItems = await prisma.portfolioItem.findMany({
      where: {
        publishedAt: { not: null }
      },
      orderBy: [
        { featured: 'desc' },
        { publishedAt: 'desc' }
      ],
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        category: true,
        imageUrl: true,
        videoUrl: true,
        thumbnailUrl: true,
        featured: true,
        tags: true,
        views: true,
        createdAt: true
      }
    })
    
    return NextResponse.json(portfolioItems)
  } catch (error) {
    console.error("Public portfolio fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch portfolio" },
      { status: 500 }
    )
  }
}