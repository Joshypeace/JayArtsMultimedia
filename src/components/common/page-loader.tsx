"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"

/** The JayArts logo filled with a moving gold shimmer, ringed by a spinning arc. */
export function LoaderMark({ size = 96 }: { size?: number }) {
  return (
    <div className="ja-loader-mark relative" style={{ width: size, height: size }} aria-hidden="true">
      <span className="ja-loader-ring absolute -inset-3 rounded-full" />
      <span className="ja-loader-logo absolute inset-0" />
    </div>
  )
}

/**
 * Full-screen loading overlay with the JayArts logo.
 * - Shows on the first load until the page has painted (min ~600ms so it doesn't flash).
 * - Shows when an internal link is clicked and hides once the new route has rendered.
 * Rendered visible from the server so it covers the very first paint.
 */
export default function PageLoader() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(true)
  const startedAt = useRef(0)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const safetyTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const firstPath = useRef(pathname)

  const hide = (minMs: number) => {
    const wait = Math.max(0, minMs - (Date.now() - startedAt.current))
    if (hideTimer.current) clearTimeout(hideTimer.current)
    hideTimer.current = setTimeout(() => setVisible(false), wait)
  }

  // Initial load.
  useEffect(() => {
    startedAt.current = Date.now() - performance.now() // navigation start
    const done = () => hide(600)
    if (document.readyState === "complete") done()
    else window.addEventListener("load", done, { once: true })
    const cap = setTimeout(() => setVisible(false), 4000) // never block the page
    return () => {
      window.removeEventListener("load", done)
      clearTimeout(cap)
    }
  }, [])

  // Route change finished → hide.
  useEffect(() => {
    if (pathname === firstPath.current) return
    firstPath.current = pathname
    hide(350)
  }, [pathname])

  // Internal link clicked → show.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      // Capture phase: Next <Link> calls preventDefault() on its own click, so check before it runs.
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = (e.target as HTMLElement | null)?.closest?.("a")
      if (!a || !a.href || a.target === "_blank" || a.hasAttribute("download")) return
      const url = new URL(a.href, window.location.href)
      if (url.origin !== window.location.origin) return
      if (url.pathname === window.location.pathname) return // same page / hash link
      startedAt.current = Date.now()
      if (hideTimer.current) clearTimeout(hideTimer.current)
      setVisible(true)
      if (safetyTimer.current) clearTimeout(safetyTimer.current)
      safetyTimer.current = setTimeout(() => setVisible(false), 8000)
    }
    document.addEventListener("click", onClick, true)
    return () => document.removeEventListener("click", onClick, true)
  }, [])

  return (
    <div
      className={`ja-page-loader fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-background transition-opacity duration-500 ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      role="status"
      aria-live="polite"
      aria-hidden={!visible}
    >
      <LoaderMark size={96} />
      <span className="ja-loader-text text-xs uppercase tracking-[0.4em] text-primary/80">JayArts Multimedia</span>
      <span className="sr-only">{visible ? "Loading" : ""}</span>
    </div>
  )
}
