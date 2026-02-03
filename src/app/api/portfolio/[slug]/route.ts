import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params
    
    // First, increment the view count
    await prisma.portfolioItem.update({
      where: { slug },
      data: {
        views: { increment: 1 }
      }
    })
    
    // Then fetch the item
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
    
    return NextResponse.json(portfolioItem)
  } catch (error) {
    console.error("Portfolio item fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch portfolio item" },
      { status: 500 }
    )
  }
}