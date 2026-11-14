import { ExternalLink, Info, RefreshCw } from "lucide-react"
import { auth } from "@/lib/auth"
import { buildAppsScriptEmbedUrl } from "@/lib/apps-script-embed"

// Each render signs a fresh single-use sign-in link, so never cache this page.
export const dynamic = "force-dynamic"

export const metadata = {
  title: "Google App | Admin",
}

export default async function AppsScriptPage() {
  const session = await auth()
  const embedUrl = session?.user?.email ? buildAppsScriptEmbedUrl(session.user.email) : null
  // Direct link (Google sign-in) for opening the app outside the admin.
  const directUrl = process.env.APPS_SCRIPT_URL

  if (!embedUrl) {
    return (
      <div className="space-y-3">
        <h1 className="text-2xl font-bold">Google App</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Not configured. Set <code>APPS_SCRIPT_EMBED_URL</code> and{" "}
          <code>APPS_SCRIPT_EMBED_SECRET</code> in the Vercel environment variables, then redeploy.
        </p>
        {directUrl && (
          <a
            href={directUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-primary/5"
          >
            <ExternalLink size={16} />
            Open with Google sign-in
          </a>
        )}
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Google App</h1>
          <p className="text-sm text-muted-foreground">
            Jay Arts business system, signed in with your website account.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href="/admin/apps-script"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-primary/5"
          >
            <RefreshCw size={16} />
            Reload
          </a>
          {directUrl && (
            <a
              href={directUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-primary/5"
            >
              <ExternalLink size={16} />
              Open in new tab
            </a>
          )}
        </div>
      </div>

      <div className="flex items-start gap-2 rounded-lg bg-primary/5 p-3 text-xs text-muted-foreground">
        <Info size={14} className="mt-0.5 flex-shrink-0 text-primary" />
        <span>
          Access uses your website login. Your email ({session?.user?.email}) must also be Active on
          the business system&apos;s Users sheet. If you see &ldquo;session expired&rdquo;, click Reload.
        </span>
      </div>

      <iframe
        src={embedUrl}
        title="Jay Arts business system"
        className="min-h-[600px] w-full flex-1 rounded-lg border border-border bg-background"
        allow="clipboard-read; clipboard-write"
        referrerPolicy="no-referrer"
      />
    </div>
  )
}
