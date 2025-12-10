import { getCurrentUser } from "@/lib/auth-utils";
import AdminNavigation from "@/components/admin/admin-navigation";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div className="flex h-screen bg-background">
      <AdminNavigation/>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}