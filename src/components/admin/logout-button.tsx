"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const handleLogout = async () => {
    await signOut({ 
      callbackUrl: "/admin/login",
      redirect: true 
    });
  };

  return (
    <Button
      variant="ghost"
      onClick={handleLogout}
      className="w-full justify-start text-muted-foreground hover:text-foreground"
    >
      <LogOut className="mr-2 h-4 w-4" />
      Logout
    </Button>
  );
}