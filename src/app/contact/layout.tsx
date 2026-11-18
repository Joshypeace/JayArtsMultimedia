import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with JayArts Multimedia in Lilongwe, Malawi for photography, videography, design and live streaming enquiries.",
  alternates: { canonical: "/contact" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
