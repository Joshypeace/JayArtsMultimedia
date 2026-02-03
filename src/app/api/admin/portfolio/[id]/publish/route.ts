import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { published, publishedAt } = await request.json()
    const { id } = await context.params
    
    const updatedItem = await prisma.portfolioItem.update({
      where: { id },
      data: {
        publishedAt: published ? publishedAt : null
      },
      include: {
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