// lib/auth.ts
import type { AuthOptions } from "next-auth";
import type { Adapter } from "next-auth/adapters"; 
import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { verifyRecaptcha } from "@/lib/recaptcha";

export const authOptions: AuthOptions = {
  
  adapter: PrismaAdapter(prisma) as Adapter,

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },


  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        recaptchaToken: { label: "reCAPTCHA Token", type: "text" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const recaptchaValid = await verifyRecaptcha(credentials.recaptchaToken);
        if (!recaptchaValid) throw new Error("reCAPTCHA verification failed");

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase() },
        });

        if (!user) throw new Error("Invalid credentials");

        const validPassword = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );
        if (!validPassword) throw new Error("Invalid credentials");

        if (!user.emailVerified) {
          throw new Error("Please verify your email first");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          // Custom field added to the returned user object
          role: user.role, 
          image: user.image,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // 'user' is only present on initial sign-in (from authorize or OAuth)
      if (user) {
        token.id = user.id;
        // User type is augmented by next-auth.d.ts to include role
        token.role = user.role; 
      }

      // Handle session update on client-side trigger (e.g., user profile update)
      if (trigger === "update" && session) {
        token = { ...token, ...session };
      }

      return token;
    },

    async session({ session, token }) {
      // Pass the custom fields from the token to the session object
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },

    async signIn({ user, account }) {
      try {
        if (account?.provider === "google") {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
          });

          // Only allow Google sign-in for users that exist and have ADMIN or EDITOR role
          if (existingUser) {
            return ["ADMIN", "EDITOR"].includes(existingUser.role);
          }

          // Block new Google sign-ups that don't match an existing user
          return false;
        }

        // Allow all Credentials sign-ins (logic already in authorize)
        return true;
      } catch (err) {
        console.error("SignIn error:", err);
        return false;
      }
    },
  },

  events: {
    // async createUser({ user }) {
    //   // Send welcome / verification email here
    // },
  },
};