"use client"

import { useEffect } from "react"
import Link from "next/link"

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 text-center text-foreground">
      <div className="max-w-md">
        <p className="text-sm uppercase tracking-[0.3em] text-primary">Something went wrong</p>
        <h1 className="mt-4 text-2xl font-semibold">We couldn&apos;t load this page</h1>
        <p className="mt-3 text-foreground/60">Please try again. If it keeps happening, contact us and we&apos;ll sort it out.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={reset}
            className="rounded-lg bg-primary px-5 py-2.5 font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-lg border border-border px-5 py-2.5 font-medium transition-colors hover:border-primary hover:text-primary"
          >
            Back to home
          </Link>
        </div>
      </div>
    </main>
  )
}
