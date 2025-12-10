import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user;
}

export async function requireAuth(redirectTo: string = "/admin/login") {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect(redirectTo);
  }
  
  return session;
}

export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/admin/login");
  }
  
  if (session.user.role !== "ADMIN") {
    redirect("/admin/dashboard");
  }
  
  return session;
}

export async function hashPassword(password: string): Promise<string> {
  try {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    console.error("Error hashing password:", error);
    throw new Error("Failed to hash password");
  }
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    console.error("Error verifying password:", error);
    throw new Error("Failed to verify password");
  }
}
export async function createFirstAdminUser() {
  const adminExists = await prisma.user.findFirst({
    where: {
      role: "ADMIN",
    },
  });

  if (!adminExists) {
    const hashedPassword = await hashPassword("Admin@123");
    
    await prisma.user.create({
      data: {
        email: "admin@jayarts.com",
        name: "Admin User",
        passwordHash: hashedPassword,
        role: "ADMIN",
        emailVerified: true,
      },
    });
    
    console.log("First admin user created: admin@jayarts.com / Admin@123");
  }
}