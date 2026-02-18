import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import bcrypt from "bcryptjs"
import { Prisma } from "@/generated/prisma/client"

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET single user details
export async function GET(
  request: Request,
  { params }: RouteParams
) {
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

    const { id } = await params

    const user = await prisma.user.findUnique({
      where: { id },
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
        // Get detailed counts
        _count: {
          select: {
            blogPosts: true,
            portfolioItems: true,
            services: true,
            bookings: true,
            inquiries: true
          }
        },
        // Get recent activity
        blogPosts: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            title: true,
            createdAt: true,
            isPublished: true
          }
        },
        portfolioItems: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            title: true,
            createdAt: true,
            featured: true
          }
        },
        bookings: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            clientName: true,
            eventType: true,
            status: true,
            createdAt: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: user
    })

  } catch (error) {
    console.error("User fetch error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch user" },
      { status: 500 }
    )
  }
}

// PATCH - Update user
export async function PATCH(
  request: Request,
  { params }: RouteParams
) {
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
      select: { role: true, id: true }
    })

    if (currentUser?.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: "Admin access required" },
        { status: 403 }
      )
    }

    const { id } = await params
    const body = await request.json()
    
    // Prevent editing your own role (can't demote yourself)
    if (id === currentUser.id && body.role && body.role !== currentUser.role) {
      return NextResponse.json(
        { success: false, error: "You cannot change your own role" },
        { status: 400 }
      )
    }

    // Build update data
    const updateData: Prisma.UserUpdateInput = {}

    if (body.name) updateData.name = body.name
    if (body.role) updateData.role = body.role
    if (body.image !== undefined) updateData.image = body.image
    if (body.emailVerified !== undefined) updateData.emailVerified = body.emailVerified

    // Update password if provided
    if (body.password) {
      if (body.password.length < 8) {
        return NextResponse.json(
          { success: false, error: "Password must be at least 8 characters" },
          { status: 400 }
        )
      }
      updateData.passwordHash = await bcrypt.hash(body.password, 10)
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        emailVerified: true,
        updatedAt: true
      }
    })

    return NextResponse.json({
      success: true,
      data: user,
      message: "User updated successfully"
    })

  } catch (error) {
    console.error("User update error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update user" },
      { status: 500 }
    )
  }
}

// DELETE - Remove user
export async function DELETE(
  request: Request,
  { params }: RouteParams
) {
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
      select: { role: true, id: true }
    })

    if (currentUser?.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: "Admin access required" },
        { status: 403 }
      )
    }

    const { id } = await params

    // Prevent deleting yourself
    if (id === currentUser.id) {
      return NextResponse.json(
        { success: false, error: "You cannot delete your own account" },
        { status: 400 }
      )
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      )
    }

    // Delete user (cascade will handle relations)
    await prisma.user.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: "User deleted successfully"
    })

  } catch (error) {
    console.error("User deletion error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete user" },
      { status: 500 }
    )
  }
}