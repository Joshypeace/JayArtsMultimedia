import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { preload } from "react-dom"
import "./globals.css"
import AuthSessionProvider from "@/components/providers/session-provider"
import PageLoader from "@/components/common/page-loader"

export const metadata: Metadata = {
  title: "JayArts Multimedia - Photography, Videography & Design",
  description: "Professional multimedia agency specializing in photography, videography, and graphic design",
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // The loader masks this image; fetch it with top priority so the loader is never blank.
  preload("/jayarts-logo-white.png", { as: "image", fetchPriority: "high", crossOrigin: "anonymous" })
  return (
    <html lang="en" className="dark">
      <body
        className={`${GeistSans.className} ${GeistMono.variable} antialiased bg-background text-foreground`}
      >
        <PageLoader />
        {/* without JS the loader can't hide itself */}
        <noscript>
          <style>{`.ja-page-loader{display:none!important}`}</style>
        </noscript>
        <AuthSessionProvider>{children}</AuthSessionProvider>
        <Analytics />
      </body>
    </html>
  )
}
