import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { 
          success: false,
          error: "Unauthorized access" 
        },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { action, data } = body

    switch (action) {
      case 'BULK_UPDATE_STATUS': {
        if (!data.inquiryIds || !Array.isArray(data.inquiryIds) || data.inquiryIds.length === 0) {
          return NextResponse.json(
            { 
              success: false,
              error: "Valid inquiry IDs are required" 
            },
            { status: 400 }
          )
        }

        if (!data.status) {
          return NextResponse.json(
            { 
              success: false,
              error: "Status is required" 
            },
            { status: 400 }
          )
        }

        const result = await prisma.inquiry.updateMany({
          where: {
            id: { in: data.inquiryIds }
          },
          data: {
            status: data.status,
            respondedAt: data.status === 'RESPONDED' || data.status === 'RESOLVED' 
              ? new Date() 
              : undefined,
            response: data.note 
              ? `[Bulk Update - ${new Date().toISOString()}]: ${data.note}`
              : undefined
          }
        })

        return NextResponse.json({
          success: true,
          data: {
            updatedCount: result.count,
            message: `Successfully updated ${result.count} inquiry${result.count !== 1 ? 'ies' : ''}`
          }
        })
      }

      case 'BULK_DELETE': {
        if (!data.inquiryIds || !Array.isArray(data.inquiryIds) || data.inquiryIds.length === 0) {
          return NextResponse.json(
            { 
              success: false,
              error: "Valid inquiry IDs are required" 
            },
            { status: 400 }
          )
        }

        const result = await prisma.inquiry.deleteMany({
          where: {
            id: { in: data.inquiryIds }
          }
        })

        return NextResponse.json({
          success: true,
          data: {
            deletedCount: result.count,
            message: `Successfully deleted ${result.count} inquiry${result.count !== 1 ? 'ies' : ''}`
          }
        })
      }

      case 'MARK_AS_SPAM': {
        if (!data.inquiryIds || !Array.isArray(data.inquiryIds) || data.inquiryIds.length === 0) {
          return NextResponse.json(
            { 
              success: false,
              error: "Valid inquiry IDs are required" 
            },
            { status: 400 }
          )
        }

        // Mark as spam and also add email to spam list for future
        const result = await prisma.inquiry.updateMany({
          where: {
            id: { in: data.inquiryIds }
          },
          data: {
            status: 'SPAM'
          }
        })

        // Also could add email to a blocklist here

        return NextResponse.json({
          success: true,
          data: {
            updatedCount: result.count,
            message: `Marked ${result.count} inquiry${result.count !== 1 ? 'ies' : ''} as spam`
          }
        })
      }

      default:
        return NextResponse.json(
          { 
            success: false,
            error: `Invalid action: ${action}` 
          },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error("Bulk operation error:", error)
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to process bulk operation" 
      },
      { status: 500 }
    )
  }
}