// Canonical public URL of the site. Set NEXT_PUBLIC_SITE_URL to the custom domain
// (e.g. https://www.jayartsmultimedia.com) once it is connected in Vercel; until then the
// Vercel production domain is used so links, sitemap and social previews still work.
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (explicit) {
    // tolerate a value entered without the scheme (e.g. "www.example.com")
    const withScheme = /^https?:\/\//i.test(explicit) ? explicit : `https://${explicit}`
    try {
      return new URL(withScheme).origin
    } catch {
      console.error("Invalid NEXT_PUBLIC_SITE_URL, falling back:", explicit)
    }
  }
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL
  if (vercel) return `https://${vercel}`
  return "http://localhost:3000"
}

export const siteUrl = resolveSiteUrl()

export const siteConfig = {
  name: "JayArts Multimedia",
  description:
    "Photography, videography, graphic design and live streaming in Lilongwe, Malawi. Graduation portraits, events, brand shoots and more by JayArts Multimedia.",
  email: "jayartsmultimedia@gmail.com",
  phone: "+265884849879",
  locality: "Lilongwe",
  country: "MW",
  ogImage: "/og-image.jpg",
  social: {
    instagram: "https://www.instagram.com/jayartsmultimedia/",
    facebook: "https://www.facebook.com/share/14Sc9c7Ddb2/",
  },
}
