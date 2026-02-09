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
    
    const comment = await prisma.comment.update({
      where: { id },
      data: { isApproved: true }
    })
    
    return NextResponse.json(comment)
  } catch (error) {
    console.error("Comment approve error:", error)
    return NextResponse.json(
      { error: "Failed to approve comment" },
      { status: 500 }
    )
  }
}