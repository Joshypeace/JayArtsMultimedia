import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { adminApiGuard } from "@/lib/server-auth"
import { ServiceCategory } from "@/generated/prisma/enums"

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
    const invalid = (msg: string) => NextResponse.json({ error: msg }, { status: 400 })
    if ("title" in updates && (typeof updates.title !== "string" || !updates.title.trim())) {
      return invalid("Title is required")
    }
    if ("category" in updates && !(Object.values(ServiceCategory) as unknown[]).includes(updates.category)) {
      return invalid("Invalid category")
    }
    if ("tags" in updates && !(Array.isArray(updates.tags) && updates.tags.every((t) => typeof t === "string"))) {
      return invalid("Tags must be a list of text values")
    }
    if ("images" in updates && !Array.isArray(updates.images)) {
      return invalid("Images must be a list")
    }
    if ("featured" in updates && typeof updates.featured !== "boolean") {
      return invalid("Featured must be true or false")
    }
    for (const key of ["description", "imageUrl", "thumbnailUrl", "videoUrl"] as const) {
      if (key in updates && updates[key] !== null && typeof updates[key] !== "string") {
        return invalid(`${key} must be text`)
      }
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
