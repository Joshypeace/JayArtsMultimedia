import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

type CommentWhereInput = NonNullable<
  Parameters<typeof prisma.comment.findMany>[0]
>["where"]

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") // 'pending', 'approved', 'all'

    const where: CommentWhereInput = {}

    if (status === "pending") {
      where.isApproved = false
    } else if (status === "approved") {
      where.isApproved = true
    }

    const comments = await prisma.comment.findMany({
      where,
      include: {
        post: {
          select: {
            title: true,
            slug: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json(comments)
  } catch (error) {
    console.error("Admin comments fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    )
  }
}
