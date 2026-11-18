import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How JayArts Multimedia collects, uses and protects your personal information.",
  alternates: { canonical: "/privacy" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
