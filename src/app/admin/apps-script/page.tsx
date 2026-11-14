import { redirect } from "next/navigation"

// The business system now has its own full page (no admin sidebar).
export default function AppsScriptRedirect() {
  redirect("/business")
}
