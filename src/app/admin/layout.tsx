"use client"

import AdminNavigation from "@/components/admin/admin-navigation"

export default function AdminLayout({ children }: { children: any }) {
  return (
    <div className="flex h-screen bg-background">
      <AdminNavigation />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
