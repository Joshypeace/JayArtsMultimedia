import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { Prisma } from '@/generated/prisma/client'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const { name, email, subject, message } = body
    
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { 
          success: false,
          error: "Missing required fields" 
        },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { 
          success: false,
          error: "Invalid email format" 
        },
        { status: 400 }
      )
    }

    // Validate message length
    if (message.length < 10) {
      return NextResponse.json(
        { 
          success: false,
          error: "Message must be at least 10 characters long" 
        },
        { status: 400 }
      )
    }

    if (message.length > 5000) {
      return NextResponse.json(
        { 
          success: false,
          error: "Message must not exceed 5000 characters" 
        },
        { status: 400 }
      )
    }

    // Check for spam (basic rate limiting - same email within 1 minute)
    const recentInquiry = await prisma.inquiry.findFirst({
      where: {
        email,
        createdAt: {
          gte: new Date(Date.now() - 60000) // Last minute
        }
      }
    })

    if (recentInquiry) {
      return NextResponse.json(
        { 
          success: false,
          error: "Please wait a minute before sending another message" 
        },
        { status: 429 }
      )
    }

    // Create inquiry
    const inquiry = await prisma.inquiry.create({
      data: {
        name,
        email,
        phone: body.phone || null,
        company: body.company || null,
        subject,
        message,
        source: "contact_form",
        category: body.category || null,
        status: "NEW"
      }
    })

    // Log for monitoring
    console.log(`New inquiry received: ${inquiry.id} from ${email}`)

    return NextResponse.json({
      success: true,
      data: {
        id: inquiry.id,
        message: "Thank you for your message. We'll get back to you soon!"
      }
    })

  } catch (error) {
    console.error("Contact form error:", {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })

    // Handle Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        { 
          success: false,
          error: "Database error occurred" 
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        success: false,
        error: "Failed to send message. Please try again." 
      },
      { status: 500 }
    )
  }
}