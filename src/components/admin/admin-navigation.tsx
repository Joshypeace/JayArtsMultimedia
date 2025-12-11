"use client";

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
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
  ChevronRight,
  Menu,
  X
} from "lucide-react"
import { signOut } from "next-auth/react"
import { useSession } from "next-auth/react"
import type { UserRole } from "../../generated/prisma/client"

const navItems = [
  { label: "Dashboard", href: "/admin", icon: BarChart3, exact: true },
  { label: "Portfolio", href: "/admin/portfolio", icon: Camera, exact: false },
  { label: "Blog", href: "/admin/blog", icon: BookOpen, exact: false },
  { label: "Services", href: "/admin/services", icon: Palette, exact: false },
  { label: "Bookings", href: "/admin/bookings", icon: Calendar, exact: false },
  { label: "Inquiries", href: "/admin/inquiries", icon: MessageSquare, exact: false },
  { label: "Users", href: "/admin/users", icon: Users, exact: false },
  { label: "Settings", href: "/admin/settings", icon: Settings, exact: false },
]

interface AdminNavigationProps {
  user?: {
    id: string;
    name?: string | null;
    email?: string | null;
    role: UserRole;
    image?: string | null;
  };
}

interface SidebarContentProps {
  isCollapsed?: boolean;
  isMobile?: boolean;
  currentUser?: {
    id: string;
    name?: string | null;
    email?: string | null;
    role: UserRole;
    image?: string | null;
  };
  onItemClick?: () => void;
  isActive: (href: string, exact: boolean) => boolean;
  handleLogout: () => Promise<void>;
}

const SidebarContent = ({ 
  isCollapsed = false, 
  currentUser,
  onItemClick,
  isActive,
  handleLogout
}: SidebarContentProps) => (
  <div className="flex-1 flex flex-col p-6 overflow-y-auto">
    {/* Logo */}
    <div className="flex items-center gap-3 mb-6">
      <div className="w-8 h-8 bg-gradient-to-br from-primary to-yellow-500 rounded-full flex items-center justify-center">
        <Camera size={18} className="text-white" />
      </div>
      {!isCollapsed && (
        <div>
          <span className="font-bold text-primary block leading-tight">JayArts</span>
          <span className="text-xs text-muted-foreground">Admin Panel</span>
        </div>
      )}
    </div>

    {/* User Info */}
    {currentUser && (
      <div className={`flex items-center gap-3 p-3 rounded-lg bg-primary/5 mb-6 ${isCollapsed ? "justify-center" : ""}`}>
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
          {currentUser.image ? (
            <img 
              src={currentUser.image} 
              alt={currentUser.name || "User"} 
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <User size={16} className="text-primary" />
          )}
        </div>
        {!isCollapsed && (
          <div className="min-w-0">
            <p className="font-medium text-sm truncate">
              {currentUser.name || "User"}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {currentUser.email || "No email"}
            </p>
            <span className="text-xs px-2 py-0.5 mt-1 rounded-full bg-primary/10 text-primary inline-block">
              {currentUser.role}
            </span>
          </div>
        )}
      </div>
    )}

    {/* Nav Items */}
    <nav className="space-y-2">
      {navItems.map((item) => {
        const Icon = item.icon
        const active = isActive(item.href, item.exact)
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onItemClick}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all group relative ${
              active
                ? "bg-primary/20 text-primary border-l-4 border-primary"
                : "text-foreground/70 hover:text-foreground hover:bg-primary/5"
            } ${isCollapsed ? "justify-center" : ""}`}
          >
            <Icon 
              size={20} 
              className={`${active ? "text-primary" : "text-muted-foreground group-hover:text-primary"}`} 
            />
            {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
            {isCollapsed && !active && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-primary text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {item.label}
              </div>
            )}
          </Link>
        )
      })}
    </nav>

    {/* Sidebar Footer - View Website & Logout */}
    <div className="mt-auto pt-6 border-t border-border">
      <div className="space-y-2">
        <Link 
          href="/" 
          target="_blank"
          onClick={onItemClick}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-primary/5 transition-colors ${isCollapsed ? "justify-center" : ""}`}
        >
          <Home size={20} />
          {!isCollapsed && <span className="text-sm font-medium">View Website</span>}
          {isCollapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-primary text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              View Website
            </div>
          )}
        </Link>
        
        <button
          onClick={async () => {
            await handleLogout()
            onItemClick?.()
          }}
          className={`flex items-center gap-2 px-4 py-2.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors w-full ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <LogOut size={20} />
          {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </div>
  </div>
)

export default function AdminNavigation({ user: propUser }: AdminNavigationProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const { data: session } = useSession()
  const currentUser = propUser || session?.user

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      // Auto-close mobile menu on larger screens
      if (!mobile) {
        setMobileMenuOpen(false)
      }
    }
    
    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)
    
    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  const handleLogout = async () => {
    await signOut({ 
      callbackUrl: "/",
      redirect: true 
    })
  }

  // Function to check if a nav item is active
  const isActive = (href: string, exact: boolean) => {
    if (exact) {
      return pathname === href
    }
    return pathname?.startsWith(href)
  }

  const handleMobileItemClick = () => {
    if (isMobile) {
      setMobileMenuOpen(false)
    }
  }

  // Handle closing mobile menu when clicking outside (via the backdrop)
  const handleBackdropClick = () => {
    setMobileMenuOpen(false)
  }

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      {isMobile && (
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden fixed top-4 left-4 z-50 bg-primary text-white rounded-lg p-2 hover:bg-primary/90 transition-colors shadow-lg"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      )}

      {/* Desktop Sidebar */}
      {!isMobile && (
        <motion.aside
          initial={{ x: -280 }}
          animate={{ x: 0 }}
          className={`bg-card border-r border-border transition-all duration-300 relative flex flex-col ${isOpen ? "w-64" : "w-20"} h-screen sticky top-0`}
        >
          <SidebarContent 
            isCollapsed={!isOpen}
            currentUser={currentUser}
            isActive={isActive}
            handleLogout={handleLogout}
            onItemClick={undefined}
          />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="absolute -right-3 top-6 bg-primary text-white rounded-full p-1.5 hover:bg-primary/90 transition-colors z-10"
            aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </motion.aside>
      )}

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobile && mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleBackdropClick}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
            
            {/* Mobile Sidebar */}
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "tween", duration: 0.2 }}
              className="fixed left-0 top-0 h-screen w-64 bg-card border-r border-border z-50 flex flex-col shadow-xl"
            >
              <SidebarContent 
                isCollapsed={false}
                isMobile={isMobile}
                currentUser={currentUser}
                isActive={isActive}
                handleLogout={handleLogout}
                onItemClick={handleMobileItemClick}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}