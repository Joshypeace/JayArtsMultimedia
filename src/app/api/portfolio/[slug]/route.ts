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

    // Update + return in one query
    const portfolioItem = await prisma.portfolioItem.update({
      where: { slug },
      data: {
        views: { increment: 1 }
      },
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