import type React from "react"
import type { Metadata, Viewport } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { preload } from "react-dom"
import "./globals.css"
import AuthSessionProvider from "@/components/providers/session-provider"
import PageLoader from "@/components/common/page-loader"
import { siteConfig, siteUrl } from "@/lib/site"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "JayArts Multimedia | Photography, Videography & Design in Lilongwe",
    template: "%s | JayArts Multimedia",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "JayArts Multimedia",
    "photography Lilongwe",
    "videography Malawi",
    "graduation photography",
    "event photography Malawi",
    "graphic design Lilongwe",
    "live streaming Malawi",
  ],
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    locale: "en_MW",
    title: "JayArts Multimedia | Photography, Videography & Design",
    description: siteConfig.description,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: "JayArts Multimedia" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "JayArts Multimedia | Photography, Videography & Design",
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  formatDetection: { telephone: false },
}

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
}

// Helps Google show the business (name, area, contact, socials) in search results.
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: siteConfig.name,
  url: siteUrl,
  logo: `${siteUrl}/jayarts-logo-white.png`,
  image: `${siteUrl}${siteConfig.ogImage}`,
  description: siteConfig.description,
  email: siteConfig.email,
  telephone: siteConfig.phone,
  address: { "@type": "PostalAddress", addressLocality: siteConfig.locality, addressCountry: siteConfig.country },
  areaServed: "Malawi",
  sameAs: Object.values(siteConfig.social),
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
        <script
          type="application/ld+json"
          // static, server-built object: safe to inline
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c") }}
        />
        <AuthSessionProvider>{children}</AuthSessionProvider>
        <Analytics />
      </body>
    </html>
  )
}
