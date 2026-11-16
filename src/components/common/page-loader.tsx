"use client"

import { useCallback, useEffect, useRef, useState } from "react"
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

// Internal tools navigate often and embed slow iframes: no full-screen loader there.
const isExcluded = (path: string) => path.startsWith("/admin") || path.startsWith("/business")

/**
 * Full-screen loading overlay with the JayArts logo (public site only).
 * - First load: rendered visible from the server so it covers the first paint, then
 *   hidden right after hydration (min ~450ms). A CSS-only fallback hides it after
 *   3.5s even if JS never runs (see .ja-page-loader[data-boot] in globals.css).
 * - Navigation: shown only for client-side <Link> navigations that take longer than
 *   ~180ms, and hidden as soon as the new route renders.
 */
export default function PageLoader() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(() => !isExcluded(pathname))
  const [boot, setBoot] = useState(true)
  const shownAt = useRef(0)
  const timers = useRef<{ show?: ReturnType<typeof setTimeout>; hide?: ReturnType<typeof setTimeout>; cap?: ReturnType<typeof setTimeout> }>({})
  const lastPath = useRef(pathname)

  const clearAll = useCallback(() => {
    const t = timers.current
    clearTimeout(t.show)
    clearTimeout(t.hide)
    clearTimeout(t.cap)
  }, [])
  const hide = useCallback(
    (minMs: number) => {
      clearAll()
      const wait = Math.max(0, minMs - (Date.now() - shownAt.current))
      timers.current.hide = setTimeout(() => setVisible(false), wait)
    },
    [clearAll]
  )

  // First load: hide right after hydration (not window "load", which waits for every image/iframe).
  useEffect(() => {
    shownAt.current = Date.now() - performance.now() // navigation start
    hide(450)
    const end = setTimeout(() => setBoot(false), 600)
    return () => {
      clearTimeout(end)
      clearAll()
    }
  }, [hide, clearAll])

  // Route rendered → hide.
  useEffect(() => {
    if (pathname === lastPath.current) return
    lastPath.current = pathname
    hide(300)
  }, [pathname, hide])

  // Client-side <Link> navigation started → show after a short delay (fast routes never flash).
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      // Bubble phase + defaultPrevented: Next <Link> prevents the default and routes on the client.
      // Plain <a> full-page loads are covered by the first-load overlay instead.
      if (!e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = (e.target as Element | null)?.closest?.("a")
      if (!a || typeof a.href !== "string" || !a.href || a.target === "_blank" || a.hasAttribute("download")) return
      const url = new URL(a.href, window.location.href)
      if (url.origin !== window.location.origin || url.pathname === window.location.pathname) return
      if (isExcluded(url.pathname) || isExcluded(window.location.pathname)) return
      const t = timers.current
      clearAll()
      t.show = setTimeout(() => {
        shownAt.current = Date.now()
        setVisible(true)
        t.cap = setTimeout(() => setVisible(false), 5000) // never block for long
      }, 180)
    }
    const onPop = () => hide(0)
    document.addEventListener("click", onClick)
    window.addEventListener("popstate", onPop)
    return () => {
      document.removeEventListener("click", onClick)
      window.removeEventListener("popstate", onPop)
    }
  }, [hide, clearAll])

  return (
    <div
      className={`ja-page-loader fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-background transition-[opacity,visibility] duration-500 motion-reduce:transition-none ${
        visible ? "opacity-100" : "pointer-events-none invisible opacity-0"
      }`}
      data-boot={boot && visible ? "" : undefined}
      role="status"
      aria-hidden={!visible}
    >
      <LoaderMark size={96} />
      <span className="ja-loader-text text-xs uppercase tracking-[0.4em] text-primary/80">JayArts Multimedia</span>
      <span className="sr-only">{visible ? "Loading" : ""}</span>
    </div>
  )
}
