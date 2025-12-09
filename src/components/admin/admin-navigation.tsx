"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { LogOut, BarChart3, FileText, BookOpen, Calendar, MessageSquare } from "lucide-react"
import { useState } from "react"

const navItems = [
  { label: "Dashboard", href: "/admin", icon: BarChart3 },
  { label: "Portfolio", href: "/admin/portfolio", icon: FileText },
  { label: "Blog", href: "/admin/blog", icon: BookOpen },
  { label: "Bookings", href: "/admin/bookings", icon: Calendar },
  { label: "Inquiries", href: "/admin/inquiries", icon: MessageSquare },
]

export default function AdminNavigation() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(true)

  return (
    <motion.aside
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      className={`bg-card border-r border-border transition-all ${isOpen ? "w-64" : "w-20"}`}
    >
      <div className="h-full flex flex-col p-6 space-y-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-full" />
          {isOpen && <span className="font-bold text-primary">JayArts</span>}
        </div>

        {/* Nav Items */}
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
                  isActive
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "text-foreground/70 hover:text-foreground hover:bg-primary/5"
                }`}
              >
                <Icon size={20} />
                {isOpen && <span className="text-sm font-medium">{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="space-y-4 border-t border-border pt-4">
          {isOpen && (
            <div className="text-xs">
              <p className="text-foreground/60">Admin Panel</p>
              <p className="font-semibold text-foreground">JayArts</p>
            </div>
          )}
          <button
            onClick={() => (window.location.href = "/admin/login")}
            className="w-full flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            {isOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </div>
    </motion.aside>
  )
}
