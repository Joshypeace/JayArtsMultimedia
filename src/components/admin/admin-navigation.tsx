"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { 
  LogOut, 
  BarChart3, 
  BookOpen, 
  Calendar, 
  MessageSquare, 
  Settings, 
  Users, 
  Camera,
  Palette,
  Home,
  User,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { useState } from "react"
import { signOut } from "next-auth/react"
import { useSession } from "next-auth/react"

const navItems = [
  { label: "Dashboard", href: "/admin", icon: BarChart3 },
  { label: "Portfolio", href: "/admin/portfolio", icon: Camera },
  { label: "Blog", href: "/admin/blog", icon: BookOpen },
  { label: "Services", href: "/admin/services", icon: Palette },
  { label: "Bookings", href: "/admin/bookings", icon: Calendar },
  { label: "Inquiries", href: "/admin/inquiries", icon: MessageSquare },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Settings", href: "/admin/settings", icon: Settings },
]

export default function AdminNavigation() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(true)
  const { data: session } = useSession()

  const handleLogout = async () => {
    await signOut({ 
      callbackUrl: "/admin/login",
      redirect: true 
    })
  }

  return (
    <motion.aside
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      className={`bg-card border-r border-border transition-all duration-300 relative ${isOpen ? "w-64" : "w-20"}`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -right-3 top-6 bg-primary text-white rounded-full p-1.5 hover:bg-primary/90 transition-colors z-10"
      >
        {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>

      <div className="h-full flex flex-col p-6 space-y-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-yellow-500 rounded-full flex items-center justify-center">
            <Camera size={18} className="text-white" />
          </div>
          {isOpen && (
            <div>
              <span className="font-bold text-primary block leading-tight">JayArts</span>
              <span className="text-xs text-muted-foreground">Admin Panel</span>
            </div>
          )}
        </div>

        {/* User Info */}
        {session?.user && (
          <div className={`flex items-center gap-3 p-3 rounded-lg bg-primary/5 ${!isOpen && "justify-center"}`}>
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <User size={16} className="text-primary" />
            </div>
            {isOpen && (
              <div className="min-w-0">
                <p className="font-medium text-sm truncate">{session.user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>
                <span className="text-xs px-2 py-0.5 mt-1 rounded-full bg-primary/10 text-primary inline-block">
                  {session.user.role}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Nav Items */}
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all group ${
                  isActive
                    ? "bg-primary/20 text-primary border-l-4 border-primary"
                    : "text-foreground/70 hover:text-foreground hover:bg-primary/5"
                } ${!isOpen && "justify-center"}`}
              >
                <Icon 
                  size={20} 
                  className={`${isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary"}`} 
                />
                {isOpen && <span className="text-sm font-medium">{item.label}</span>}
                {!isOpen && isActive && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-primary text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {item.label}
                  </div>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer Actions */}
        <div className="space-y-4 border-t border-border pt-4">
          {isOpen && (
            <div className="space-y-1">
              <Link 
                href="/" 
                target="_blank"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Home size={16} />
                <span>View Website</span>
              </Link>
            </div>
          )}
          
          <button
            onClick={handleLogout}
            className={`flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors w-full ${
              !isOpen && "justify-center"
            }`}
          >
            <LogOut size={20} />
            {isOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </div>
    </motion.aside>
  )
}