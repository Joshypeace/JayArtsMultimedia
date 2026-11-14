import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { adminApiGuard } from "@/lib/server-auth"

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const denied = await adminApiGuard()
    if (denied) return denied

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
    const denied = await adminApiGuard()
    if (denied) return denied

    const { id } = await context.params
    const data = await request.json()

    // Update only the editable fields that were sent. The slug is left as-is so
    // existing portfolio links keep working after an edit.
    const editable = [
      "title", "description", "category", "tags", "featured",
      "images", "imageUrl", "thumbnailUrl", "videoUrl", "publishedAt",
    ] as const
    const updates: Record<string, unknown> = {}
    for (const key of editable) {
      if (data[key] !== undefined) updates[key] = data[key]
    }
    if (typeof updates.title === "string" && !updates.title.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    const portfolioItem = await prisma.portfolioItem.update({
      where: { id },
      data: updates,
      include: {
        service: { select: { name: true } },
        user: { select: { name: true, email: true } }
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
