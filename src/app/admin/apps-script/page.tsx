import { ExternalLink, Info } from "lucide-react"

// The Google Apps Script web app shown in the admin area. Set APPS_SCRIPT_URL
// in the Vercel project settings (kept out of source because the repo is public).

export const metadata = {
  title: "Google App | Admin",
}

export default function AppsScriptPage() {
  const appUrl = process.env.APPS_SCRIPT_URL

  if (!appUrl) {
    return (
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Google App</h1>
        <p className="text-sm text-muted-foreground">
          Not configured. Add an <code>APPS_SCRIPT_URL</code> environment variable with your
          Apps Script web app&apos;s <code>/exec</code> URL, then redeploy.
        </p>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Google App</h1>
          <p className="text-sm text-muted-foreground">
            Your Google Apps Script tool, inside the admin panel.
          </p>
        </div>
        <a
          href={appUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-primary/5"
        >
          <ExternalLink size={16} />
          Open in new tab
        </a>
      </div>

      <div className="flex items-start gap-2 rounded-lg bg-primary/5 p-3 text-xs text-muted-foreground">
        <Info size={14} className="mt-0.5 flex-shrink-0 text-primary" />
        <span>
          If the frame below is blank or shows a Google sign-in error, use
          &ldquo;Open in new tab&rdquo;. Embedding requires you to be signed in to Google in this
          browser and the script to allow framing.
        </span>
      </div>

      <iframe
        src={appUrl}
        title="Google Apps Script app"
        className="min-h-[600px] w-full flex-1 rounded-lg border border-border bg-white"
        allow="clipboard-read; clipboard-write"
      />
    </div>
  )
}
