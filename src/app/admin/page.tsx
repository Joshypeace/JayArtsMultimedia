"use client"

import { motion } from "framer-motion"
import { BookOpen, MessageSquare, Calendar, ImageIcon } from "lucide-react"

const stats = [
  { label: "Total Bookings", value: "24", icon: Calendar, color: "from-primary" },
  { label: "Portfolio Items", value: "36", icon: ImageIcon, color: "from-secondary" },
  { label: "Blog Posts", value: "12", icon: BookOpen, color: "from-primary" },
  { label: "Inquiries", value: "18", icon: MessageSquare, color: "from-secondary" },
]

const recentBookings = [
  { id: 1, client: "Sarah Johnson", service: "Photography", date: "Dec 5, 2024", status: "Pending" },
  { id: 2, client: "Mike Chen", service: "Videography", date: "Dec 3, 2024", status: "Confirmed" },
  { id: 3, client: "Emma Davis", service: "Design", date: "Dec 1, 2024", status: "Completed" },
]

export default function AdminDashboard() {
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
        <p className="text-foreground/60">Welcome back! Here's your business overview.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-effect border border-border rounded-xl p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-foreground/60 text-sm mb-2">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} to-primary/20 flex items-center justify-center`}
                >
                  <Icon className="w-6 h-6 text-primary" />
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-effect border border-border rounded-xl p-6"
      >
        <h2 className="text-xl font-bold mb-6">Recent Bookings</h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground/60">Client</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground/60">Service</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground/60">Date</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground/60">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((booking) => (
                <tr key={booking.id} className="border-b border-border/50 hover:bg-primary/5 transition-colors">
                  <td className="py-4 px-4 font-medium">{booking.client}</td>
                  <td className="py-4 px-4 text-foreground/70">{booking.service}</td>
                  <td className="py-4 px-4 text-foreground/70 text-sm">{booking.date}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        booking.status === "Pending"
                          ? "bg-yellow-500/10 text-yellow-400"
                          : booking.status === "Confirmed"
                            ? "bg-blue-500/10 text-blue-400"
                            : "bg-green-500/10 text-green-400"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
