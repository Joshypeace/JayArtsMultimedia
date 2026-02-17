import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get counts by status
    const statusCounts = await prisma.booking.groupBy({
      by: ['status'],
      _count: {
        id: true
      }
    })

    // Format status counts
    const counts = statusCounts.reduce((acc, item) => {
      acc[item.status] = item._count.id
      return acc
    }, {} as Record<string, number>)

    // Get total bookings
    const total = await prisma.booking.count()

    // Get today's bookings
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const todayBookings = await prisma.booking.count({
      where: {
        createdAt: {
          gte: today
        }
      }
    })

    // Get upcoming events (next 30 days)
    const upcomingEvents = await prisma.booking.count({
      where: {
        eventDate: {
          gte: new Date(),
          lte: new Date(new Date().setDate(new Date().getDate() + 30))
        },
        status: {
          in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS']
        }
      }
    })

    return NextResponse.json({
      total,
      todayBookings,
      upcomingEvents,
      counts: {
        PENDING: counts.PENDING || 0,
        CONFIRMED: counts.CONFIRMED || 0,
        IN_PROGRESS: counts.IN_PROGRESS || 0,
        COMPLETED: counts.COMPLETED || 0,
        CANCELLED: counts.CANCELLED || 0,
        RESCHEDULED: counts.RESCHEDULED || 0
      }
    })
  } catch (error) {
    console.error("Booking stats error:", error)
    return NextResponse.json(
      { error: "Failed to fetch booking stats" },
      { status: 500 }
    )
  }
}