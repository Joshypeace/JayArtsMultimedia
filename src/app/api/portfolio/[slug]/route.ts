import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    if (!slug) {
      return NextResponse.json(
        { error: "Slug is required" },
        { status: 400 }
      )
    }

    const portfolioItem = await prisma.portfolioItem.findFirst({
      where: { slug, publishedAt: { not: null, lte: new Date() } },
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

    // count the view without delaying the response
    await prisma.portfolioItem
      .update({ where: { id: portfolioItem.id }, data: { views: { increment: 1 } } })
      .catch(() => {})

    return NextResponse.json(portfolioItem)
  } catch (error) {
    console.error("Portfolio item fetch error:", error)

    return NextResponse.json(
      { error: "Failed to fetch portfolio item" },
      { status: 500 }
    )
  }
}