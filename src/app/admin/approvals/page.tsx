"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Mail,
  User,
  AlertCircle,
  Search,
  Filter
} from "lucide-react"
import Link from "next/link"

interface PendingUser {
  id: string
  name: string
  email: string
  role: string
  status: "PENDING" | "ACTIVE" | "REJECTED" | "SUSPENDED"
  createdAt: string
}

export default function ApprovalsPage() {
  const [users, setUsers] = useState<PendingUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "ACTIVE" | "REJECTED">("PENDING")
  const [searchTerm, setSearchTerm] = useState("")

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filter !== "ALL") params.append('status', filter)
      
      const response = await fetch(`/api/admin/users/approvals?${params}`)
      const data = await response.json()
      
      if (data.success) {
        setUsers(data.data)
      } else {
        setError(data.error)
      }
    } catch{
      setError("Failed to load users")
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleApprove = async (userId: string) => {
    setProcessingId(userId)
    try {
      const response = await fetch(`/api/admin/users/${userId}/approve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: "ACTIVE" })
      })

      const data = await response.json()
      
      if (data.success) {
        // Update local state
        setUsers(prev => prev.filter(u => u.id !== userId))
        // Refresh or show success
      } else {
        setError(data.error)
      }
    } catch {
      setError("Failed to approve user")
    } finally {
      setProcessingId(null)
    }
  }

  const handleReject = async (userId: string) => {
    setProcessingId(userId)
    try {
      const response = await fetch(`/api/admin/users/${userId}/approve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: "REJECTED" })
      })

      const data = await response.json()
      
      if (data.success) {
        setUsers(prev => prev.filter(u => u.id !== userId))
      } else {
        setError(data.error)
      }
    } catch {
      setError("Failed to reject user")
    } finally {
      setProcessingId(null)
    }
  }

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const stats = {
    pending: users.filter(u => u.status === "PENDING").length,
    active: users.filter(u => u.status === "ACTIVE").length,
    rejected: users.filter(u => u.status === "REJECTED").length
  }

  if (loading) {
    return (
      <div className="p-4 sm:p-6 md:p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-foreground/60">Loading approvals...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">Account Approvals</h1>
        <p className="text-foreground/60 text-sm sm:text-base">Review and manage pending user registrations</p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4"
      >
        <div className="bg-card border border-border rounded-lg sm:rounded-xl p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-foreground/60 mb-1">Pending</p>
              <p className="text-xl sm:text-2xl md:text-3xl font-bold text-yellow-500">{stats.pending}</p>
            </div>
            <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500/40" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg sm:rounded-xl p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-foreground/60 mb-1">Approved</p>
              <p className="text-xl sm:text-2xl md:text-3xl font-bold text-green-500">{stats.active}</p>
            </div>
            <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-500/40" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg sm:rounded-xl p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-foreground/60 mb-1">Rejected</p>
              <p className="text-xl sm:text-2xl md:text-3xl font-bold text-red-500">{stats.rejected}</p>
            </div>
            <XCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-500/40" />
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-xl p-4 sm:p-6 space-y-4"
      >
        <div className="flex items-center gap-2 sm:hidden">
          <Filter size={18} className="text-foreground/60" />
          <h3 className="font-medium text-sm">Filter Approvals</h3>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute right-1 top-1/2 transform -translate-y-1/2 text-foreground/40" size={16} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 sm:pl-10 pr-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:border-primary text-sm sm:text-base"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter("PENDING")}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors text-xs sm:text-sm flex-1 sm:flex-none ${
                filter === "PENDING" 
                  ? "bg-primary text-primary-foreground" 
                  : "border border-border hover:border-primary"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter("ACTIVE")}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors text-xs sm:text-sm flex-1 sm:flex-none ${
                filter === "ACTIVE" 
                  ? "bg-primary text-primary-foreground" 
                  : "border border-border hover:border-primary"
              }`}
            >
              Approved
            </button>
            <button
              onClick={() => setFilter("REJECTED")}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors text-xs sm:text-sm flex-1 sm:flex-none ${
                filter === "REJECTED" 
                  ? "bg-primary text-primary-foreground" 
                  : "border border-border hover:border-primary"
              }`}
            >
              Rejected
            </button>
            <button
              onClick={() => setFilter("ALL")}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors text-xs sm:text-sm flex-1 sm:flex-none ${
                filter === "ALL" 
                  ? "bg-primary text-primary-foreground" 
                  : "border border-border hover:border-primary"
              }`}
            >
              All
            </button>
          </div>
        </div>
      </motion.div>

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

      {/* Users List - Responsive Cards for Mobile, Table for Desktop */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-xl overflow-hidden"
      >
        {/* Mobile View - Cards (hidden on md and up) */}
        <div className="block md:hidden p-4 space-y-4">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-foreground/40 mx-auto mb-3" />
              <p className="text-foreground/60 text-sm">No users found</p>
              <p className="text-foreground/40 text-xs mt-2">
                {filter === "PENDING" 
                  ? "No pending approvals at the moment" 
                  : "Try adjusting your filters"}
              </p>
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div key={user.id} className="bg-primary/5 rounded-lg p-4 space-y-3 border border-border/50">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <User size={18} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{user.name}</p>
                      <p className="text-xs text-foreground/60 truncate">{user.email}</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                    {user.role}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    {user.status === "PENDING" && (
                      <span className="px-2 py-1 bg-yellow-500/10 text-yellow-500 rounded-full text-xs font-medium flex items-center gap-1 w-fit">
                        <Clock size={10} />
                        Pending
                      </span>
                    )}
                    {user.status === "ACTIVE" && (
                      <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded-full text-xs font-medium flex items-center gap-1 w-fit">
                        <CheckCircle size={10} />
                        Active
                      </span>
                    )}
                    {user.status === "REJECTED" && (
                      <span className="px-2 py-1 bg-red-500/10 text-red-500 rounded-full text-xs font-medium flex items-center gap-1 w-fit">
                        <XCircle size={10} />
                        Rejected
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-foreground/60">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {user.status === "PENDING" && (
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleApprove(user.id)}
                      disabled={processingId === user.id}
                      className="flex-1 py-2 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500/20 disabled:opacity-50 text-xs font-medium flex items-center justify-center gap-1"
                    >
                      {processingId === user.id ? (
                        <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <CheckCircle size={12} />
                          Approve
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleReject(user.id)}
                      disabled={processingId === user.id}
                      className="flex-1 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 disabled:opacity-50 text-xs font-medium flex items-center justify-center gap-1"
                    >
                      <XCircle size={12} />
                      Reject
                    </button>
                  </div>
                )}
                {user.status !== "PENDING" && (
                  <div className="pt-2">
                    <Link
                      href={`/admin/users/${user.id}`}
                      className="text-sm text-primary hover:underline block text-center"
                    >
                      View Details
                    </Link>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Desktop View - Table (hidden on mobile, shown on md and up) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full min-w-[800px] lg:min-w-0">
            <thead>
              <tr className="border-b border-border bg-background/50">
                <th className="text-left py-4 px-6 font-semibold text-sm">User</th>
                <th className="text-left py-4 px-6 font-semibold text-sm">Role</th>
                <th className="text-left py-4 px-6 font-semibold text-sm">Status</th>
                <th className="text-left py-4 px-6 font-semibold text-sm">Registered</th>
                <th className="text-left py-4 px-6 font-semibold text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-border/50 hover:bg-primary/5 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <User size={18} className="text-primary" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-sm truncate max-w-[200px]">{user.name}</div>
                        <div className="text-xs text-foreground/60 flex items-center gap-1">
                          <Mail size={10} className="flex-shrink-0" />
                          <span className="truncate max-w-[180px]">{user.email}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    {user.status === "PENDING" && (
                      <span className="px-3 py-1 bg-yellow-500/10 text-yellow-500 rounded-full text-xs font-medium flex items-center gap-1 w-fit">
                        <Clock size={12} />
                        Pending
                      </span>
                    )}
                    {user.status === "ACTIVE" && (
                      <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-xs font-medium flex items-center gap-1 w-fit">
                        <CheckCircle size={12} />
                        Active
                      </span>
                    )}
                    {user.status === "REJECTED" && (
                      <span className="px-3 py-1 bg-red-500/10 text-red-500 rounded-full text-xs font-medium flex items-center gap-1 w-fit">
                        <XCircle size={12} />
                        Rejected
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-sm text-foreground/70 whitespace-nowrap">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6">
                    {user.status === "PENDING" ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(user.id)}
                          disabled={processingId === user.id}
                          className="px-3 py-1 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500/20 disabled:opacity-50 text-xs font-medium flex items-center gap-1"
                        >
                          {processingId === user.id ? (
                            <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <>
                              <CheckCircle size={14} />
                              Approve
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleReject(user.id)}
                          disabled={processingId === user.id}
                          className="px-3 py-1 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 disabled:opacity-50 text-xs font-medium flex items-center gap-1"
                        >
                          <XCircle size={14} />
                          Reject
                        </button>
                      </div>
                    ) : (
                      <Link
                        href={`/admin/users/${user.id}`}
                        className="text-sm text-primary hover:underline"
                      >
                        View Details
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State for Desktop */}
        {filteredUsers.length === 0 && (
          <div className="hidden md:block text-center py-12">
            <AlertCircle className="w-12 h-12 text-foreground/40 mx-auto mb-4" />
            <p className="text-foreground/60">No users found</p>
            <p className="text-foreground/40 text-sm mt-2">
              {filter === "PENDING" 
                ? "No pending approvals at the moment" 
                : "Try adjusting your filters"}
            </p>
          </div>
        )}
      </motion.div>
    </div>
  )
}