import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, password } = body

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

    // Create user with PENDING status
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: "EDITOR", // Default role for new registrations
        status: "PENDING", // Requires approval
        emailVerified: false
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true
      }
    })

    // TODO: Send notification email to admin about new registration
    // You can implement this later

    return NextResponse.json({
      success: true,
      data: user,
      message: "Registration successful! Your account is pending approval from an administrator."
    })

  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to register user" },
      { status: 500 }
    )
  }
}