import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Services",
  description: "Photography, videography, graphic design and live streaming services in Lilongwe, Malawi. Packages for graduations, events, weddings and brands.",
  alternates: { canonical: "/services" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
