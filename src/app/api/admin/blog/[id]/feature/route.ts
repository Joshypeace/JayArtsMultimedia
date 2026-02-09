import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function PATCH(
  request: Request,
  { params }: RouteParams
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { id } = await params
    const { isFeatured } = await request.json()
    
    const blogPost = await prisma.blogPost.update({
      where: { id },
      data: { isFeatured },
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })
    
    return NextResponse.json(blogPost)
  } catch (error) {
    console.error("Blog post feature error:", error)
    return NextResponse.json(
      { error: "Failed to update blog post feature status" },
      { status: 500 }
    )
  }
}