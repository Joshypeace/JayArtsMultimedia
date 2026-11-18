import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Us",
  description: "Meet the JayArts Multimedia team in Lilongwe, Malawi: photographers, videographers and creatives telling your story with cinematic quality.",
  alternates: { canonical: "/about" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
