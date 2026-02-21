import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access" },
        { status: 401 }
      )
    }

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
    const { metaTitle, metaDescription, keywords } = body

    const settings = await prisma.siteSettings.findFirst()
    
    if (!settings) {
      return NextResponse.json(
        { success: false, error: "Settings not found" },
        { status: 404 }
      )
    }

    const updated = await prisma.siteSettings.update({
      where: { id: settings.id },
      data: {
        metaTitle,
        metaDescription,
        keywords: keywords || []
      }
    })

    return NextResponse.json({
      success: true,
      data: updated,
      message: "SEO settings updated successfully"
    })

  } catch (error) {
    console.error("SEO settings error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update SEO settings" },
      { status: 500 }
    )
  }
}