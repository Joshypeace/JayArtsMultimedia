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
  UserCheck,
  ChevronRight,
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
      <div className="p-4 sm:p-6 md:p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-foreground/60">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 md:p-8">
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold mb-2 text-red-400">Error Loading Dashboard</h2>
          <p className="text-foreground/70 text-sm sm:text-base">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm sm:text-base"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
     
      <div className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">Dashboard</h1>
          <p className="text-foreground/60 text-sm sm:text-base">Welcome back! Here&apos;s your business overview.</p>
        </motion.div>

        {/* Stats Grid - Responsive columns */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4">
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
                className="bg-card border border-border rounded-lg p-3 sm:p-4 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground/60 text-xs font-medium mb-1 truncate">{stat.label}</p>
                    <p className="text-lg sm:text-xl md:text-2xl font-bold truncate">{displayValue}</p>
                  </div>
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br ${stat.color} to-primary/20 flex items-center justify-center flex-shrink-0 ml-2`}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Recent Bookings - Mobile Optimized */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border rounded-xl p-4 sm:p-6"
        >
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold">Recent Bookings</h2>
            {recentBookings.length > 0 && (
              <a 
                href="/admin/bookings" 
                className="text-primary hover:underline text-xs sm:text-sm font-medium flex items-center gap-1"
              >
                <span className="hidden xs:inline">View All</span>
                <span className="xs:hidden">All</span>
                <ChevronRight className="w-4 h-4" />
              </a>
            )}
          </div>

          {recentBookings.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <Calendar className="w-10 h-10 sm:w-12 sm:h-12 text-foreground/20 mx-auto mb-3 sm:mb-4" />
              <p className="text-foreground/60 text-sm sm:text-base">No recent bookings</p>
              <p className="text-foreground/40 text-xs sm:text-sm mt-1 sm:mt-2">New bookings will appear here</p>
            </div>
          ) : (
            <>
              {/* Mobile Card View (hidden on larger screens) */}
              <div className="block md:hidden space-y-3">
                {recentBookings.map((booking) => (
                  <div
                    key={booking.id}
                    onClick={() => window.location.href = `/admin/bookings/${booking.id}`}
                    className="bg-primary/5 rounded-lg p-4 space-y-3 cursor-pointer hover:bg-primary/10 transition-colors border border-border/50"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{booking.clientName}</p>
                        <p className="text-xs text-foreground/60 truncate">{booking.clientEmail}</p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold border whitespace-nowrap ml-2 ${statusColors[booking.status]}`}
                      >
                        {statusLabels[booking.status]}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <p className="text-foreground/60">Service</p>
                        <p className="font-medium truncate">{getServiceDisplay(booking)}</p>
                      </div>
                      <div>
                        <p className="text-foreground/60">Date</p>
                        <p className="font-medium">{formatDate(booking.eventDate)}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-foreground/60">Budget</p>
                        <p className="font-medium">{formatCurrency(booking.budget)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tablet/Desktop Table View (hidden on mobile) */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full min-w-[600px] lg:min-w-0">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-xs sm:text-sm font-semibold text-foreground/60">Client</th>
                      <th className="text-left py-3 px-4 text-xs sm:text-sm font-semibold text-foreground/60">Service</th>
                      <th className="text-left py-3 px-4 text-xs sm:text-sm font-semibold text-foreground/60">Date</th>
                      <th className="text-left py-3 px-4 text-xs sm:text-sm font-semibold text-foreground/60">Budget</th>
                      <th className="text-left py-3 px-4 text-xs sm:text-sm font-semibold text-foreground/60">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings.map((booking) => (
                      <tr 
                        key={booking.id} 
                        className="border-b border-border/50 hover:bg-primary/5 transition-colors cursor-pointer"
                        onClick={() => window.location.href = `/admin/bookings/${booking.id}`}
                      >
                        <td className="py-3 sm:py-4 px-4">
                          <div>
                            <p className="font-medium text-sm">{booking.clientName}</p>
                            <p className="text-xs text-foreground/60 truncate max-w-[150px] lg:max-w-none">{booking.clientEmail}</p>
                          </div>
                        </td>
                        <td className="py-3 sm:py-4 px-4 text-foreground/70 text-xs sm:text-sm">
                          {getServiceDisplay(booking)}
                        </td>
                        <td className="py-3 sm:py-4 px-4 text-foreground/70 text-xs sm:text-sm whitespace-nowrap">
                          {formatDate(booking.eventDate)}
                        </td>
                        <td className="py-3 sm:py-4 px-4 text-foreground/70 font-medium text-xs sm:text-sm whitespace-nowrap">
                          {formatCurrency(booking.budget)}
                        </td>
                        <td className="py-3 sm:py-4 px-4">
                          <span
                            className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold border whitespace-nowrap ${statusColors[booking.status]}`}
                          >
                            {statusLabels[booking.status]}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  )
}