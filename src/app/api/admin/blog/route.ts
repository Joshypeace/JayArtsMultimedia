import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// GET: Fetch all blog posts for admin
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const blogPosts = await prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        },
        _count: {
          select: {
            comments: true
          }
        }
      }
    })
    
    return NextResponse.json(blogPosts)
  } catch (error) {
    console.error("Blog posts fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch blog posts" },
      { status: 500 }
    )
  }
}

// POST: Create new blog post
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const data = await request.json()
    
    // Generate slug from title
    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    
    const blogPost = await prisma.blogPost.create({
      data: {
        title: data.title,
        slug: slug,
        excerpt: data.excerpt,
        content: data.content,
        coverImage: data.coverImage,
        category: data.category,
        readTime: data.readTime || 5,
        tags: data.tags || [],
        authorId: session.user.id,
        publishedAt: data.isPublished ? new Date() : null,
        isPublished: data.isPublished || false,
        isFeatured: data.isFeatured || false,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription
      },
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })
    
    return NextResponse.json(blogPost)
  } catch (error: unknown) {
    console.error("Blog post create error:", error)
    
    // Check for duplicate slug
    if (error && typeof error === 'object' && 'code' in error && (error as { code: string }).code === 'P2002') {
      return NextResponse.json(
        { error: "A blog post with this title already exists" },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: "Failed to create blog post" },
      { status: 500 }
    )
  }
}