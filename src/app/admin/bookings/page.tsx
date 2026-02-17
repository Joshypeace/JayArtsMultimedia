"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Eye, Trash2, Mail, Phone, Calendar, DollarSign, Filter, Download } from "lucide-react"

interface Booking {
  id: string
  eventType: string
  eventDate: string
  startTime: string | null
  venue: string | null
  clientName: string
  clientEmail: string
  clientPhone: string | null
  company: string | null
  budget: number | null
  budgetRange: string | null
  status: string
  additionalNotes: string | null
  createdAt: string
  service: {
    name: string
    category: string
  } | null
}

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-500/10 text-yellow-500",
  CONFIRMED: "bg-blue-500/10 text-blue-500",
  IN_PROGRESS: "bg-purple-500/10 text-purple-500",
  COMPLETED: "bg-green-500/10 text-green-500",
  CANCELLED: "bg-red-500/10 text-red-500",
  RESCHEDULED: "bg-orange-500/10 text-orange-500"
}

const statusLabels: Record<string, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  RESCHEDULED: "Rescheduled"
}

export default function ManageBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("ALL")
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  const statusOptions = ["ALL", "PENDING", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (selectedStatus !== "ALL") params.append('status', selectedStatus)
      
      const response = await fetch(`/api/admin/bookings?${params}`)
      if (!response.ok) throw new Error("Failed to fetch bookings")
      const data = await response.json()
      setBookings(data.bookings)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load bookings")
    } finally {
      setLoading(false)
    }
  }, [selectedStatus])

  useEffect(() => {
    fetchBookings()
  }, [fetchBookings, selectedStatus])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking)
    setShowDetails(true)
  }

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/bookings/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (!response.ok) throw new Error("Failed to update status")
      
      // Refresh bookings
      fetchBookings()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this booking?")) return

    try {
      const response = await fetch(`/api/admin/bookings/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error("Failed to delete booking")
      
      setBookings(prev => prev.filter(booking => booking.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete booking")
    }
  }

  const exportBookings = () => {
    const csv = bookings.map(booking => ({
      ID: booking.id,
      Client: booking.clientName,
      Email: booking.clientEmail,
      Phone: booking.clientPhone,
      Service: booking.eventType,
      Date: formatDate(booking.eventDate),
      Time: booking.startTime,
      Venue: booking.venue,
      Budget: booking.budget || booking.budgetRange,
      Status: booking.status,
      'Created At': formatDateTime(booking.createdAt)
    }))

    // Convert to CSV string
    const headers = Object.keys(csv[0]).join(',')
    const rows = csv.map(row => Object.values(row).map(val => `"${val}"`).join(','))
    const csvString = [headers, ...rows].join('\n')

    // Download
    const blob = new Blob([csvString], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `bookings-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-foreground/60">Loading bookings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">Booking Management</h1>
            <p className="text-foreground/60">Manage client bookings and appointments ({bookings.length} bookings)</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={exportBookings}
              className="flex items-center gap-2 px-4 py-2 border border-border text-foreground rounded-lg hover:border-primary"
            >
              <Download size={20} />
              Export CSV
            </button>
          </div>
        </div>
      </motion.div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-xl p-6"
      >
        <div className="flex items-center gap-4 mb-4">
          <Filter size={20} className="text-foreground/60" />
          <h3 className="font-medium">Filter Bookings</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {statusOptions.map(status => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedStatus === status
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-foreground/70 hover:border-primary hover:text-primary"
              }`}
            >
              {status === "ALL" ? "All" : statusLabels[status]}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Bookings Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card border border-border rounded-xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-background/50">
                <th className="text-left py-4 px-6 font-semibold">Client</th>
                <th className="text-left py-4 px-6 font-semibold">Service</th>
                <th className="text-left py-4 px-6 font-semibold">Event Date</th>
                <th className="text-left py-4 px-6 font-semibold">Budget</th>
                <th className="text-left py-4 px-6 font-semibold">Status</th>
                <th className="text-left py-4 px-6 font-semibold">Created</th>
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
                  <td className="py-4 px-6">
                    <div className="font-medium">{booking.clientName}</div>
                    <div className="text-sm text-foreground/60 flex items-center gap-1">
                      <Mail size={12} />
                      {booking.clientEmail}
                    </div>
                    {booking.clientPhone && (
                      <div className="text-sm text-foreground/60 flex items-center gap-1">
                        <Phone size={12} />
                        {booking.clientPhone}
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-medium">{booking.eventType}</div>
                    {booking.service && (
                      <div className="text-sm text-foreground/60">{booking.service.category}</div>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} className="text-foreground/60" />
                      <span>{formatDate(booking.eventDate)}</span>
                    </div>
                    {booking.startTime && (
                      <div className="text-sm text-foreground/60">{booking.startTime}</div>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    {booking.budget ? (
                      <div className="flex items-center gap-1">
                        <DollarSign size={14} className="text-foreground/60" />
                        <span>MWK {booking.budget.toLocaleString()}</span>
                      </div>
                    ) : booking.budgetRange ? (
                      <div className="text-sm text-foreground/70">{booking.budgetRange}</div>
                    ) : (
                      <div className="text-sm text-foreground/50">Not specified</div>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <select
                      value={booking.status}
                      onChange={(e) => handleUpdateStatus(booking.id, e.target.value)}
                      className={`px-3 py-1 text-xs font-semibold rounded-full border-0 focus:ring-0 focus:outline-none ${statusColors[booking.status]}`}
                    >
                      {Object.entries(statusLabels).map(([value, label]) => (
                        <option key={value} value={value} className="bg-background text-foreground">
                          {label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-4 px-6 text-sm text-foreground/70">
                    {formatDateTime(booking.createdAt)}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2">
                      <button 
                        className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
                        onClick={() => handleViewDetails(booking)}
                        title="View Details"
                      >
                        <Eye size={18} className="text-foreground/60" />
                      </button>
                      <button 
                        className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
                        onClick={() => window.open(`mailto:${booking.clientEmail}`)}
                        title="Email Client"
                      >
                        <Mail size={18} className="text-foreground/60" />
                      </button>
                      <button 
                        className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                        onClick={() => handleDelete(booking.id)}
                        title="Delete"
                      >
                        <Trash2 size={18} className="text-red-400" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {bookings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-foreground/60">No bookings found</p>
            <p className="text-foreground/40 text-sm mt-2">
              {selectedStatus !== "ALL" 
                ? `No ${statusLabels[selectedStatus]?.toLowerCase()} bookings` 
                : "When clients book, they'll appear here"}
            </p>
          </div>
        )}
      </motion.div>

      {/* Booking Details Modal */}
      {showDetails && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-background border border-border rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Booking Details</h2>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusColors[selectedBooking.status]}`}>
                    {statusLabels[selectedBooking.status]}
                  </div>
                </div>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-foreground/60 hover:text-foreground"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* Client Info */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-primary">Client Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-foreground/60">Name</p>
                      <p className="font-medium">{selectedBooking.clientName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-foreground/60">Email</p>
                      <p className="font-medium">{selectedBooking.clientEmail}</p>
                    </div>
                    <div>
                      <p className="text-sm text-foreground/60">Phone</p>
                      <p className="font-medium">{selectedBooking.clientPhone || "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-foreground/60">Company</p>
                      <p className="font-medium">{selectedBooking.company || "Not provided"}</p>
                    </div>
                  </div>
                </div>

                {/* Event Details */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-primary">Event Details</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-foreground/60">Service</p>
                      <p className="font-medium">{selectedBooking.eventType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-foreground/60">Date</p>
                      <p className="font-medium">{formatDate(selectedBooking.eventDate)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-foreground/60">Time</p>
                      <p className="font-medium">{selectedBooking.startTime || "Not specified"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-foreground/60">Venue</p>
                      <p className="font-medium">{selectedBooking.venue || "Not specified"}</p>
                    </div>
                  </div>
                </div>

                {/* Budget */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-primary">Budget</h3>
                  <div className="flex items-center gap-2">
                    <DollarSign size={20} className="text-primary" />
                    <span className="text-2xl font-bold text-primary">
                      {selectedBooking.budget 
                        ? `MWK ${selectedBooking.budget.toLocaleString()}`
                        : selectedBooking.budgetRange || "Not specified"
                      }
                    </span>
                  </div>
                </div>

                {/* Additional Notes */}
                {selectedBooking.additionalNotes && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-primary">Additional Notes</h3>
                    <div className="bg-input/50 border border-border rounded-lg p-4">
                      <p className="whitespace-pre-wrap">{selectedBooking.additionalNotes}</p>
                    </div>
                  </div>
                )}

                {/* Timeline */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-primary">Timeline</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-foreground/60">Booking Created</span>
                      <span className="text-sm font-medium">{formatDateTime(selectedBooking.createdAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-foreground/60">Event Date</span>
                      <span className="text-sm font-medium">{formatDate(selectedBooking.eventDate)}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-6 border-t border-border">
                  <button
                    onClick={() => window.open(`mailto:${selectedBooking.clientEmail}`)}
                    className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-opacity-90"
                  >
                    Email Client
                  </button>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="flex-1 py-2 border border-border text-foreground rounded-lg hover:border-primary"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}