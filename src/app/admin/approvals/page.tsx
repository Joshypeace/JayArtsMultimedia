"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Mail,
  User,
  AlertCircle,
  Search,
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

  useEffect(() => {
    fetchUsers()
  })

  const fetchUsers = async () => {
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
  }

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
      <div className="p-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold mb-2">Account Approvals</h1>
        <p className="text-foreground/60">Review and manage pending user registrations</p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-3 gap-4"
      >
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground/60 mb-1">Pending</p>
              <p className="text-3xl font-bold text-yellow-500">{stats.pending}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500/40" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground/60 mb-1">Approved</p>
              <p className="text-3xl font-bold text-green-500">{stats.active}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500/40" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground/60 mb-1">Rejected</p>
              <p className="text-3xl font-bold text-red-500">{stats.rejected}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-500/40" />
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-xl p-4"
      >
        <div className="flex gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/40" size={18} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:border-primary"
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("PENDING")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === "PENDING" 
                  ? "bg-primary text-primary-foreground" 
                  : "border border-border hover:border-primary"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter("ACTIVE")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === "ACTIVE" 
                  ? "bg-primary text-primary-foreground" 
                  : "border border-border hover:border-primary"
              }`}
            >
              Approved
            </button>
            <button
              onClick={() => setFilter("REJECTED")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === "REJECTED" 
                  ? "bg-primary text-primary-foreground" 
                  : "border border-border hover:border-primary"
              }`}
            >
              Rejected
            </button>
            <button
              onClick={() => setFilter("ALL")}
              className={`px-4 py-2 rounded-lg transition-colors ${
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
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-background/50">
                <th className="text-left py-4 px-6 font-semibold">User</th>
                <th className="text-left py-4 px-6 font-semibold">Role</th>
                <th className="text-left py-4 px-6 font-semibold">Status</th>
                <th className="text-left py-4 px-6 font-semibold">Registered</th>
                <th className="text-left py-4 px-6 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-border/50 hover:bg-primary/5">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User size={20} className="text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-foreground/60 flex items-center gap-1">
                          <Mail size={12} />
                          {user.email}
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
                  <td className="py-4 px-6 text-sm text-foreground/70">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6">
                    {user.status === "PENDING" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(user.id)}
                          disabled={processingId === user.id}
                          className="px-3 py-1 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500/20 disabled:opacity-50 text-sm font-medium flex items-center gap-1"
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
                          className="px-3 py-1 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 disabled:opacity-50 text-sm font-medium flex items-center gap-1"
                        >
                          <XCircle size={14} />
                          Reject
                        </button>
                      </div>
                    )}
                    {user.status !== "PENDING" && (
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

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
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