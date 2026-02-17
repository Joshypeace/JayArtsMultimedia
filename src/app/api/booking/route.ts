import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // Validate required fields
    if (!data.eventType || !data.eventDate || !data.clientName || !data.clientEmail) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Parse event date
    const eventDateTime = new Date(data.eventDate)
    if (data.time) {
      const [hours, minutes] = data.time.split(':')
      eventDateTime.setHours(parseInt(hours), parseInt(minutes))
    }

    // Create the booking
    const booking = await prisma.booking.create({
      data: {
        eventType: data.eventType,
        eventDate: eventDateTime,
        startTime: data.time || null,
        venue: data.venue || null,
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        clientPhone: data.clientPhone || null,
        company: data.company || null,
        budgetRange: data.budgetRange || null,
        additionalNotes: data.additionalNotes || null,
        status: 'PENDING'
      }
    })

    return NextResponse.json({
      success: true,
      bookingId: booking.id,
      message: "Booking request received successfully"
    })
  } catch (error: unknown) {
    console.error("Booking creation error:", error)
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    )
  }
}