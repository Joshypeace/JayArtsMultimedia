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
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Check if user is admin
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { role: true }
    })

    if (currentUser?.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: "Admin access required" },
        { status: 403 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const { status } = body

    if (!['ACTIVE', 'REJECTED', 'SUSPENDED'].includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid status" },
        { status: 400 }
      )
    }

    const user = await prisma.user.update({
      where: { id },
      data: { status },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true
      }
    })

    // TODO: Send email notification to user about approval/rejection
    // You can implement this later

    return NextResponse.json({
      success: true,
      data: user,
      message: `User ${status === 'ACTIVE' ? 'approved' : 'rejected'} successfully`
    })

  } catch (error) {
    console.error("Approval update error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update user status" },
      { status: 500 }
    )
  }
}