import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Blog",
  description: "Tips, stories and behind-the-scenes from JayArts Multimedia, a creative studio in Lilongwe, Malawi.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
