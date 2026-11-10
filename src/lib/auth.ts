import { NextAuthOptions, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";
import { UserRole } from "../generated/prisma/client";

type Credentials = {
  email: string;
  password: string;
};

// Single source of truth for NextAuth config. Used by the
// /api/auth/[...nextauth] handler and by getServerSession() everywhere else.
export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(rawCreds) {
        const credentials = rawCreds as Credentials;

        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.trim().toLowerCase() },
        });

        if (!user || !user.passwordHash) {
          throw new Error("Invalid credentials");
        }

        // Verify the password BEFORE revealing account status, so the
        // status messages can't be used to probe which emails exist.
        const valid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!valid) {
          throw new Error("Invalid credentials");
        }

        // Only approved accounts may sign in. Messages are matched by the login page.
        if (user.status === "PENDING") {
          throw new Error("Your account is pending approval. Please wait for an administrator to approve your account.");
        }
        if (user.status === "REJECTED") {
          throw new Error("Your registration was rejected. Please contact support.");
        }
        if (user.status !== "ACTIVE") {
          throw new Error("Your account has been suspended. Please contact support.");
        }

        await prisma.user.update({
          where: { id: user.id },
          data: { lastLogin: new Date() },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          status: user.status,
          image: user.image ?? undefined,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role: UserRole }).role;
        token.status = (user as { status?: string }).status;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
        session.user.status = token.status as string;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

// Add this function for server-side auth
export async function auth() {
  return await getServerSession(authOptions);
}

// Optional: Helper to get current user
export async function getCurrentUser() {
  const session = await auth();
  return session?.user || null;
}