import type { MetadataRoute } from "next"
import { prisma } from "@/lib/prisma"
import { siteUrl } from "@/lib/site"

// Rebuild hourly so new blog posts and portfolio items appear without a redeploy.
export const revalidate = 3600

const staticRoutes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/services", priority: 0.9, changeFrequency: "monthly" },
  { path: "/portfolio", priority: 0.9, changeFrequency: "weekly" },
  { path: "/about", priority: 0.7, changeFrequency: "monthly" },
  { path: "/booking", priority: 0.8, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.7, changeFrequency: "yearly" },
  { path: "/blog", priority: 0.6, changeFrequency: "weekly" },
  { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.2, changeFrequency: "yearly" },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  const entries: MetadataRoute.Sitemap = staticRoutes.map((r) => ({
    url: `${siteUrl}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }))

  // Dynamic pages are a bonus: never fail the sitemap if the database is unreachable.
  try {
    const [posts, items] = await Promise.all([
      prisma.blogPost.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
      prisma.portfolioItem.findMany({
        where: { publishedAt: { not: null, lte: new Date() } },
        select: { slug: true, updatedAt: true } }),
    ])
    for (const p of posts) entries.push({ url: `${siteUrl}/blog/${p.slug}`, lastModified: p.updatedAt, priority: 0.5 })
    for (const i of items) entries.push({ url: `${siteUrl}/portfolio/${i.slug}`, lastModified: i.updatedAt, priority: 0.6 })
  } catch (err) {
    console.error("sitemap: skipping dynamic routes", err)
  }
  return entries
}
