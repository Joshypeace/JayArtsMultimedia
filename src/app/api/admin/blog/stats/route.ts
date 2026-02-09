import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get counts
    const totalPosts = await prisma.blogPost.count()
    const publishedPosts = await prisma.blogPost.count({ where: { isPublished: true } })
    const draftPosts = totalPosts - publishedPosts
    const featuredPosts = await prisma.blogPost.count({ where: { isFeatured: true, isPublished: true } })
    
    // Get comments stats
    const totalComments = await prisma.comment.count()
    const pendingComments = await prisma.comment.count({ where: { isApproved: false } })
    
    // Get views stats
    const totalViews = await prisma.blogPost.aggregate({
      _sum: { views: true }
    })
    
    // Get recent posts
    const recentPosts = await prisma.blogPost.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        title: true,
        slug: true,
        views: true,
        createdAt: true
      }
    })
    
    // Get popular posts
    const popularPosts = await prisma.blogPost.findMany({
      take: 5,
      where: { isPublished: true },
      orderBy: { views: 'desc' },
      select: {
        title: true,
        slug: true,
        views: true,
        likes: true
      }
    })
    
    return NextResponse.json({
      stats: {
        totalPosts,
        publishedPosts,
        draftPosts,
        featuredPosts,
        totalComments,
        pendingComments,
        totalViews: totalViews._sum.views || 0
      },
      recentPosts,
      popularPosts
    })
  } catch (error) {
    console.error("Blog stats fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch blog stats" },
      { status: 500 }
    )
  }
}