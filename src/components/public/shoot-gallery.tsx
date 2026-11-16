"use client"

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react"
import { createPortal } from "react-dom"
import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { galleryCategories, galleryPhotos, type GalleryPhoto } from "@/lib/gallery"

interface ShootGalleryProps {
  /** Show only the first N photos (no filter bar). */
  limit?: number
  /** Show category filter chips. */
  filterable?: boolean
}

const noopSubscribe = () => () => {}

/** Masonry gallery of real JayArts shoots with a keyboard/touch friendly lightbox. */
export default function ShootGallery({ limit, filterable = false }: ShootGalleryProps) {
  const [category, setCategory] = useState<string>("All")
  const [open, setOpen] = useState<number | null>(null)
  const closeBtn = useRef<HTMLButtonElement>(null)
  // false during SSR + hydration, true afterwards: portal only once <body> is ours
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false)
  const opener = useRef<HTMLElement | null>(null)

  const photos: GalleryPhoto[] = useMemo(() => {
    const list = category === "All" ? galleryPhotos : galleryPhotos.filter((p) => p.category === category)
    return limit ? list.slice(0, limit) : list
  }, [category, limit])

  const close = useCallback(() => setOpen(null), [])
  const step = useCallback(
    (d: number) => setOpen((i) => (i === null ? i : (i + d + photos.length) % photos.length)),
    [photos.length]
  )

  useEffect(() => {
    if (open === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
      if (e.key === "ArrowRight") step(1)
      if (e.key === "ArrowLeft") step(-1)
    }
    // lock scroll without a layout jump where the scrollbar was
    const prev = { overflow: document.body.style.overflow, pad: document.body.style.paddingRight }
    const sbw = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = "hidden"
    if (sbw > 0) document.body.style.paddingRight = `${sbw}px`
    window.addEventListener("keydown", onKey)
    closeBtn.current?.focus()
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = prev.overflow
      document.body.style.paddingRight = prev.pad
      opener.current?.focus()
    }
  }, [open, close, step])

  const current = open !== null ? photos[open] : null

  return (
    <div>
      {filterable && (
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {["All", ...galleryCategories].map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                category === c
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-foreground/70 hover:border-primary hover:text-primary"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      <div className="columns-2 gap-3 sm:gap-4 md:columns-3 lg:columns-4">
        {photos.map((p, i) => (
          <motion.button
            key={p.src}
            type="button"
            onClick={(e) => {
              opener.current = e.currentTarget
              setOpen(i)
            }}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: (i % 4) * 0.06 }}
            className="group relative mb-3 block w-full overflow-hidden rounded-xl border border-border/60 bg-card sm:mb-4 break-inside-avoid"
            aria-label={`Open photo: ${p.alt}`}
          >
            <Image
              src={p.src}
              alt={p.alt}
              width={p.width}
              height={p.height}
              sizes="(min-width:1152px) 280px, (min-width:1024px) 25vw, (min-width:768px) 33vw, 50vw"
              className="h-auto w-full transition-transform duration-700 group-hover:scale-105"
            />
            <div className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-black/0 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <span className="text-left text-xs font-medium text-primary sm:text-sm">{p.category}</span>
            </div>
          </motion.button>
        ))}
      </div>

      {mounted &&
        createPortal(
      // Portal to <body>: an ancestor stacking context (e.g. the home page's z-10 <main>)
      // would otherwise put the fixed navbar on top of the lightbox.
      <AnimatePresence>
        {current && (
          <motion.div
            className="fixed inset-0 z-[90] flex items-center justify-center bg-black/90 p-3 sm:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label={current.alt}
          >
            <motion.div
              key={current.src}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              className="relative h-full w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Image src={current.src} alt={current.alt} fill sizes="100vw" className="object-contain" />
            </motion.div>
            <button
              ref={closeBtn}
              onClick={close}
              className="absolute right-3 top-3 rounded-full bg-white/10 p-2 text-white hover:bg-primary hover:text-primary-foreground"
              aria-label="Close"
            >
              <X size={22} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                step(-1)
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-primary hover:text-primary-foreground sm:left-4"
              aria-label="Previous photo"
            >
              <ChevronLeft size={26} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                step(1)
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-primary hover:text-primary-foreground sm:right-4"
              aria-label="Next photo"
            >
              <ChevronRight size={26} />
            </button>
            <p className="absolute bottom-3 left-1/2 w-[90%] -translate-x-1/2 text-center text-xs text-white/70 sm:text-sm">
              {current.alt} · {open! + 1}/{photos.length}
            </p>
          </motion.div>
        )}
      </AnimatePresence>,
          document.body
        )}
    </div>
  )
}
