import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// Define the booking status enum to match your Prisma schema
const BookingStatus = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  RESCHEDULED: 'RESCHEDULED'
} as const

type BookingStatusType = keyof typeof BookingStatus

// Define the return type for better type safety
type BookingResponse = {
  id: string
  eventType: string
  eventDate: Date
  startTime: string | null
  venue: string | null
  clientName: string
  clientEmail: string
  clientPhone: string | null
  company: string | null
  budgetRange: string | null
  additionalNotes: string | null
  status: BookingStatusType
  createdAt: Date
  service: {
    name: string
    category: string
  } | null
}

export async function GET(request: Request) {
  try {
    // 1. Authentication
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { 
          success: false,
          error: "Unauthorized access. Please log in." 
        },
        { status: 401 }
      )
    }

    // 2. Parse query parameters
    const { searchParams } = new URL(request.url)
    
    // Pagination
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')))
    const skip = (page - 1) * limit

    // Filters
    const status = searchParams.get('status')?.toUpperCase()
    const search = searchParams.get('search')
    const fromDate = searchParams.get('fromDate')
    const toDate = searchParams.get('toDate')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 'asc' : 'desc'

    // 3. Validate status
    const isValidStatus = status && status !== 'ALL' 
      ? Object.keys(BookingStatus).includes(status)
      : true

    if (!isValidStatus) {
      return NextResponse.json(
        { 
          success: false,
          error: `Invalid status. Must be one of: ${Object.keys(BookingStatus).join(', ')}` 
        },
        { status: 400 }
      )
    }

    // 4. Build where clause using raw object (no imports needed)
    const where: any = {}

    // Status filter
    if (status && status !== 'ALL') {
      where.status = status
    }

    // Date range filter
    if (fromDate || toDate) {
      where.eventDate = {}
      if (fromDate) {
        const date = new Date(fromDate)
        if (!isNaN(date.getTime())) {
          where.eventDate.gte = date
        }
      }
      if (toDate) {
        const date = new Date(toDate)
        if (!isNaN(date.getTime())) {
          where.eventDate.lte = date
        }
      }
    }

    // Search filter
    if (search && search.trim()) {
      const searchTerm = search.trim()
      where.OR = [
        { clientName: { contains: searchTerm, mode: 'insensitive' } },
        { clientEmail: { contains: searchTerm, mode: 'insensitive' } },
        { eventType: { contains: searchTerm, mode: 'insensitive' } },
        { clientPhone: { contains: searchTerm, mode: 'insensitive' } }
      ]
    }

    // 5. Execute main query with count
    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        orderBy: {
          [sortBy]: sortOrder
        },
        skip,
        take: limit,
        include: {
          service: {
            select: {
              id: true,
              name: true,
              category: true
            }
          }
        }
      }),
      prisma.booking.count({ where })
    ])

    // 6. Get status counts for filter UI
    const statusCounts = await Promise.all(
      Object.keys(BookingStatus).map(async (statusKey) => {
        const count = await prisma.booking.count({
          where: { status: statusKey as BookingStatusType }
        })
        return {
          status: statusKey,
          label: statusKey.replace('_', ' '),
          count
        }
      })
    )

    // 7. Calculate pagination metadata
    const totalPages = Math.ceil(total / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    // 8. Format the response data
    const formattedBookings = bookings.map((booking): BookingResponse => ({
      id: booking.id,
      eventType: booking.eventType,
      eventDate: booking.eventDate,
      startTime: booking.startTime,
      venue: booking.venue,
      clientName: booking.clientName,
      clientEmail: booking.clientEmail,
      clientPhone: booking.clientPhone,
      company: booking.company,
      budgetRange: booking.budgetRange,
      additionalNotes: booking.additionalNotes,
      status: booking.status as BookingStatusType,
      createdAt: booking.createdAt,
      service: booking.service ? {
        name: booking.service.name,
        category: booking.service.category
      } : null
    }))

    // 9. Return success response
    return NextResponse.json({
      success: true,
      data: {
        bookings: formattedBookings,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNextPage,
          hasPrevPage,
          nextPage: hasNextPage ? page + 1 : null,
          prevPage: hasPrevPage ? page - 1 : null
        },
        filters: {
          applied: {
            status: status || null,
            search: search || null,
            fromDate: fromDate || null,
            toDate: toDate || null,
            sortBy,
            sortOrder
          },
          available: {
            statuses: statusCounts
          }
        },
        summary: {
          totalBookings: total,
          pendingCount: statusCounts.find(s => s.status === 'PENDING')?.count || 0,
          confirmedCount: statusCounts.find(s => s.status === 'CONFIRMED')?.count || 0,
          completedCount: statusCounts.find(s => s.status === 'COMPLETED')?.count || 0
        }
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    // 10. Comprehensive error handling
    console.error("Bookings API Error:", {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    })

    // Handle Prisma-specific errors
    if (error instanceof Error) {
      // Prisma connection error
      if (error.message.includes('prisma')) {
        return NextResponse.json(
          { 
            success: false,
            error: "Database connection error. Please try again later." 
          },
          { status: 503 }
        )
      }
      
      // Validation error
      if (error.message.includes('validation')) {
        return NextResponse.json(
          { 
            success: false,
            error: "Invalid query parameters." 
          },
          { status: 400 }
        )
      }
    }

    // Generic error
    return NextResponse.json(
      { 
        success: false,
        error: process.env.NODE_ENV === 'development' 
          ? error instanceof Error ? error.message : 'Failed to fetch bookings'
          : "An unexpected error occurred. Please try again."
      },
      { status: 500 }
    )
  }
}

// Optional: POST method for bulk operations
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { action, data } = body

    // Bulk status update
    if (action === 'BULK_UPDATE_STATUS') {
      if (!data.bookingIds || !data.status) {
        return NextResponse.json(
          { success: false, error: "Missing required fields" },
          { status: 400 }
        )
      }

      // Validate status
      if (!Object.keys(BookingStatus).includes(data.status)) {
        return NextResponse.json(
          { success: false, error: "Invalid status" },
          { status: 400 }
        )
      }

      const result = await prisma.booking.updateMany({
        where: {
          id: { in: data.bookingIds }
        },
        data: {
          status: data.status,
          statusNotes: data.notes 
            ? `${new Date().toISOString()}: Bulk update - ${data.notes}`
            : `${new Date().toISOString()}: Status changed to ${data.status}`
        }
      })

      return NextResponse.json({
        success: true,
        data: {
          updatedCount: result.count,
          message: `Successfully updated ${result.count} booking${result.count !== 1 ? 's' : ''}`
        }
      })
    }

    return NextResponse.json(
      { success: false, error: "Invalid action" },
      { status: 400 }
    )

  } catch (error) {
    console.error("Bulk operation error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to process request" },
      { status: 500 }
    )
  }
}