import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

type BlogPostWhereInput = NonNullable<
  Parameters<typeof prisma.blogPost.count>[0]
>["where"]

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    const category = searchParams.get("category")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "9")
    const skip = (page - 1) * limit
    const search = searchParams.get("search")
    const featured = searchParams.get("featured")

    const where: BlogPostWhereInput = { isPublished: true }

    if (category && category !== "ALL") {
      where.category = category
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
        { tags: { hasSome: [search] } }
      ]
    }

    if (featured === "true") {
      where.isFeatured = true
    }

    const total = await prisma.blogPost.count({ where })

    const blogPosts = await prisma.blogPost.findMany({
      where,
      orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }],
      skip,
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        category: true,
        readTime: true,
        publishedAt: true,
        isFeatured: true,
        tags: true,
        views: true,
        likes: true,
        createdAt: true,
        author: {
          select: {
            name: true
          }
        }
      }
    })

    return NextResponse.json({
      posts: blogPosts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    })
  } catch (error) {
    console.error("Public blog posts fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch blog posts" },
      { status: 500 }
    )
  }
}
