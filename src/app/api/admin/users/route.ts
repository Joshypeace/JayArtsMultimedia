import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import bcrypt from "bcryptjs"
import { Prisma } from "@/generated/prisma/client"

type UserRole = 'ADMIN' | 'EDITOR' | 'VIEWER'

interface UserQueryParams {
  role?: UserRole | 'ALL'
  search?: string
  page: number
  limit: number
  sortBy: 'name' | 'email' | 'role' | 'createdAt' | 'lastLogin'
  sortOrder: 'asc' | 'desc'
  status?: 'active' | 'inactive' | 'all'
}

export async function GET(request: Request) {
  try {
    // 1. Authentication - Only admins can view users
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

    // 2. Parse query parameters
    const { searchParams } = new URL(request.url)
    
    const queryParams: UserQueryParams = {
      role: searchParams.get('role') as UserRole | 'ALL' || 'ALL',
      search: searchParams.get('search') || undefined,
      page: Math.max(1, parseInt(searchParams.get('page') || '1')),
      limit: Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20'))),
      sortBy: (searchParams.get('sortBy') as UserQueryParams['sortBy']) || 'createdAt',
      sortOrder: searchParams.get('sortOrder') === 'asc' ? 'asc' : 'desc',
      status: (searchParams.get('status') as 'active' | 'inactive' | 'all') || 'all'
    }

    const skip = (queryParams.page - 1) * queryParams.limit

    // 3. Build where clause
    const where: Prisma.UserWhereInput = {}

    // Filter by role
    if (queryParams.role && queryParams.role !== 'ALL') {
      where.role = queryParams.role
    }

    // Filter by status (active = logged in within last 30 days)
    if (queryParams.status !== 'all') {
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      
      if (queryParams.status === 'active') {
        where.lastLogin = { gte: thirtyDaysAgo }
      } else if (queryParams.status === 'inactive') {
        where.OR = [
          { lastLogin: null },
          { lastLogin: { lt: thirtyDaysAgo } }
        ]
      }
    }

    // Search filter
    if (queryParams.search && queryParams.search.trim()) {
      const searchTerm = queryParams.search.trim()
      where.OR = [
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { email: { contains: searchTerm, mode: 'insensitive' } }
      ]
    }

    // 4. Execute queries in parallel
    const [users, total, roleCounts, activityStats] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: {
          [queryParams.sortBy]: queryParams.sortOrder
        },
        skip,
        take: queryParams.limit,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          image: true,
          emailVerified: true,
          lastLogin: true,
          createdAt: true,
          updatedAt: true,
          // Get counts of related items
          _count: {
            select: {
              blogPosts: true,
              portfolioItems: true,
              services: true,
              bookings: true,
              inquiries: true
            }
          }
        }
      }),
      prisma.user.count({ where }),
      prisma.user.groupBy({
        by: ['role'],
        _count: { id: true }
      }),
      // Get activity stats
      prisma.user.count({
        where: {
          lastLogin: {
            gte: new Date(new Date().setDate(new Date().getDate() - 7))
          }
        }
      })
    ])

    // 5. Format role counts
    const formattedRoleCounts = {
      ...{'ADMIN': 0, 'EDITOR': 0, 'VIEWER': 0},
      ...roleCounts.reduce((acc, item) => {
        acc[item.role as UserRole] = item._count.id
        return acc
      }, {} as Record<UserRole, number>)
    }

    // 6. Calculate pagination
    const totalPages = Math.ceil(total / queryParams.limit)
    const hasNextPage = queryParams.page < totalPages
    const hasPrevPage = queryParams.page > 1

    // 7. Return response
    return NextResponse.json({
      success: true,
      data: {
        users: users.map(user => ({
          ...user,
          lastActive: user.lastLogin,
          isActive: user.lastLogin 
            ? new Date(user.lastLogin) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            : false
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
            role: queryParams.role,
            search: queryParams.search || null,
            status: queryParams.status,
            sortBy: queryParams.sortBy,
            sortOrder: queryParams.sortOrder
          },
          available: {
            roles: Object.entries(formattedRoleCounts).map(([role, count]) => ({
              value: role,
              label: role,
              count
            }))
          }
        },
        summary: {
          total,
          admins: formattedRoleCounts.ADMIN,
          editors: formattedRoleCounts.EDITOR,
          viewers: formattedRoleCounts.VIEWER,
          activeLast7Days: activityStats
        }
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error("Users API Error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch users" },
      { status: 500 }
    )
  }
}

// POST - Create new user
export async function POST(request: Request) {
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

    const body = await request.json()
    const { name, email, password, role = 'VIEWER' } = body

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      )
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 8 characters" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "User with this email already exists" },
        { status: 409 }
      )
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: role as UserRole,
        emailVerified: false
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    })

    return NextResponse.json({
      success: true,
      data: user,
      message: "User created successfully"
    })

  } catch (error) {
    console.error("User creation error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create user" },
      { status: 500 }
    )
  }
}