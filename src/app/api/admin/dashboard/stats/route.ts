import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const totalBookings = await prisma.booking.count()
    const portfolioItems = await prisma.portfolioItem.count({
      where: { publishedAt: { not: null } }
    })
    const blogPosts = await prisma.blogPost.count({
      where: { published: true, publishedAt: { not: null } }
    })
    const inquiries = await prisma.inquiry.count({
      where: { status: "NEW" }
    })
    const totalUsers = await prisma.user.count()
    const subscribers = await prisma.subscriber.count({
      where: { subscribed: true }
    })
    const pendingBookings = await prisma.booking.count({
      where: { status: "PENDING" }
    })
    const teamMembers = await prisma.teamMember.count()
    
    const completedBookings = await prisma.booking.findMany({
      where: { 
        status: "COMPLETED",
        budget: { not: null }
      },
      select: { budget: true }
    })

    const revenue = completedBookings.reduce((sum, booking) => {
      return sum + (Number(booking.budget) || 0)
    }, 0)

    return NextResponse.json({
      totalBookings,
      portfolioItems,
      blogPosts,
      inquiries,
      totalUsers,
      revenue,
      subscribers,
      pendingBookings,
      teamMembers
    })

  } catch (error) {
    console.error("Dashboard stats error:", error)
    
    const errorMessage = error instanceof Error ? error.message : "Internal server error"
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}