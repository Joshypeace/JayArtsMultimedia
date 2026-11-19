import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { BLOG_ENABLED } from "@/lib/features"

export const metadata: Metadata = {
  title: "Blog",
  description: "Tips, stories and behind-the-scenes from JayArts Multimedia, a creative studio in Lilongwe, Malawi.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  // While the blog is hidden, /blog and every /blog/<post> show the 404 page.
  if (!BLOG_ENABLED) notFound()
  return children
}
