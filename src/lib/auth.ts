import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import axios from "axios";

declare module "next-auth" {
  interface User {
    role: string;
    name: string;
  }
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string;
    id: string;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        recaptchaToken: { label: "Recaptcha Token", type: "hidden" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter an email and password");
        }

        // Verify reCAPTCHA token
        try {
          const recaptchaResponse = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify`,
            null,
            {
              params: {
                secret: process.env.RECAPTCHA_SECRET_KEY,
                response: credentials.recaptchaToken,
              },
            }
          );

          if (!recaptchaResponse.data.success) {
            throw new Error("reCAPTCHA verification failed");
          }
        } catch (error) {
          console.error("reCAPTCHA verification error:", error);
          throw new Error("Failed to verify reCAPTCHA");
        }

        // Find user by email
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user || !user.passwordHash) {
          throw new Error("No user found with this email");
        }

        // Check password
        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        if (!passwordMatch) {
          throw new Error("Incorrect password");
        }

        // Check if user has admin or editor role
        if (!["ADMIN", "EDITOR"].includes(user.role)) {
          throw new Error("You don't have permission to access the admin panel");
        }

        // Update last login
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLogin: new Date() },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};