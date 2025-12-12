import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

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