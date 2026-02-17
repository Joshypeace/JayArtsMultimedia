"use client"

import { useState, useEffect, useCallback } from "react"
import { Calendar, Eye, Filter } from "lucide-react"

interface Booking {
  id: string
  eventType: string
  eventDate: string
  clientName: string
  clientEmail: string
  clientPhone: string | null
  status: string
  createdAt: string
}

interface Stats {
  total: number
  todayBookings: number
  counts: Record<string, number>
  upcomingEvents: number
}

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-500/10 text-yellow-500",
  CONFIRMED: "bg-blue-500/10 text-blue-500",
  IN_PROGRESS: "bg-purple-500/10 text-purple-500",
  COMPLETED: "bg-green-500/10 text-green-500",
  CANCELLED: "bg-red-500/10 text-red-500",
  RESCHEDULED: "bg-orange-500/10 text-orange-500"
}

export default function ManageBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState("ALL")
  const [stats, setStats] = useState<Stats | null>(null)

  const fetchBookings = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (selectedStatus !== "ALL") params.append('status', selectedStatus)
      
      const response = await fetch(`/api/admin/bookings?${params}`)
      const data = await response.json()
      setBookings(data.bookings)
    } catch (error) {
      console.error("Failed to fetch bookings:", error)
    } finally {
      setLoading(false)
    }
  }, [selectedStatus])

  useEffect(() => {
    fetchBookings()
    fetchStats()
  }, [fetchBookings, selectedStatus])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/bookings/stats')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error("Failed to fetch stats:", error)
    }
  }

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      
      if (response.ok) {
        fetchBookings()
        fetchStats()
      }
    } catch (error) {
      console.error("Failed to update status:", error)
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="p-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Booking Management</h1>
        <p className="text-foreground/60">View and manage client bookings</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-xl p-6">
            <p className="text-sm text-foreground/60">Total Bookings</p>
            <p className="text-3xl font-bold mt-2">{stats.total}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <p className="text-sm text-foreground/60">Today</p>
            <p className="text-3xl font-bold mt-2">{stats.todayBookings}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <p className="text-sm text-foreground/60">Pending</p>
            <p className="text-3xl font-bold mt-2 text-yellow-500">{stats.counts.PENDING}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <p className="text-sm text-foreground/60">Upcoming Events</p>
            <p className="text-3xl font-bold mt-2">{stats.upcomingEvents}</p>
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter size={18} className="text-foreground/60" />
          <span className="font-medium">Filter by Status</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {["ALL", "PENDING", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 rounded-lg text-sm ${
                selectedStatus === status
                  ? "bg-primary text-primary-foreground"
                  : "border border-border hover:border-primary"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-background/50">
                <th className="text-left py-4 px-6">Client</th>
                <th className="text-left py-4 px-6">Service</th>
                <th className="text-left py-4 px-6">Event Date</th>
                <th className="text-left py-4 px-6">Status</th>
                <th className="text-left py-4 px-6">Booked On</th>
                <th className="text-left py-4 px-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="border-b border-border/50 hover:bg-primary/5">
                  <td className="py-4 px-6">
                    <div className="font-medium">{booking.clientName}</div>
                    <div className="text-sm text-foreground/60">{booking.clientEmail}</div>
                  </td>
                  <td className="py-4 px-6">{booking.eventType}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      {formatDate(booking.eventDate)}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <select
                      value={booking.status}
                      onChange={(e) => updateStatus(booking.id, e.target.value)}
                      className={`px-3 py-1 text-xs font-semibold rounded-full border-0 ${statusColors[booking.status]}`}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="CONFIRMED">Confirmed</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </td>
                  <td className="py-4 px-6 text-sm text-foreground/60">
                    {formatDate(booking.createdAt)}
                  </td>
                  <td className="py-4 px-6">
                    <button className="p-2 hover:bg-primary/10 rounded-lg">
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {bookings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-foreground/60">No bookings found</p>
          </div>
        )}
      </div>
    </div>
  )
}