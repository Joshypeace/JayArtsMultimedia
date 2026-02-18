import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import type { Prisma } from '@/generated/prisma/client'

type InquiryWhereInput = Prisma.InquiryWhereInput


type InquiryStatus = 'NEW' | 'RESPONDED' | 'RESOLVED' | 'SPAM'

interface InquiryQueryParams {
  status?: InquiryStatus | 'ALL'
  page: number
  limit: number
  search?: string
  fromDate?: string
  toDate?: string
  sortBy: 'createdAt' | 'name' | 'email' | 'status'
  sortOrder: 'asc' | 'desc'
}

export async function GET(request: Request) {
  try {
    // 1. Authentication
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

    // 2. Parse query parameters
    const { searchParams } = new URL(request.url)
    
    const queryParams: InquiryQueryParams = {
      status: searchParams.get('status') as InquiryStatus | 'ALL' || 'ALL',
      page: Math.max(1, parseInt(searchParams.get('page') || '1')),
      limit: Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20'))),
      search: searchParams.get('search') || undefined,
      fromDate: searchParams.get('fromDate') || undefined,
      toDate: searchParams.get('toDate') || undefined,
      sortBy: (searchParams.get('sortBy') as InquiryQueryParams['sortBy']) || 'createdAt',
      sortOrder: searchParams.get('sortOrder') === 'asc' ? 'asc' : 'desc'
    }

    const skip = (queryParams.page - 1) * queryParams.limit

    // 3. Build where clause
    const where: InquiryWhereInput = {}

    // Status filter
    if (queryParams.status && queryParams.status !== 'ALL') {
      where.status = queryParams.status
    }

    // Date range filter
    if (queryParams.fromDate || queryParams.toDate) {
      where.createdAt = {}
      if (queryParams.fromDate) {
        const date = new Date(queryParams.fromDate)
        if (!isNaN(date.getTime())) {
          where.createdAt.gte = date
        }
      }
      if (queryParams.toDate) {
        const date = new Date(queryParams.toDate)
        if (!isNaN(date.getTime())) {
          where.createdAt.lte = date
        }
      }
    }

    // Search filter
    if (queryParams.search && queryParams.search.trim()) {
      const searchTerm = queryParams.search.trim()
      where.OR = [
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { email: { contains: searchTerm, mode: 'insensitive' } },
        { subject: { contains: searchTerm, mode: 'insensitive' } },
        { message: { contains: searchTerm, mode: 'insensitive' } },
        { company: { contains: searchTerm, mode: 'insensitive' } },
        { phone: { contains: searchTerm, mode: 'insensitive' } }
      ]
    }

    // 4. Execute queries in parallel
    const [inquiries, total, statusCounts] = await Promise.all([
      prisma.inquiry.findMany({
        where,
        orderBy: {
          [queryParams.sortBy]: queryParams.sortOrder
        },
        skip,
        take: queryParams.limit,
        include: {
          assignedTo: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      }),
      prisma.inquiry.count({ where }),
      prisma.inquiry.groupBy({
        by: ['status'],
        _count: {
          id: true
        }
      })
    ])

    // 5. Format status counts
    const formattedStatusCounts: Record<InquiryStatus, number> = {
      NEW: 0,
      RESPONDED: 0,
      RESOLVED: 0,
      SPAM: 0
    }
    
    statusCounts.forEach(item => {
      formattedStatusCounts[item.status as InquiryStatus] = item._count.id
    })

    // 6. Calculate pagination
    const totalPages = Math.ceil(total / queryParams.limit)
    const hasNextPage = queryParams.page < totalPages
    const hasPrevPage = queryParams.page > 1

    // 7. Return response
    return NextResponse.json({
      success: true,
      data: {
        inquiries: inquiries.map(inquiry => ({
          id: inquiry.id,
          name: inquiry.name,
          email: inquiry.email,
          phone: inquiry.phone,
          company: inquiry.company,
          subject: inquiry.subject,
          message: inquiry.message,
          source: inquiry.source,
          status: inquiry.status,
          assignedTo: inquiry.assignedTo,
          createdAt: inquiry.createdAt,
          respondedAt: inquiry.respondedAt,
          response: inquiry.response
        })),
        pagination: {
          page: queryParams.page,
          limit: queryParams.limit,
          total,
          totalPages,
          hasNextPage,
          hasPrevPage,
          nextPage: hasNextPage ? queryParams.page + 1 : null,
          prevPage: hasPrevPage ? queryParams.page - 1 : null
        },
        filters: {
          applied: {
            status: queryParams.status,
            search: queryParams.search || null,
            fromDate: queryParams.fromDate || null,
            toDate: queryParams.toDate || null,
            sortBy: queryParams.sortBy,
            sortOrder: queryParams.sortOrder
          },
          available: {
            statuses: Object.entries(formattedStatusCounts).map(([status, count]) => ({
              value: status,
              label: status,
              count
            }))
          }
        },
        summary: {
          total,
          newCount: formattedStatusCounts.NEW,
          respondedCount: formattedStatusCounts.RESPONDED,
          resolvedCount: formattedStatusCounts.RESOLVED,
          spamCount: formattedStatusCounts.SPAM
        }
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error("Inquiries API Error:", {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })

    return NextResponse.json(
      { 
        success: false,
        error: "Failed to fetch inquiries" 
      },
      { status: 500 }
    )
  }
}