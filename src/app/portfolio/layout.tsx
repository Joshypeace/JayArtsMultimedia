import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Recent photography and video work by JayArts Multimedia: graduation portraits, night shoots, editorial sessions and client projects.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
