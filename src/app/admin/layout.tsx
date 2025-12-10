// app/admin/layout.tsx
import AdminNavigation from "@/components/admin/admin-navigation";

export default async function AdminLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <div className="flex h-screen bg-background">
      <AdminNavigation />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}