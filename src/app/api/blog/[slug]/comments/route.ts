import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

interface RouteParams {
  params: Promise<{ slug: string }>
}

// GET: Get comments for a blog post
export async function GET(
  request: Request,
  { params }: RouteParams
) {
  try {
    const { slug } = await params
    
    // Get the post first
    const post = await prisma.blogPost.findUnique({
      where: { slug, isPublished: true }
    })
    
    if (!post) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      )
    }
    
    // Get approved comments (excluding replies)
    const comments = await prisma.comment.findMany({
      where: {
        postId: post.id,
        isApproved: true,
        parentId: null // Only top-level comments
      },
      include: {
        replies: {
          where: { isApproved: true },
          include: {
            replies: {
              where: { isApproved: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json(comments)
  } catch (error) {
    console.error("Comments fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    )
  }
}

// POST: Add new comment
export async function POST(
  request: Request,
  { params }: RouteParams
) {
  try {
    const { slug } = await params
    const data = await request.json()
    
    // Get the post
    const post = await prisma.blogPost.findUnique({
      where: { slug, isPublished: true }
    })
    
    if (!post) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      )
    }
    
    // Create the comment
    const comment = await prisma.comment.create({
      data: {
        content: data.content,
        authorName: data.authorName,
        authorEmail: data.authorEmail,
        authorAvatar: data.authorAvatar,
        authorId: data.authorId, // User ID of comment author
        postId: post.id,
        parentId: data.parentId || null,
        isApproved: false // Comments need approval
      }
    })
    
    return NextResponse.json(comment)
  } catch (error) {
    console.error("Comment create error:", error)
    return NextResponse.json(
      { error: "Failed to add comment" },
      { status: 500 }
    )
  }
}