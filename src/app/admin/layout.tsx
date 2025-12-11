import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminNavigation from "@/components/admin/admin-navigation";

export default async function AdminLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/login");
  }
  
  // Only allow ADMIN and EDITOR roles
  const allowedRoles = ["ADMIN", "EDITOR"];
  if (!session.user.role || !allowedRoles.includes(session.user.role)) {
    redirect("/");
  }

  return (
    <div className="flex h-screen bg-background">
      <AdminNavigation user={session.user} />
      <main className="flex-1 overflow-auto p-6">{children}</main>
    </div>
  );
}