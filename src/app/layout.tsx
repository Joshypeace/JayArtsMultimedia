import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import AuthSessionProvider from "@/components/providers/session-provider"

export const metadata: Metadata = {
  title: "JayArts Multimedia - Photography, Videography & Design",
  description: "Professional multimedia agency specializing in photography, videography, and graphic design",
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${GeistSans.className} ${GeistMono.variable} antialiased bg-background text-foreground`}
      >
        <AuthSessionProvider>{children}</AuthSessionProvider>
        <Analytics />
      </body>
    </html>
  )
}
