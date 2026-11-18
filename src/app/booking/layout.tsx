import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Book a Session",
  description: "Book a photography, videography or live streaming session with JayArts Multimedia in Lilongwe, Malawi.",
  alternates: { canonical: "/booking" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
