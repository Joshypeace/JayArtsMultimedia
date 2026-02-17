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
    const { status, note } = await request.json()
    
    // Get existing booking
    const existingBooking = await prisma.booking.findUnique({
      where: { id },
      select: { status: true, statusNotes: true, clientEmail: true, clientName: true }
    })
    
    if (!existingBooking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      )
    }
    
    // Prepare status note
    const timestamp = new Date().toLocaleString()
    const statusNote = `${timestamp}: Status changed from ${existingBooking.status} to ${status} by ${session.user.name}`
    const fullNote = note ? `${statusNote}\nNote: ${note}` : statusNote
    
    // Update booking
    const booking = await prisma.booking.update({
      where: { id },
      data: {
        status,
        statusNotes: existingBooking.statusNotes 
          ? `${existingBooking.statusNotes}\n${fullNote}`
          : fullNote
      },
      include: {
        service: {
          select: {
            name: true
          }
        }
      }
    })
    
    // Send email notification to client
    // await sendStatusUpdateEmail({
    //   to: existingBooking.clientEmail,
    //   clientName: existingBooking.clientName,
    //   bookingId: id,
    //   oldStatus: existingBooking.status,
    //   newStatus: status,
    //   serviceName: booking.service?.name || 'Service',
    //   note: note
    // })
    
    return NextResponse.json(booking)
  } catch (error) {
    console.error("Booking status update error:", error)
    return NextResponse.json(
      { error: "Failed to update booking status" },
      { status: 500 }
    )
  }
}