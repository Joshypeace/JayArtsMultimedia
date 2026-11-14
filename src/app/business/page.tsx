import Link from "next/link"
import { redirect } from "next/navigation"
import { ArrowLeft, RefreshCw } from "lucide-react"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { buildAppsScriptEmbedUrl } from "@/lib/apps-script-embed"

// Full-page business system (Google Apps Script), outside the admin layout so only
// the app's own sidebar shows. Each render signs a fresh single-use pass: never cache.
export const dynamic = "force-dynamic"

export const metadata = {
  title: "Business System | JayArts Multimedia",
}

export default async function BusinessSystemPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login?callbackUrl=%2Fbusiness")

  // Re-check the database instead of trusting the (up to 30-day) JWT, and only let
  // ADMIN accounts in: website emails are not verified, and new registrations
  // become EDITOR, so editors must not be able to sign in as a sheet user.
  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { email: true, role: true, status: true },
  })
  const allowed = dbUser?.status === "ACTIVE" && dbUser.role === "ADMIN"
  const embedUrl = allowed ? buildAppsScriptEmbedUrl(dbUser.email) : null

  const bar = (
    <header className="flex h-11 shrink-0 items-center justify-between gap-3 border-b border-border bg-sidebar px-3 sm:px-4">
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 rounded-md px-2 py-1 text-sm text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
      >
        <ArrowLeft size={16} />
        <span>Back to admin</span>
      </Link>
      {embedUrl && (
        <a
          href="/business"
          title="Reload (use if you see 'session expired')"
          className="inline-flex items-center gap-2 rounded-md px-2 py-1 text-sm text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
        >
          <RefreshCw size={15} />
          <span className="hidden sm:inline">Reload</span>
        </a>
      )}
    </header>
  )

  if (!embedUrl) {
    return (
      <div className="flex h-dvh flex-col bg-background">
        {bar}
        <div className="flex flex-1 items-center justify-center p-6 text-center">
          <div className="max-w-md space-y-2">
            <h1 className="text-xl font-bold text-primary">Business System</h1>
            <p className="text-sm text-muted-foreground">
              {allowed ? (
                <>
                  Not configured. Set <code>APPS_SCRIPT_EMBED_URL</code> and{" "}
                  <code>APPS_SCRIPT_EMBED_SECRET</code> in the Vercel environment variables, then
                  redeploy.
                </>
              ) : (
                "The business system is available to active administrators only."
              )}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-dvh flex-col bg-background">
      {bar}
      <iframe
        key={embedUrl /* new pass => fresh frame, so back/forward never reuses a spent pass */}
        src={embedUrl}
        title="Jay Arts business system"
        className="w-full flex-1 border-0 bg-background"
        allow="clipboard-read; clipboard-write"
        referrerPolicy="no-referrer"
      />
    </div>
  )
}
