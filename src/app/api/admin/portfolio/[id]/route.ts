import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    await prisma.portfolioItem.delete({
      where: { id }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Portfolio delete error:", error)
    return NextResponse.json(
      { error: "Failed to delete portfolio item" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const data = await request.json()

    const portfolioItem = await prisma.portfolioItem.update({
      where: { id },
      data: {
        publishedAt: data.publishedAt,
        featured: data.featured
      }
    })
    
    return NextResponse.json(portfolioItem)
  } catch (error) {
    console.error("Portfolio update error:", error)
    return NextResponse.json(
      { error: "Failed to update portfolio item" },
      { status: 500 }
    )
  }
}
