import Link from "next/link"
import PublicNavBar from "@/components/public/navbar"
import Footer from "@/components/public/footer"

export const metadata = {
  title: "Page Not Found",
  robots: { index: false },
}

export default function NotFound() {
  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col">
      <PublicNavBar />
      <main className="flex flex-1 items-center justify-center px-4 pt-28 pb-20 text-center">
        <div className="max-w-md">
          <p className="text-7xl font-bold text-primary">404</p>
          <h1 className="mt-4 text-2xl font-semibold">This page is out of frame</h1>
          <p className="mt-3 text-foreground/60">
            The page you&apos;re looking for doesn&apos;t exist or has moved.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className="rounded-lg bg-primary px-5 py-2.5 font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Back to home
            </Link>
            <Link
              href="/portfolio"
              className="rounded-lg border border-border px-5 py-2.5 font-medium transition-colors hover:border-primary hover:text-primary"
            >
              View our work
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
