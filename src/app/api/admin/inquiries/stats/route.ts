import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
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

    // Get counts by status
    const statusCounts = await prisma.inquiry.groupBy({
      by: ['status'],
      _count: {
        id: true
      }
    })

    // Get total
    const total = await prisma.inquiry.count()

    // Get today's inquiries
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const todayCount = await prisma.inquiry.count({
      where: {
        createdAt: {
          gte: today
        }
      }
    })

    // Get this week's inquiries
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    
    const weekCount = await prisma.inquiry.count({
      where: {
        createdAt: {
          gte: weekAgo
        }
      }
    })

    // Get average response time (for responded inquiries)
    const respondedInquiries = await prisma.inquiry.findMany({
      where: {
        respondedAt: { not: null }
      },
      select: {
        createdAt: true,
        respondedAt: true
      }
    })

    let avgResponseHours = 0
    if (respondedInquiries.length > 0) {
      const totalHours = respondedInquiries.reduce((sum, inquiry) => {
        const diff = inquiry.respondedAt!.getTime() - inquiry.createdAt.getTime()
        return sum + (diff / (1000 * 60 * 60))
      }, 0)
      avgResponseHours = Math.round(totalHours / respondedInquiries.length)
    }

    // Get top sources
    const sourceCounts = await prisma.inquiry.groupBy({
      by: ['source'],
      _count: {
        id: true
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      },
      take: 5
    })

    return NextResponse.json({
      success: true,
      data: {
        total,
        today: todayCount,
        thisWeek: weekCount,
        averageResponseTime: avgResponseHours,
        statusBreakdown: statusCounts.reduce((acc, item) => {
          acc[item.status] = item._count.id
          return acc
        }, {} as Record<string, number>),
        topSources: sourceCounts.map(source => ({
          source: source.source,
          count: source._count.id
        }))
      }
    })

  } catch (error) {
    console.error("Inquiry stats error:", error)
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to fetch inquiry statistics" 
      },
      { status: 500 }
    )
  }
}