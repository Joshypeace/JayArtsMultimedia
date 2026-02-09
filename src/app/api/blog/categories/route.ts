import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const categories = await prisma.blogPost.groupBy({
      by: ['category'],
      where: { isPublished: true },
      _count: {
        id: true
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      }
    })
    
    return NextResponse.json(categories)
  } catch (error) {
    console.error("Blog categories fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch blog categories" },
      { status: 500 }
    )
  }
}