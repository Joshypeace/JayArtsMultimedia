import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const limit = parseInt(url.searchParams.get("limit") || "5")

    const recentBookings = await prisma.booking.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        clientName: true,
        clientEmail: true,
        eventType: true,
        eventDate: true,
        status: true,
        budget: true,
        createdAt: true,
        service: {
          select: {
            name: true,
            category: true
          }
        }
      }
    })

    return NextResponse.json(recentBookings)

  } catch (error) {
    console.error("Recent bookings error:", error)
    
    const errorMessage = error instanceof Error ? error.message : "Internal server error"
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}