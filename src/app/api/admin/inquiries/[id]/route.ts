import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Prisma } from '@/generated/prisma/client'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET single inquiry
export async function GET(
  request: Request,
  context: { params: RouteParams['params'] }
) {
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

    const { id } =  await context.params
    
    const inquiry = await prisma.inquiry.findUnique({
      where: { id },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })
    
    if (!inquiry) {
      return NextResponse.json(
        { 
          success: false,
          error: "Inquiry not found" 
        },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: inquiry
    })

  } catch (error) {
    console.error("Inquiry fetch error:", error)
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to fetch inquiry" 
      },
      { status: 500 }
    )
  }
}

// PATCH - Update inquiry (status, response, assignment)
export async function PATCH(
  request: Request,
  { params }: RouteParams
) {
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

    const { id } = await params
    const body = await request.json()
    
    // Build update data
    const updateData: Prisma.InquiryUpdateInput = {}
    
    if (body.status) {
      updateData.status = body.status
      
      // If status is RESPONDED, set respondedAt
      if (body.status === 'RESPONDED' || body.status === 'RESOLVED') {
        updateData.respondedAt = new Date()
      }
    }
    
    if (body.response !== undefined) {
      updateData.response = body.response
    }
    
    if (body.assignedToId !== undefined) {
      updateData.assignedTo = body.assignedToId || null
    }
    
    // Add note to response if provided
    if (body.note) {
      const timestamp = new Date().toISOString()
      updateData.response = updateData.response 
        ? `${updateData.response}\n\n[${timestamp}] Note: ${body.note}`
        : `[${timestamp}] Note: ${body.note}`
    }

    const inquiry = await prisma.inquiry.update({
      where: { id },
      data: updateData,
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })
    
    return NextResponse.json({
      success: true,
      data: inquiry
    })

  } catch (error) {
    console.error("Inquiry update error:", error)
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          { 
            success: false,
            error: "Inquiry not found" 
          },
          { status: 404 }
        )
      }
    }
    
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to update inquiry" 
      },
      { status: 500 }
    )
  }
}

// DELETE inquiry
export async function DELETE(
  request: Request,
  { params }: RouteParams
) {
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

    const { id } = await params
    
    await prisma.inquiry.delete({
      where: { id }
    })
    
    return NextResponse.json({
      success: true,
      message: "Inquiry deleted successfully"
    })

  } catch (error) {
    console.error("Inquiry delete error:", error)
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          { 
            success: false,
            error: "Inquiry not found" 
          },
          { status: 404 }
        )
      }
    }
    
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to delete inquiry" 
      },
      { status: 500 }
    )
  }
}