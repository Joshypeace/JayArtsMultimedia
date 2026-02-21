import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// GET - Fetch current settings
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

    // Get settings (there should only be one record)
    let settings = await prisma.siteSettings.findFirst()

    // If no settings exist, create default settings
    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          siteName: "JayArts Multimedia",
          siteDescription: "Professional photography, videography, and design services",
          contactEmail: "info@jayarts.com",
          phone: "+265 123 456 789",
          address: "Lilongwe, Malawi",
          socialLinks: {
            instagram: "https://instagram.com/jayarts",
            facebook: "https://facebook.com/jayarts",
            twitter: "https://twitter.com/jayarts",
            linkedin: "https://linkedin.com/company/jayarts",
            youtube: "https://youtube.com/jayarts"
          },
          metaTitle: "JayArts Multimedia - Photography, Videography & Design",
          metaDescription: "Professional photography, videography, and graphic design services in Malawi. Book your session today!",
          keywords: ["photography", "videography", "graphic design", "Malawi", "creative studio"],
          googleAnalyticsId: "",
          facebookPixelId: ""
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: settings
    })

  } catch (error) {
    console.error("Settings fetch error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch settings" },
      { status: 500 }
    )
  }
}

// PATCH - Update settings
export async function PATCH(request: Request) {
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
    
    // Get existing settings
    let settings = await prisma.siteSettings.findFirst()
    
    if (!settings) {
      // Create if doesn't exist
      settings = await prisma.siteSettings.create({
        data: {
          siteName: body.siteName || "JayArts Multimedia",
          siteDescription: body.siteDescription || null,
          contactEmail: body.contactEmail || "",
          phone: body.phone || null,
          address: body.address || null,
          socialLinks: body.socialLinks || {},
          metaTitle: body.metaTitle || null,
          metaDescription: body.metaDescription || null,
          keywords: body.keywords || [],
          googleAnalyticsId: body.googleAnalyticsId || null,
          facebookPixelId: body.facebookPixelId || null
        }
      })
    } else {
      // Update existing
      settings = await prisma.siteSettings.update({
        where: { id: settings.id },
        data: {
          siteName: body.siteName,
          siteDescription: body.siteDescription,
          contactEmail: body.contactEmail,
          phone: body.phone,
          address: body.address,
          socialLinks: body.socialLinks,
          metaTitle: body.metaTitle,
          metaDescription: body.metaDescription,
          keywords: body.keywords,
          googleAnalyticsId: body.googleAnalyticsId,
          facebookPixelId: body.facebookPixelId
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: settings,
      message: "Settings updated successfully"
    })

  } catch (error) {
    console.error("Settings update error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update settings" },
      { status: 500 }
    )
  }
}