"use client"

import { motion } from "framer-motion"
import { Check, X, Clock } from "lucide-react"

const bookings = [
  {
    id: 1,
    client: "Sarah Johnson",
    service: "Photography",
    date: "Dec 5, 2024",
    budget: "$1,999",
    status: "Pending",
  },
  {
    id: 2,
    client: "Mike Chen",
    service: "Videography",
    date: "Dec 3, 2024",
    budget: "$4,999",
    status: "Confirmed",
  },
  {
    id: 3,
    client: "Emma Davis",
    service: "Design",
    date: "Dec 1, 2024",
    budget: "$2,499",
    status: "Completed",
  },
]

export default function ManageBookings() {
  return (
    <div className="p-8 space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div>
          <h1 className="text-4xl font-bold mb-2">Bookings</h1>
          <p className="text-foreground/60">Manage client bookings and inquiries</p>
        </div>
      </motion.div>

      {/* Bookings Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-effect border border-border rounded-xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-background/50">
                <th className="text-left py-4 px-6 font-semibold">Client</th>
                <th className="text-left py-4 px-6 font-semibold">Service</th>
                <th className="text-left py-4 px-6 font-semibold">Date</th>
                <th className="text-left py-4 px-6 font-semibold">Budget</th>
                <th className="text-left py-4 px-6 font-semibold">Status</th>
                <th className="text-left py-4 px-6 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, idx) => (
                <motion.tr
                  key={booking.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="border-b border-border/50 hover:bg-primary/5 transition-colors"
                >
                  <td className="py-4 px-6 font-medium">{booking.client}</td>
                  <td className="py-4 px-6 text-foreground/70">{booking.service}</td>
                  <td className="py-4 px-6 text-foreground/70 text-sm">{booking.date}</td>
                  <td className="py-4 px-6 font-semibold text-primary">{booking.budget}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
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
                  <td className="py-4 px-6">
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-green-500/10 rounded-lg transition-colors">
                        <Check size={18} className="text-green-400" />
                      </button>
                      <button className="p-2 hover:bg-red-500/10 rounded-lg transition-colors">
                        <X size={18} className="text-red-400" />
                      </button>
                      <button className="p-2 hover:bg-primary/10 rounded-lg transition-colors">
                        <Clock size={18} className="text-foreground/60" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
