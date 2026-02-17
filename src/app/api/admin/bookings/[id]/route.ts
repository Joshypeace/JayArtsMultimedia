import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

interface RouteParams {
  params: { id: string }
}

// GET single booking
export async function GET(
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

    const { id } = params
    
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        service: {
          select: {
            name: true,
            category: true
          }
        }
      }
    })
    
    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      )
    }
    
    return NextResponse.json(booking)
  } catch (error) {
    console.error("Booking fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch booking" },
      { status: 500 }
    )
  }
}

// PATCH update booking status
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

    const { id } = params
    const data = await request.json()
    
    const booking = await prisma.booking.update({
      where: { id },
      data: {
        status: data.status,
        statusNotes: data.statusNotes
      },
      include: {
        service: {
          select: {
            name: true,
            category: true
          }
        }
      }
    })
    
    return NextResponse.json(booking)
  } catch (error) {
    console.error("Booking update error:", error)
    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 }
    )
  }
}

// DELETE booking
export async function DELETE(
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

    const { id } = params
    
    await prisma.booking.delete({
      where: { id }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Booking delete error:", error)
    return NextResponse.json(
      { error: "Failed to delete booking" },
      { status: 500 }
    )
  }
}