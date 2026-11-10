import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"

/**
 * For API route handlers: returns a 401/403 response if the caller is not an
 * ADMIN or EDITOR, or null if they are allowed through.
 */
export async function adminApiGuard(): Promise<NextResponse | null> {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  if (session.user.role !== "ADMIN" && session.user.role !== "EDITOR") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  return null
}

export async function auth() {
  return await getServerSession(authOptions)
}

export async function requireAuth() {
  const session = await auth()
  
  if (!session?.user) {
    throw new Error("Unauthorized")
  }
  
  return session.user
}

export async function requireAdmin() {
  const user = await requireAuth()
  
  if (user.role !== "ADMIN" && user.role !== "EDITOR") {
    throw new Error("Admin or Editor access required")
  }
  
  return user
}