import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create a JayArts Multimedia account.",
  alternates: { canonical: "/register" },
  robots: { index: false, follow: false },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
