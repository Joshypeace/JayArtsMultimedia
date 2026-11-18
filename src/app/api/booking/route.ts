import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .nullable()
    .transform((v) => (v ? v : null))

const bookingSchema = z.object({
  eventType: z.string().trim().min(1).max(100),
  eventDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date"),
  time: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Invalid time")
    .optional()
    .nullable()
    .or(z.literal("")),
  venue: optionalText(300),
  clientName: z.string().trim().min(2).max(100),
  clientEmail: z.string().trim().email().max(200),
  clientPhone: optionalText(30),
  company: optionalText(150),
  budgetRange: optionalText(50),
  additionalNotes: optionalText(3000),
  // hidden honeypot field: real visitors never fill it in
  website: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const parsed = bookingSchema.safeParse(await request.json().catch(() => null))
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Please check the booking details" },
        { status: 400 }
      )
    }
    const data = parsed.data
    if (data.website) return NextResponse.json({ success: true }) // bot: pretend success

    // The studio works in Malawi time (UTC+2, no daylight saving).
    const eventDateTime = new Date(`${data.eventDate}T${data.time || "00:00"}:00+02:00`)
    if (isNaN(eventDateTime.getTime())) {
      return NextResponse.json({ error: "Invalid date" }, { status: 400 })
    }
    const todayInMalawi = new Date(Date.now() + 2 * 3600_000).toISOString().slice(0, 10)
    if (data.eventDate < todayInMalawi) {
      return NextResponse.json({ error: "Please choose a date in the future" }, { status: 400 })
    }

    const booking = await prisma.booking.create({
      data: {
        eventType: data.eventType,
        eventDate: eventDateTime,
        startTime: data.time || null,
        venue: data.venue,
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        clientPhone: data.clientPhone,
        company: data.company,
        budgetRange: data.budgetRange,
        additionalNotes: data.additionalNotes,
        status: "PENDING",
      },
    })

    return NextResponse.json({
      success: true,
      bookingId: booking.id,
      message: "Booking request received successfully",
    })
  } catch (error: unknown) {
    console.error("Booking creation error:", error)
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
  }
}
