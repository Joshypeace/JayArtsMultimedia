import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms and conditions for using JayArts Multimedia services and this website.",
  alternates: { canonical: "/terms" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
