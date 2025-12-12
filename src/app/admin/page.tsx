"use client"

import { motion } from "framer-motion"
import { 
  BookOpen, 
  MessageSquare, 
  Calendar, 
  ImageIcon, 
  Users, 
  TrendingUp,
  Mail,
  Clock,
  UserCheck
} from "lucide-react"
import { useEffect, useState } from "react"
import { format } from "date-fns"

interface StatsData {
  totalBookings: number
  portfolioItems: number
  blogPosts: number
  inquiries: number
  totalUsers: number
  revenue: number
  subscribers: number
  pendingBookings: number
  teamMembers: number
}

interface Booking {
  id: string
  clientName: string
  clientEmail: string
  eventType: string
  eventDate: Date | string
  status: "PENDING" | "CONFIRMED" | "REJECTED" | "COMPLETED" | "CANCELLED"
  budget?: number | null
  createdAt: Date | string
  service?: {
    name: string
    category: string
  } | null
}

const statsConfig = [
  { 
    label: "Total Bookings", 
    key: "totalBookings",
    icon: Calendar, 
    color: "from-blue-500" 
  },
  { 
    label: "Pending Bookings", 
    key: "pendingBookings",
    icon: Clock, 
    color: "from-yellow-500" 
  },
  { 
    label: "Portfolio Items", 
    key: "portfolioItems",
    icon: ImageIcon, 
    color: "from-purple-500" 
  },
  { 
    label: "Blog Posts", 
    key: "blogPosts",
    icon: BookOpen, 
    color: "from-green-500" 
  },
  { 
    label: "New Inquiries", 
    key: "inquiries",
    icon: MessageSquare, 
    color: "from-red-500" 
  },
  { 
    label: "Total Users", 
    key: "totalUsers",
    icon: Users, 
    color: "from-indigo-500" 
  },
  { 
    label: "Revenue", 
    key: "revenue",
    icon: TrendingUp, 
    color: "from-emerald-500"
  },
  { 
    label: "Subscribers", 
    key: "subscribers",
    icon: Mail, 
    color: "from-pink-500" 
  },
  { 
    label: "Team Members", 
    key: "teamMembers",
    icon: UserCheck, 
    color: "from-orange-500" 
  },
]

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  CONFIRMED: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  REJECTED: "bg-red-500/10 text-red-400 border-red-500/20",
  COMPLETED: "bg-green-500/10 text-green-400 border-green-500/20",
  CANCELLED: "bg-gray-500/10 text-gray-400 border-gray-500/20",
}

const statusLabels: Record<string, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  REJECTED: "Rejected",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<StatsData>({
    totalBookings: 0,
    portfolioItems: 0,
    blogPosts: 0,
    inquiries: 0,
    totalUsers: 0,
    revenue: 0,
    subscribers: 0,
    pendingBookings: 0,
    teamMembers: 0
  })
  
  const [recentBookings, setRecentBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError("")

      const [statsResponse, bookingsResponse] = await Promise.all([
        fetch('/api/admin/dashboard/stats'),
        fetch('/api/admin/dashboard/recent-bookings?limit=5')
      ])

      if (!statsResponse.ok) {
        throw new Error("Failed to load dashboard stats")
      }

      const statsData = await statsResponse.json()
      setStats(statsData)

      if (!bookingsResponse.ok) {
        setRecentBookings([])
      } else {
        const bookingsData = await bookingsResponse.json()
        
        if (Array.isArray(bookingsData)) {
          setRecentBookings(bookingsData)
        } else {
          setRecentBookings([])
        }
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load dashboard"
      setError(errorMessage)
      
      setStats({
        totalBookings: 0,
        portfolioItems: 0,
        blogPosts: 0,
        inquiries: 0,
        totalUsers: 0,
        revenue: 0,
        subscribers: 0,
        pendingBookings: 0,
        teamMembers: 0
      })
      
      setRecentBookings([])
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateInput: Date | string): string => {
    if (!dateInput) return "N/A"
    
    try {
      const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
      return format(date, 'MMM d, yyyy')
    } catch {
      return "Invalid date"
    }
  }

  const formatCurrency = (amount: number | null | undefined): string => {
    if (!amount) return "MWK0"
    return `MWK${amount.toLocaleString()}`
  }

  const getServiceDisplay = (booking: Booking): string => {
    if (booking.service) {
      return `${booking.service.name}`
    }
    return booking.eventType
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-foreground/60">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-2 text-red-400">Error Loading Dashboard</h2>
          <p className="text-foreground/70">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
        <p className="text-foreground/60">Welcome back! Here&apos;s your business overview.</p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {statsConfig.map((stat, idx) => {
          const Icon = stat.icon
          const value = stats[stat.key as keyof StatsData]
          const displayValue = stat.key === "revenue" 
            ? `MK${value.toLocaleString()}` 
            : value.toString()

          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-foreground/60 text-xs font-medium mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold">{displayValue}</p>
                </div>
                <div
                  className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} to-primary/20 flex items-center justify-center flex-shrink-0 ml-2`}
                >
                  <Icon className="w-5 h-5 text-primary" />
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card border border-border rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Recent Bookings</h2>
          {recentBookings.length > 0 && (
            <a 
              href="/admin/bookings" 
              className="text-primary hover:underline text-sm font-medium flex items-center gap-1"
            >
              View All
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          )}
        </div>

        {recentBookings.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-foreground/20 mx-auto mb-4" />
            <p className="text-foreground/60">No recent bookings</p>
            <p className="text-foreground/40 text-sm mt-2">New bookings will appear here</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-foreground/60">Client</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-foreground/60">Service</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-foreground/60">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-foreground/60">Budget</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-foreground/60">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((booking) => (
                  <tr 
                    key={booking.id} 
                    className="border-b border-border/50 hover:bg-primary/5 transition-colors cursor-pointer"
                    onClick={() => window.location.href = `/admin/bookings/${booking.id}`}
                  >
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium">{booking.clientName}</p>
                        <p className="text-xs text-foreground/60">{booking.clientEmail}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-foreground/70 text-sm">
                      {getServiceDisplay(booking)}
                    </td>
                    <td className="py-4 px-4 text-foreground/70 text-sm">
                      {formatDate(booking.eventDate)}
                    </td>
                    <td className="py-4 px-4 text-foreground/70 font-medium">
                      {formatCurrency(booking.budget)}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[booking.status]}`}
                      >
                        {statusLabels[booking.status]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  )
}