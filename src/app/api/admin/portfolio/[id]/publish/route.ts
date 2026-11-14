import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { adminApiGuard } from "@/lib/server-auth"

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const denied = await adminApiGuard()
    if (denied) return denied

    const { published, publishedAt } = await request.json()
    const { id } = await context.params

    const updatedItem = await prisma.portfolioItem.update({
      where: { id },
      data: {
        publishedAt: published ? publishedAt : null
      },
      include: {
        service: { select: { name: true } },
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(updatedItem)
  } catch (error) {
    console.error("Portfolio publish error:", error)
    return NextResponse.json(
      { error: "Failed to update portfolio status" },
      { status: 500 }
    )
  }
}