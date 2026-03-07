"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { 
  Mail, 
  Phone, 
  Calendar, 
  Filter, 
  Trash2, 
  Eye, 
  RefreshCw,
  MessageSquare,
  Send,
  User,
  Flag,
  X
} from "lucide-react"

interface Inquiry {
  id: string
  name: string
  email: string
  phone: string | null
  company: string | null
  subject: string
  message: string
  source: string
  status: 'NEW' | 'RESPONDED' | 'RESOLVED' | 'SPAM'
  assignedTo: {
    id: string
    name: string
    email: string
  } | null
  createdAt: string
  respondedAt: string | null
  response: string | null
}

interface StatsData {
  total: number
  today: number
  thisWeek: number
  averageResponseTime: number
  statusBreakdown: {
    NEW: number
    RESPONDED: number
    RESOLVED: number
    SPAM: number
  }
}

const statusColors: Record<string, string> = {
  NEW: "bg-blue-500/10 text-blue-500",
  RESPONDED: "bg-yellow-500/10 text-yellow-500",
  RESOLVED: "bg-green-500/10 text-green-500",
  SPAM: "bg-red-500/10 text-red-500"
}

const statusLabels: Record<string, string> = {
  NEW: "New",
  RESPONDED: "Responded",
  RESOLVED: "Resolved",
  SPAM: "Spam"
}

