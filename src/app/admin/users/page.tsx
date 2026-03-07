"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  Mail,
  Shield,
  Edit2,
  Trash2,
  Eye,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  UserCog,
  X
} from "lucide-react"
import Link from "next/link"

interface User {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'EDITOR' | 'VIEWER'
  image: string | null
  emailVerified: boolean
  lastLogin: string | null
  createdAt: string
  isActive: boolean
  _count: {
    blogPosts: number
    portfolioItems: number
    services: number
    bookings: number
    inquiries: number
  }
}

interface Stats {
  total: number
  byRole: {
    ADMIN: number
    EDITOR: number
    VIEWER: number
  }
  activeUsers: number
  verifiedUsers: number
}

interface NewUserForm {
  name: string
  email: string
  password: string
  role: string
}

const roleColors: Record<string, string> = {
  ADMIN: "bg-purple-500/10 text-purple-500",
  EDITOR: "bg-blue-500/10 text-blue-500",
  VIEWER: "bg-green-500/10 text-green-500"
}

const roleLabels: Record<string, string> = {
  ADMIN: "Admin",
  EDITOR: "Editor",
  VIEWER: "Viewer"
}

export default function ManageUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState<string>("ALL")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [stats, setStats] = useState<Stats | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [newUser, setNewUser] = useState<NewUserForm>({
    name: "",
    email: "",
    password: "",
    role: "VIEWER"
  })

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (selectedRole !== "ALL") params.append('role', selectedRole)
      if (selectedStatus !== "all") params.append('status', selectedStatus)
      if (searchTerm) params.append('search', searchTerm)
      
      const response = await fetch(`/api/admin/users?${params}`)
      const data = await response.json()
      
      if (data.success) {
        setUsers(data.data.users)
      } else {
        setError(data.error)
      }
    } catch {
      setError("Failed to load users")
    } finally {
      setLoading(false)
    }
  }, [selectedRole, selectedStatus, searchTerm])

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/users/stats')
      const data = await response.json()
      if (data.success) {
        setStats(data.data)
      }
    } catch (err) {
      console.error("Failed to load stats:", err)
    }
  }, [])

  useEffect(() => {
    fetchUsers()
    fetchStats()
  }, [fetchUsers, fetchStats])

  const handleCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      })

      const data = await response.json()
      if (data.success) {
        setShowAddModal(false)
        setNewUser({ name: "", email: "", password: "", role: "VIEWER" })
        fetchUsers()
        fetchStats()
      } else {
        setError(data.error)
      }
    } catch {
      setError("Failed to create user")
    }
  }

  const handleUpdateUser = async (id: string, updates: Partial<User>) => {
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })

      const data = await response.json()
      if (data.success) {
        setShowEditModal(false)
        setSelectedUser(null)
        fetchUsers()
        fetchStats()
      } else {
        setError(data.error)
      }
    } catch {
      setError("Failed to update user")
    }
  }

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return

    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE'
      })

      const data = await response.json()
      if (data.success) {
        fetchUsers()
        fetchStats()
      } else {
        setError(data.error)
      }
    } catch {
      setError("Failed to delete user")
    }
  }

  const handleBulkAction = async (action: string) => {
    if (selectedIds.length === 0) return

    let confirmMessage = ""
    switch (action) {
      case 'delete':
        confirmMessage = `Delete ${selectedIds.length} user${selectedIds.length !== 1 ? 's' : ''} permanently?`
        break
      case 'verify':
        confirmMessage = `Verify email for ${selectedIds.length} user${selectedIds.length !== 1 ? 's' : ''}?`
        break
    }

    if (!confirm(confirmMessage)) return

    try {
      const response = await fetch('/api/admin/users/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: action === 'verify' ? 'BULK_VERIFY_EMAIL' : 'BULK_DELETE',
          data: { userIds: selectedIds }
        })
      })

      const data = await response.json()
      if (data.success) {
        setSelectedIds([])
        fetchUsers()
        fetchStats()
      }
    } catch (err) {
      console.error("Bulk action failed:", err)
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === users.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(users.map(u => u.id))
    }
  }

  const formatDate = (date: string | null) => {
    if (!date) return "Never"
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="p-4 sm:p-6 md:p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-foreground/60">Loading users...</p>
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
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">User Management</h1>
            <p className="text-foreground/60 text-sm sm:text-base">Manage system users and permissions</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={() => fetchUsers()}
              className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
              title="Refresh"
            >
              <RefreshCw size={18} className="sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-opacity-90 transition-all w-full sm:w-auto justify-center text-sm sm:text-base"
            >
              <UserPlus size={18} className="sm:w-5 sm:h-5" />
              Add User
            </button>
          </div>
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
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-foreground/60 mb-1">Total</p>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold">{stats.total}</p>
              </div>
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-primary/40" />
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg sm:rounded-xl p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-foreground/60 mb-1">Admins</p>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-500">{stats.byRole?.ADMIN || 0}</p>
              </div>
              <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500/40" />
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg sm:rounded-xl p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-foreground/60 mb-1">Editors</p>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-500">{stats.byRole?.EDITOR || 0}</p>
              </div>
              <UserCog className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500/40" />
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg sm:rounded-xl p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-foreground/60 mb-1">Active</p>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-green-500">{stats.activeUsers}</p>
              </div>
              <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-500/40" />
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg sm:rounded-xl p-3 sm:p-6 col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-foreground/60 mb-1">Verified</p>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold">{stats.verifiedUsers}</p>
              </div>
              <Mail className="w-6 h-6 sm:w-8 sm:h-8 text-primary/40" />
            </div>
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

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-xl p-4 sm:p-6 space-y-4"
      >
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-foreground/60 sm:w-5 sm:h-5" />
          <h3 className="font-medium text-sm sm:text-base">Filter Users</h3>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/40" size={16} />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:border-primary text-sm sm:text-base"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-3 sm:px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:border-primary text-sm sm:text-base"
            >
              <option value="ALL">All Roles</option>
              <option value="ADMIN">Admins</option>
              <option value="EDITOR">Editors</option>
              <option value="VIEWER">Viewers</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 sm:px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:border-primary text-sm sm:text-base"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
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
                onClick={() => handleBulkAction('verify')}
                className="px-2 sm:px-3 py-1 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500/20 text-xs sm:text-sm"
              >
                Verify Email
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

      {/* Users List - Responsive Cards for Mobile, Table for Desktop */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-xl overflow-hidden"
      >
        {/* Mobile View - Cards (hidden on md and up) */}
        <div className="block md:hidden p-4 space-y-4">
          {users.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-foreground/60">No users found</p>
              <p className="text-foreground/40 text-sm mt-2">
                {searchTerm || selectedRole !== "ALL" || selectedStatus !== "all"
                  ? "Try adjusting your filters"
                  : "Add your first user to get started"}
              </p>
            </div>
          ) : (
            users.map((user) => (
              <div key={user.id} className="bg-primary/5 rounded-lg p-4 space-y-3 border border-border/50">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(user.id)}
                      onChange={() => toggleSelect(user.id)}
                      className="mt-1 rounded border-border"
                    />
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {user.image ? (
                          <Image src={user.image} alt={user.name} width={40} height={40} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-lg font-bold text-primary">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{user.name}</p>
                        <p className="text-xs text-foreground/60 truncate">{user.email}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-foreground/60">Role</p>
                    <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-full mt-1 ${roleColors[user.role]}`}>
                      {roleLabels[user.role]}
                    </span>
                  </div>
                  <div>
                    <p className="text-foreground/60">Status</p>
                    <div className="flex items-center gap-1 mt-1">
                      {user.emailVerified ? (
                        <CheckCircle size={12} className="text-green-500" />
                      ) : (
                        <XCircle size={12} className="text-yellow-500" />
                      )}
                      <span className="text-xs">
                        {user.emailVerified ? "Verified" : "Unverified"}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-foreground/60">Last Active</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Clock size={10} className="text-foreground/60" />
                      <span className="text-xs">
                        {user.isActive ? (
                          <span className="text-green-500">Active</span>
                        ) : (
                          formatDate(user.lastLogin)
                        )}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-foreground/60">Joined</p>
                    <p className="text-xs">{formatDate(user.createdAt)}</p>
                  </div>
                </div>

                <div className="border-t border-border/50 pt-2">
                  <p className="text-xs text-foreground/60 mb-2">Content</p>
                  <div className="flex gap-3 text-xs">
                    <span>📝 {user._count.blogPosts}</span>
                    <span>🖼️ {user._count.portfolioItems}</span>
                    <span>⚙️ {user._count.services}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Link
                    href={`/admin/users/${user.id}`}
                    className="flex-1 flex items-center justify-center gap-1 p-2 hover:bg-primary/10 rounded-lg transition-colors text-xs"
                  >
                    <Eye size={14} />
                    View
                  </Link>
                  <button
                    onClick={() => {
                      setSelectedUser(user)
                      setShowEditModal(true)
                    }}
                    className="flex-1 flex items-center justify-center gap-1 p-2 hover:bg-primary/10 rounded-lg transition-colors text-xs"
                  >
                    <Edit2 size={14} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="flex-1 flex items-center justify-center gap-1 p-2 hover:bg-red-500/10 rounded-lg transition-colors text-xs"
                    disabled={user.role === 'ADMIN'}
                  >
                    <Trash2 size={14} className={user.role === 'ADMIN' ? 'text-red-400/40' : 'text-red-400'} />
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop View - Table (hidden on mobile, shown on md and up) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full min-w-[1000px] lg:min-w-0">
            <thead>
              <tr className="border-b border-border bg-background/50">
                <th className="py-4 px-6 w-12">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === users.length && users.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-border"
                  />
                </th>
                <th className="text-left py-4 px-6 font-semibold text-sm">User</th>
                <th className="text-left py-4 px-6 font-semibold text-sm">Role</th>
                <th className="text-left py-4 px-6 font-semibold text-sm">Status</th>
                <th className="text-left py-4 px-6 font-semibold text-sm">Last Active</th>
                <th className="text-left py-4 px-6 font-semibold text-sm">Joined</th>
                <th className="text-left py-4 px-6 font-semibold text-sm">Content</th>
                <th className="text-left py-4 px-6 font-semibold text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="border-b border-border/50 hover:bg-primary/5 transition-colors"
                >
                  <td className="py-4 px-6">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(user.id)}
                      onChange={() => toggleSelect(user.id)}
                      className="rounded border-border"
                    />
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {user.image ? (
                          <Image src={user.image} alt={user.name} width={40} height={40} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-lg font-bold text-primary">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        )}
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
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${roleColors[user.role]}`}>
                      {roleLabels[user.role]}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      {user.emailVerified ? (
                        <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                      ) : (
                        <XCircle size={16} className="text-yellow-500 flex-shrink-0" />
                      )}
                      <span className="text-sm">
                        {user.emailVerified ? "Verified" : "Unverified"}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-foreground/60 flex-shrink-0" />
                      <span className="text-sm whitespace-nowrap">
                        {user.isActive ? (
                          <span className="text-green-500">Active</span>
                        ) : (
                          formatDate(user.lastLogin)
                        )}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-foreground/70 whitespace-nowrap">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-3 text-xs">
                      <span title="Blog Posts">📝 {user._count.blogPosts}</span>
                      <span title="Portfolio">🖼️ {user._count.portfolioItems}</span>
                      <span title="Services">⚙️ {user._count.services}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/users/${user.id}`}
                        className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye size={18} className="text-foreground/60" />
                      </Link>
                      <button
                        onClick={() => {
                          setSelectedUser(user)
                          setShowEditModal(true)
                        }}
                        className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={18} className="text-foreground/60" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete"
                        disabled={user.role === 'ADMIN'}
                      >
                        <Trash2 size={18} className={user.role === 'ADMIN' ? 'text-red-400/40' : 'text-red-400'} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State for Desktop */}
        {users.length === 0 && (
          <div className="hidden md:block text-center py-12">
            <p className="text-foreground/60">No users found</p>
            <p className="text-foreground/40 text-sm mt-2">
              {searchTerm || selectedRole !== "ALL" || selectedStatus !== "all"
                ? "Try adjusting your filters"
                : "Add your first user to get started"}
            </p>
          </div>
        )}
      </motion.div>

      {/* Add User Modal - Responsive */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-background border border-border rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold">Add New User</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1 text-foreground/60 hover:text-foreground"
                >
                  <X size={20} className="sm:w-6 sm:h-6" />
                </button>
              </div>
              
              <form onSubmit={handleCreateUser} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Full Name</label>
                  <input
                    type="text"
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                    className="w-full px-3 sm:px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:border-primary text-sm sm:text-base"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    className="w-full px-3 sm:px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:border-primary text-sm sm:text-base"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Password</label>
                  <input
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                    className="w-full px-3 sm:px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:border-primary text-sm sm:text-base"
                    required
                    minLength={8}
                  />
                  <p className="text-xs text-foreground/60 mt-1">Minimum 8 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Role</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                    className="w-full px-3 sm:px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:border-primary text-sm sm:text-base"
                  >
                    <option value="VIEWER">Viewer</option>
                    <option value="EDITOR">Editor</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="submit"
                    className="w-full sm:flex-1 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-opacity-90 text-sm sm:text-base"
                  >
                    Create User
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="w-full sm:flex-1 py-2 border border-border rounded-lg hover:border-primary text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit User Modal - Responsive */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-background border border-border rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold">Edit User</h2>
                <button
                  onClick={() => {
                    setShowEditModal(false)
                    setSelectedUser(null)
                  }}
                  className="p-1 text-foreground/60 hover:text-foreground"
                >
                  <X size={20} className="sm:w-6 sm:h-6" />
                </button>
              </div>
              
              <form onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                const name = formData.get('name')
                const role = formData.get('role')
                handleUpdateUser(selectedUser.id, {
                  name: typeof name === 'string' ? name : undefined,
                  role: (typeof role === 'string' && ['VIEWER', 'EDITOR', 'ADMIN'].includes(role) ? role : undefined) as 'VIEWER' | 'ADMIN' | 'EDITOR' | undefined,
                  emailVerified: formData.get('emailVerified') === 'true'
                })
              }} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={selectedUser.name}
                    className="w-full px-3 sm:px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:border-primary text-sm sm:text-base"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    value={selectedUser.email}
                    disabled
                    className="w-full px-3 sm:px-4 py-2 bg-input/50 border border-border rounded-lg cursor-not-allowed text-sm sm:text-base"
                  />
                  <p className="text-xs text-foreground/60 mt-1">Email cannot be changed</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Role</label>
                  <select
                    name="role"
                    defaultValue={selectedUser.role}
                    className="w-full px-3 sm:px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:border-primary text-sm sm:text-base"
                  >
                    <option value="VIEWER">Viewer</option>
                    <option value="EDITOR">Editor</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Email Verified</label>
                  <select
                    name="emailVerified"
                    defaultValue={selectedUser.emailVerified ? "true" : "false"}
                    className="w-full px-3 sm:px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:border-primary text-sm sm:text-base"
                  >
                    <option value="true">Verified</option>
                    <option value="false">Unverified</option>
                  </select>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="submit"
                    className="w-full sm:flex-1 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-opacity-90 text-sm sm:text-base"
                  >
                    Update User
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false)
                      setSelectedUser(null)
                    }}
                    className="w-full sm:flex-1 py-2 border border-border rounded-lg hover:border-primary text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}