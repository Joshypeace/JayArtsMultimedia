// Server-only: imported by the /admin/apps-script server component. Never import from client code.
import { createHmac, randomBytes } from "crypto"

/**
 * Builds a single-use, 2-minute sign-in link for the embedded Google Apps Script
 * business system. The Apps Script verifies the HMAC with the same shared secret
 * (Script Properties → SITE_EMBED_SECRET) and then checks the email against its
 * Users sheet, so the person must also be Active there.
 *
 * Env:
 *   APPS_SCRIPT_EMBED_URL     /exec URL of the "embed" deployment (anonymous access)
 *   APPS_SCRIPT_EMBED_SECRET  shared secret, at least 32 characters
 */
export function buildAppsScriptEmbedUrl(email: string): string | null {
  const base = process.env.APPS_SCRIPT_EMBED_URL
  const secret = process.env.APPS_SCRIPT_EMBED_SECRET
  if (!base || !secret || secret.length < 32 || !email) return null

  const payload = Buffer.from(
    JSON.stringify({
      email: email.trim().toLowerCase(),
      exp: Date.now() + 2 * 60 * 1000,
      jti: randomBytes(18).toString("base64url"),
    })
  ).toString("base64url")
  const signature = createHmac("sha256", secret).update(payload).digest("base64url")

  const url = new URL(base)
  url.searchParams.set("st", `${payload}.${signature}`)
  return url.toString()
}