export default function ManageInquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL")
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [responseText, setResponseText] = useState("")
  const [stats, setStats] = useState<StatsData | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  const fetchInquiries = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (selectedStatus !== "ALL") params.append('status', selectedStatus)
      if (searchTerm) params.append('search', searchTerm)
      
      const response = await fetch(`/api/admin/inquiries?${params}`)
      const data = await response.json()
      
      if (data.success) {
        setInquiries(data.data.inquiries)
      } else {
        setError(data.error)
      }
    } catch {
      setError("Failed to load inquiries")
    } finally {
      setLoading(false)
    }
  }, [selectedStatus, searchTerm])

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/inquiries/stats')
      const data = await response.json()
      if (data.success) {
        setStats(data.data)
      }
    } catch (err) {
      console.error("Failed to load stats:", err)
    }
  }, [])

  useEffect(() => {
    fetchInquiries()
    fetchStats()
  }, [fetchInquiries, fetchStats])

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      
      const data = await response.json()
      if (data.success) {
        fetchInquiries()
        fetchStats()
      }
    } catch (err) {
      console.error("Failed to update status:", err)
    }
  }

  const handleSendResponse = async (id: string) => {
    if (!responseText.trim()) return

    try {
      const response = await fetch(`/api/admin/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          response: responseText,
          status: 'RESPONDED'
        })
      })
      
      const data = await response.json()
      if (data.success) {
        setResponseText("")
        setShowDetails(false)
        fetchInquiries()
        fetchStats()
      }
    } catch (err) {
      console.error("Failed to send response:", err)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this inquiry?")) return

    try {
      const response = await fetch(`/api/admin/inquiries/${id}`, {
        method: 'DELETE'
      })
      
      const data = await response.json()
      if (data.success) {
        fetchInquiries()
        fetchStats()
      }
    } catch (err) {
      console.error("Failed to delete inquiry:", err)
    }
  }

  const handleBulkAction = async (action: string) => {
    if (selectedIds.length === 0) return

    let confirmMessage = ""
    switch (action) {
      case 'mark_read':
        confirmMessage = `Mark ${selectedIds.length} inquiry as read?`
        break
      case 'mark_spam':
        confirmMessage = `Mark ${selectedIds.length} inquiry as spam?`
        break
      case 'delete':
        confirmMessage = `Delete ${selectedIds.length} inquiry permanently?`
        break
    }

    if (!confirm(confirmMessage)) return

    try {
      const response = await fetch('/api/admin/inquiries/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: action === 'mark_read' ? 'BULK_UPDATE_STATUS' :
                  action === 'mark_spam' ? 'MARK_AS_SPAM' :
                  'BULK_DELETE',
          data: {
            inquiryIds: selectedIds,
            status: action === 'mark_read' ? 'RESPONDED' : undefined
          }
        })
      })

      const data = await response.json()
      if (data.success) {
        setSelectedIds([])
        fetchInquiries()
        fetchStats()
      }
    } catch (err) {
      console.error("Bulk action failed:", err)
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === inquiries.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(inquiries.map(i => i.id))
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="p-4 sm:p-6 md:p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-foreground/60">Loading inquiries...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">Inquiries</h1>
            <p className="text-foreground/60 text-sm sm:text-base">Manage contact form submissions</p>
          </div>
          <button
            onClick={fetchInquiries}
            className="p-2 hover:bg-primary/10 rounded-lg transition-colors self-end sm:self-auto"
            title="Refresh"
          >
            <RefreshCw size={18} className="sm:w-5 sm:h-5" />
          </button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4"
        >
          <div className="bg-card border border-border rounded-lg sm:rounded-xl p-3 sm:p-6">
            <p className="text-xs sm:text-sm text-foreground/60 mb-1">Total</p>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold">{stats.total}</p>
          </div>
          <div className="bg-card border border-border rounded-lg sm:rounded-xl p-3 sm:p-6">
            <p className="text-xs sm:text-sm text-foreground/60 mb-1">New</p>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-500">{stats.statusBreakdown?.NEW || 0}</p>
          </div>
          <div className="bg-card border border-border rounded-lg sm:rounded-xl p-3 sm:p-6">
            <p className="text-xs sm:text-sm text-foreground/60 mb-1">Today</p>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold">{stats.today}</p>
          </div>
          <div className="bg-card border border-border rounded-lg sm:rounded-xl p-3 sm:p-6">
            <p className="text-xs sm:text-sm text-foreground/60 mb-1">This Week</p>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold">{stats.thisWeek}</p>
          </div>
          <div className="bg-card border border-border rounded-lg sm:rounded-xl p-3 sm:p-6 col-span-2 sm:col-span-1">
            <p className="text-xs sm:text-sm text-foreground/60 mb-1">Avg Response</p>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold">{stats.averageResponseTime}h</p>
          </div>
        </motion.div>
      )}

      {/* Error Message */}
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 sm:p-4"
        >
          <p className="text-red-400 text-sm sm:text-base">{error}</p>
        </motion.div>
      )}

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-xl p-4 sm:p-6 space-y-4"
      >
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-foreground/60 sm:w-5 sm:h-5" />
          <h3 className="font-medium text-sm sm:text-base">Filter Inquiries</h3>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name, email, subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:border-primary text-sm sm:text-base"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {["ALL", "NEW", "RESPONDED", "RESOLVED", "SPAM"].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-all text-xs sm:text-sm ${
                  selectedStatus === status
                    ? "bg-primary text-primary-foreground"
                    : "border border-border text-foreground/70 hover:border-primary hover:text-primary"
                }`}
              >
                {status === "ALL" ? "All" : statusLabels[status]}
              </button>
            ))}
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedIds.length > 0 && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 pt-4 border-t border-border">
            <span className="text-xs sm:text-sm text-foreground/60">
              {selectedIds.length} selected
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleBulkAction('mark_read')}
                className="px-2 sm:px-3 py-1 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500/20 text-xs sm:text-sm"
              >
                Mark as Read
              </button>
              <button
                onClick={() => handleBulkAction('mark_spam')}
                className="px-2 sm:px-3 py-1 bg-yellow-500/10 text-yellow-500 rounded-lg hover:bg-yellow-500/20 text-xs sm:text-sm"
              >
                Mark as Spam
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="px-2 sm:px-3 py-1 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 text-xs sm:text-sm"
              >
                Delete
              </button>
              <button
                onClick={() => setSelectedIds([])}
                className="px-2 sm:px-3 py-1 border border-border rounded-lg hover:border-primary text-xs sm:text-sm"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Inquiries List - Responsive Cards for Mobile, Table for Desktop */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-xl overflow-hidden"
      >
        {/* Mobile View - Cards (hidden on md and up) */}
        <div className="block md:hidden p-4 space-y-4">
          {inquiries.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-foreground/60">No inquiries found</p>
              <p className="text-foreground/40 text-sm mt-2">
                {selectedStatus !== "ALL" 
                  ? `No ${statusLabels[selectedStatus]?.toLowerCase()} inquiries`
                  : "When clients contact you, they'll appear here"}
              </p>
            </div>
          ) : (
            inquiries.map((inquiry) => (
              <div key={inquiry.id} className="bg-primary/5 rounded-lg p-4 space-y-3 border border-border/50">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(inquiry.id)}
                      onChange={() => toggleSelect(inquiry.id)}
                      className="mt-1 rounded border-border"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{inquiry.name}</h3>
                      {inquiry.company && (
                        <p className="text-xs text-foreground/60">{inquiry.company}</p>
                      )}
                    </div>
                  </div>
                  <select
                    value={inquiry.status}
                    onChange={(e) => handleUpdateStatus(inquiry.id, e.target.value)}
                    className={`px-2 py-1 text-xs font-semibold rounded-full border-0 focus:ring-0 ${
                      statusColors[inquiry.status]
                    }`}
                  >
                    <option value="NEW">New</option>
                    <option value="RESPONDED">Responded</option>
                    <option value="RESOLVED">Resolved</option>
                    <option value="SPAM">Spam</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs">
                    <Mail size={12} className="text-foreground/60" />
                    <a href={`mailto:${inquiry.email}`} className="hover:text-primary truncate flex-1">
                      {inquiry.email}
                    </a>
                  </div>
                  {inquiry.phone && (
                    <div className="flex items-center gap-2 text-xs">
                      <Phone size={12} className="text-foreground/60" />
                      <a href={`tel:${inquiry.phone}`} className="hover:text-primary">
                        {inquiry.phone}
                      </a>
                    </div>
                  )}
                </div>

                <div className="border-t border-border/50 pt-2">
                  <p className="font-medium text-xs mb-1">{inquiry.subject}</p>
                  <p className="text-xs text-foreground/60 line-clamp-2">{inquiry.message}</p>
                  <p className="text-xs text-foreground/40 mt-2 flex items-center gap-1">
                    <Calendar size={10} />
                    {formatDate(inquiry.createdAt)}
                  </p>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => {
                      setSelectedInquiry(inquiry)
                      setShowDetails(true)
                    }}
                    className="flex-1 flex items-center justify-center gap-1 p-2 hover:bg-primary/10 rounded-lg transition-colors text-xs"
                  >
                    <Eye size={14} />
                    View
                  </button>
                  <button
                    onClick={() => {
                      setSelectedInquiry(inquiry)
                      setResponseText("")
                      setShowDetails(true)
                    }}
                    className="flex-1 flex items-center justify-center gap-1 p-2 hover:bg-green-500/10 rounded-lg transition-colors text-xs"
                  >
                    <MessageSquare size={14} className="text-green-400" />
                    Respond
                  </button>
                  <button
                    onClick={() => handleDelete(inquiry.id)}
                    className="flex-1 flex items-center justify-center gap-1 p-2 hover:bg-red-500/10 rounded-lg transition-colors text-xs"
                  >
                    <Trash2 size={14} className="text-red-400" />
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop View - Table (hidden on mobile, shown on md and up) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full min-w-[900px] lg:min-w-0">
            <thead>
              <tr className="border-b border-border bg-background/50">
                <th className="py-4 px-6 w-12">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === inquiries.length && inquiries.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-border"
                  />
                </th>
                <th className="text-left py-4 px-6 font-semibold text-sm">Name</th>
                <th className="text-left py-4 px-6 font-semibold text-sm">Contact</th>
                <th className="text-left py-4 px-6 font-semibold text-sm">Subject</th>
                <th className="text-left py-4 px-6 font-semibold text-sm">Date</th>
                <th className="text-left py-4 px-6 font-semibold text-sm">Status</th>
                <th className="text-left py-4 px-6 font-semibold text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((inquiry, idx) => (
                <motion.tr
                  key={inquiry.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="border-b border-border/50 hover:bg-primary/5 transition-colors"
                >
                  <td className="py-4 px-6">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(inquiry.id)}
                      onChange={() => toggleSelect(inquiry.id)}
                      className="rounded border-border"
                    />
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-medium text-sm">{inquiry.name}</div>
                    {inquiry.company && (
                      <div className="text-xs text-foreground/60">{inquiry.company}</div>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-1 text-sm">
                      <Mail size={12} className="text-foreground/60 flex-shrink-0" />
                      <a href={`mailto:${inquiry.email}`} className="hover:text-primary text-sm truncate max-w-[150px]">
                        {inquiry.email}
                      </a>
                    </div>
                    {inquiry.phone && (
                      <div className="flex items-center gap-1 text-sm mt-1">
                        <Phone size={12} className="text-foreground/60 flex-shrink-0" />
                        <a href={`tel:${inquiry.phone}`} className="hover:text-primary text-sm">
                          {inquiry.phone}
                        </a>
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-medium text-sm line-clamp-1">{inquiry.subject}</div>
                    <div className="text-xs text-foreground/60 line-clamp-1 mt-1">
                      {inquiry.message.substring(0, 50)}...
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-foreground/70 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} className="flex-shrink-0" />
                      {formatDate(inquiry.createdAt)}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <select
                      value={inquiry.status}
                      onChange={(e) => handleUpdateStatus(inquiry.id, e.target.value)}
                      className={`px-3 py-1 text-xs font-semibold rounded-full border-0 focus:ring-0 ${
                        statusColors[inquiry.status]
                      }`}
                    >
                      <option value="NEW">New</option>
                      <option value="RESPONDED">Responded</option>
                      <option value="RESOLVED">Resolved</option>
                      <option value="SPAM">Spam</option>
                    </select>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedInquiry(inquiry)
                          setShowDetails(true)
                        }}
                        className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye size={18} className="text-foreground/60" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedInquiry(inquiry)
                          setResponseText("")
                          setShowDetails(true)
                        }}
                        className="p-2 hover:bg-green-500/10 rounded-lg transition-colors"
                        title="Respond"
                      >
                        <MessageSquare size={18} className="text-green-400" />
                      </button>
                      <button
                        onClick={() => handleDelete(inquiry.id)}
                        className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
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

        {/* Empty State for Desktop */}
        {inquiries.length === 0 && (
          <div className="hidden md:block text-center py-12">
            <p className="text-foreground/60">No inquiries found</p>
            <p className="text-foreground/40 text-sm mt-2">
              {selectedStatus !== "ALL" 
                ? `No ${statusLabels[selectedStatus]?.toLowerCase()} inquiries`
                : "When clients contact you, they'll appear here"}
            </p>
          </div>
        )}
      </motion.div>

      {/* Inquiry Details Modal - Responsive */}
      {showDetails && selectedInquiry && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-background border border-border rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-start mb-4 sm:mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold mb-2">Inquiry Details</h2>
                  <div className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${statusColors[selectedInquiry.status]}`}>
                    {statusLabels[selectedInquiry.status]}
                  </div>
                </div>
                <button
                  onClick={() => setShowDetails(false)}
                  className="p-1 text-foreground/60 hover:text-foreground"
                >
                  <X size={20} className="sm:w-6 sm:h-6" />
                </button>
              </div>

              <div className="space-y-4 sm:space-y-6">
                {/* Contact Info */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-primary">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <User size={16} className="text-foreground/60 flex-shrink-0 mt-0.5 sm:w-5 sm:h-5" />
                      <div>
                        <p className="text-xs sm:text-sm text-foreground/60">Name</p>
                        <p className="font-medium text-sm sm:text-base">{selectedInquiry.name}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Mail size={16} className="text-foreground/60 flex-shrink-0 mt-0.5 sm:w-5 sm:h-5" />
                      <div>
                        <p className="text-xs sm:text-sm text-foreground/60">Email</p>
                        <a href={`mailto:${selectedInquiry.email}`} className="font-medium text-sm sm:text-base hover:text-primary break-words">
                          {selectedInquiry.email}
                        </a>
                      </div>
                    </div>
                    {selectedInquiry.phone && (
                      <div className="flex items-start gap-3">
                        <Phone size={16} className="text-foreground/60 flex-shrink-0 mt-0.5 sm:w-5 sm:h-5" />
                        <div>
                          <p className="text-xs sm:text-sm text-foreground/60">Phone</p>
                          <a href={`tel:${selectedInquiry.phone}`} className="font-medium text-sm sm:text-base hover:text-primary">
                            {selectedInquiry.phone}
                          </a>
                        </div>
                      </div>
                    )}
                    {selectedInquiry.company && (
                      <div className="flex items-start gap-3">
                        <Flag size={16} className="text-foreground/60 flex-shrink-0 mt-0.5 sm:w-5 sm:h-5" />
                        <div>
                          <p className="text-xs sm:text-sm text-foreground/60">Company</p>
                          <p className="font-medium text-sm sm:text-base">{selectedInquiry.company}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-primary">Subject</h3>
                  <p className="font-medium text-sm sm:text-base mb-3 sm:mb-4">{selectedInquiry.subject}</p>
                  
                  <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-primary">Message</h3>
                  <div className="bg-input/50 border border-border rounded-lg p-3 sm:p-4 whitespace-pre-wrap text-sm sm:text-base">
                    {selectedInquiry.message}
                  </div>
                </div>

                {/* Response Section */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-primary">Response</h3>
                  {selectedInquiry.response ? (
                    <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
                      <p className="text-xs sm:text-sm text-foreground/60 mb-2">
                        Sent on {formatDate(selectedInquiry.respondedAt || "")}
                      </p>
                      <p className="whitespace-pre-wrap text-sm sm:text-base">{selectedInquiry.response}</p>
                    </div>
                  ) : (
                    <div className="space-y-3 sm:space-y-4">
                      <textarea
                        value={responseText}
                        onChange={(e) => setResponseText(e.target.value)}
                        placeholder="Type your response here..."
                        rows={5}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-input border border-border rounded-lg focus:outline-none focus:border-primary resize-none text-sm sm:text-base"
                      />
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={() => handleSendResponse(selectedInquiry.id)}
                          disabled={!responseText.trim()}
                          className="w-full sm:flex-1 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                        >
                          <Send size={16} className="inline mr-2" />
                          Send Response
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(selectedInquiry.id, 'SPAM')}
                          className="w-full sm:w-auto px-4 py-2 border border-red-500/20 text-red-400 rounded-lg hover:bg-red-500/10 text-sm sm:text-base"
                        >
                          Mark as Spam
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Timeline */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-primary">Timeline</h3>
                  <div className="space-y-2 text-xs sm:text-sm">
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <span className="text-foreground/60">Received</span>
                      <span className="font-medium">{formatDate(selectedInquiry.createdAt)}</span>
                    </div>
                    {selectedInquiry.respondedAt && (
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <span className="text-foreground/60">Responded</span>
                        <span className="font-medium">{formatDate(selectedInquiry.respondedAt)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}