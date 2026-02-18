import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
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
      select: { role: true }
    })

    if (currentUser?.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: "Admin access required" },
        { status: 403 }
      )
    }

    // Get total users
    const total = await prisma.user.count()

    // Get users by role
    const roleCounts = await prisma.user.groupBy({
      by: ['role'],
      _count: { id: true }
    })

    // Get users created over time (last 12 months)
    const twelveMonthsAgo = new Date()
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12)

    const monthlySignups = await prisma.user.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: twelveMonthsAgo
        }
      },
      _count: { id: true }
    })

    // Format monthly data
    const monthlyData = monthlySignups.reduce((acc, item) => {
      const month = item.createdAt.toLocaleString('default', { month: 'short', year: 'numeric' })
      acc[month] = (acc[month] || 0) + item._count.id
      return acc
    }, {} as Record<string, number>)

    // Get active users (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const activeUsers = await prisma.user.count({
      where: {
        lastLogin: {
          gte: thirtyDaysAgo
        }
      }
    })

    // Get verified vs unverified
    const verifiedUsers = await prisma.user.count({
      where: { emailVerified: true }
    })

    // Get content contribution stats
    const contributionStats = await prisma.user.findMany({
      take: 10,
      orderBy: {
        blogPosts: {
          _count: 'desc'
        }
      },
      select: {
        name: true,
        email: true,
        _count: {
          select: {
            blogPosts: true,
            portfolioItems: true,
            services: true,
            bookings: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        total,
        byRole: roleCounts.reduce((acc, item) => {
          acc[item.role] = item._count.id
          return acc
        }, {} as Record<string, number>),
        activeUsers,
        verifiedUsers,
        unverifiedUsers: total - verifiedUsers,
        monthlySignups: monthlyData,
        topContributors: contributionStats
      }
    })

  } catch (error) {
    console.error("User stats error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch user statistics" },
      { status: 500 }
    )
  }
}