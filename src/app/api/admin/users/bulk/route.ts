import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access" },
        { status: 401 }
      )
    }

    // Check if user is admin
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { role: true, id: true }
    })

    if (currentUser?.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: "Admin access required" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { action, data } = body

    switch (action) {
      case 'BULK_UPDATE_ROLE': {
        if (!data.userIds || !Array.isArray(data.userIds) || data.userIds.length === 0) {
          return NextResponse.json(
            { success: false, error: "Valid user IDs are required" },
            { status: 400 }
          )
        }

        if (!data.role) {
          return NextResponse.json(
            { success: false, error: "Role is required" },
            { status: 400 }
          )
        }

        // Prevent updating your own role in bulk
        if (data.userIds.includes(currentUser.id)) {
          return NextResponse.json(
            { success: false, error: "Cannot update your own role in bulk operation" },
            { status: 400 }
          )
        }

        const result = await prisma.user.updateMany({
          where: {
            id: { in: data.userIds }
          },
          data: {
            role: data.role
          }
        })

        return NextResponse.json({
          success: true,
          data: {
            updatedCount: result.count,
            message: `Successfully updated ${result.count} user${result.count !== 1 ? 's' : ''}`
          }
        })
      }

      case 'BULK_DELETE': {
        if (!data.userIds || !Array.isArray(data.userIds) || data.userIds.length === 0) {
          return NextResponse.json(
            { success: false, error: "Valid user IDs are required" },
            { status: 400 }
          )
        }

        // Prevent deleting yourself
        if (data.userIds.includes(currentUser.id)) {
          return NextResponse.json(
            { success: false, error: "Cannot delete your own account" },
            { status: 400 }
          )
        }

        const result = await prisma.user.deleteMany({
          where: {
            id: { in: data.userIds }
          }
        })

        return NextResponse.json({
          success: true,
          data: {
            deletedCount: result.count,
            message: `Successfully deleted ${result.count} user${result.count !== 1 ? 's' : ''}`
          }
        })
      }

      case 'BULK_VERIFY_EMAIL': {
        if (!data.userIds || !Array.isArray(data.userIds) || data.userIds.length === 0) {
          return NextResponse.json(
            { success: false, error: "Valid user IDs are required" },
            { status: 400 }
          )
        }

        const result = await prisma.user.updateMany({
          where: {
            id: { in: data.userIds }
          },
          data: {
            emailVerified: true,
            emailVerifiedAt: new Date()
          }
        })

        return NextResponse.json({
          success: true,
          data: {
            updatedCount: result.count,
            message: `Successfully verified ${result.count} user${result.count !== 1 ? 's' : ''}`
          }
        })
      }

      default:
        return NextResponse.json(
          { success: false, error: `Invalid action: ${action}` },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error("Bulk operation error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to process bulk operation" },
      { status: 500 }
    )
  }
}