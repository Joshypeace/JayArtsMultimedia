import { LoaderMark } from "@/components/common/page-loader"

// Shown by Next.js while a route segment streams in (server data).
export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background">
      <LoaderMark size={88} />
      <span className="ja-loader-text text-xs uppercase tracking-[0.4em] text-primary/80">JayArts Multimedia</span>
    </div>
  )
}
