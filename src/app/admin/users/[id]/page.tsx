"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import {
  ArrowLeft,
  Mail,
  Calendar,
  Edit2,
  Trash2,
  CheckCircle,
  Clock,
  FileText,
  Image as ImageIcon,
  Package,
  Calendar as BookingIcon,
  MessageCircle,
  X
} from "lucide-react"

interface UserDetails {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'EDITOR' | 'VIEWER'
  image: string | null
  emailVerified: boolean
  lastLogin: string | null
  createdAt: string
  updatedAt: string
  _count: {
    blogPosts: number
    portfolioItems: number
    services: number
    bookings: number
    inquiries: number
  }
  blogPosts: Array<{
    id: string
    title: string
    createdAt: string
    isPublished: boolean
  }>
  portfolioItems: Array<{
    id: string
    title: string
    createdAt: string
    featured: boolean
  }>
  bookings: Array<{
    id: string
    clientName: string
    eventType: string
    status: string
    createdAt: string
  }>
}

const roleColors: Record<string, string> = {
  ADMIN: "bg-purple-500/10 text-purple-500",
  EDITOR: "bg-blue-500/10 text-blue-500",
  VIEWER: "bg-green-500/10 text-green-500"
}

export default function UserDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [user, setUser] = useState<UserDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [editForm, setEditForm] = useState({
    name: "",
    role: "",
    emailVerified: false
  })

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/users/${params.id}`)
      const data = await response.json()
      
      if (data.success) {
        setUser(data.data)
        setEditForm({
          name: data.data.name,
          role: data.data.role,
          emailVerified: data.data.emailVerified
        })
      } else {
        setError(data.error)
      }
    } catch {
      setError("Failed to load user details")
    } finally {
      setLoading(false)
    }
  }, [params.id])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  const handleUpdateUser = async () => {
    try {
      const response = await fetch(`/api/admin/users/${user?.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editForm.name,
          role: editForm.role,
          emailVerified: editForm.emailVerified
        })
      })

      const data = await response.json()
      if (data.success) {
        setShowEditModal(false)
        fetchUser()
      } else {
        setError(data.error)
      }
    } catch {
      setError("Failed to update user")
    }
  }

  const handleDeleteUser = async () => {
    try {
      const response = await fetch(`/api/admin/users/${user?.id}`, {
        method: 'DELETE'
      })

      const data = await response.json()
      if (data.success) {
        router.push('/admin/users')
      } else {
        setError(data.error)
      }
    } catch {
      setError("Failed to delete user")
    }
  }

  const formatDate = (date: string | null) => {
    if (!date) return "Never"
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
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
          <p className="text-foreground/60">Loading user details...</p>
        </div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="p-4 sm:p-6 md:p-8">
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 sm:p-6 max-w-2xl mx-auto">
          <p className="text-red-400 text-sm sm:text-base">{error || "User not found"}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm sm:text-base"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-foreground/60 hover:text-primary transition-colors text-sm sm:text-base"
      >
        <ArrowLeft size={16} className="sm:w-5 sm:h-5" />
        Back to Users
      </button>

      {/* User Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-xl p-4 sm:p-6 md:p-8"
      >
        <div className="flex flex-col lg:flex-row items-start gap-4 sm:gap-6">
          {/* Avatar */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden flex-shrink-0 mx-auto lg:mx-0">
            {user.image ? (
              <Image 
                src={user.image} 
                alt={user.name} 
                width={96} 
                height={96} 
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">
                {user.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1 w-full">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="w-full lg:w-auto">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-center lg:text-left">
                  {user.name}
                </h1>
                <div className="flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-4 text-foreground/60">
                  <div className="flex items-center gap-1 text-sm sm:text-base">
                    <Mail size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="break-all">{user.email}</span>
                  </div>
                  <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${roleColors[user.role]}`}>
                    {user.role}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 w-full lg:w-auto">
                <button
                  onClick={() => setShowEditModal(true)}
                  className="flex-1 lg:flex-none px-4 py-2 border border-border rounded-lg hover:border-primary flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <Edit2 size={16} className="sm:w-4 sm:h-4" />
                  Edit
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex-1 lg:flex-none px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <Trash2 size={16} className="sm:w-4 sm:h-4" />
                  Delete
                </button>
              </div>
            </div>

            {/* Status Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-6">
              <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle size={16} className={`sm:w-5 sm:h-5 ${user.emailVerified ? "text-green-500" : "text-yellow-500"}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-foreground/60">Email Status</p>
                  <p className="font-semibold text-sm sm:text-base truncate">
                    {user.emailVerified ? "Verified" : "Unverified"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Calendar size={16} className="sm:w-5 sm:h-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-foreground/60">Joined</p>
                  <p className="font-semibold text-sm sm:text-base truncate">{formatDate(user.createdAt)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Clock size={16} className="sm:w-5 sm:h-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-foreground/60">Last Active</p>
                  <p className="font-semibold text-sm sm:text-base truncate">{formatDate(user.lastLogin)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4"
      >
        <div className="bg-card border border-border rounded-lg sm:rounded-xl p-3 sm:p-6">
          <div className="flex items-center justify-between mb-2">
            <FileText size={16} className="sm:w-5 sm:h-5 text-primary" />
            <span className="text-lg sm:text-xl md:text-2xl font-bold">{user._count.blogPosts}</span>
          </div>
          <p className="text-xs sm:text-sm text-foreground/60">Blog Posts</p>
        </div>

        <div className="bg-card border border-border rounded-lg sm:rounded-xl p-3 sm:p-6">
          <div className="flex items-center justify-between mb-2">
            <ImageIcon size={16} className="sm:w-5 sm:h-5 text-primary" />
            <span className="text-lg sm:text-xl md:text-2xl font-bold">{user._count.portfolioItems}</span>
          </div>
          <p className="text-xs sm:text-sm text-foreground/60">Portfolio</p>
        </div>

        <div className="bg-card border border-border rounded-lg sm:rounded-xl p-3 sm:p-6">
          <div className="flex items-center justify-between mb-2">
            <Package size={16} className="sm:w-5 sm:h-5 text-primary" />
            <span className="text-lg sm:text-xl md:text-2xl font-bold">{user._count.services}</span>
          </div>
          <p className="text-xs sm:text-sm text-foreground/60">Services</p>
        </div>

        <div className="bg-card border border-border rounded-lg sm:rounded-xl p-3 sm:p-6">
          <div className="flex items-center justify-between mb-2">
            <BookingIcon size={16} className="sm:w-5 sm:h-5 text-primary" />
            <span className="text-lg sm:text-xl md:text-2xl font-bold">{user._count.bookings}</span>
          </div>
          <p className="text-xs sm:text-sm text-foreground/60">Bookings</p>
        </div>

        <div className="bg-card border border-border rounded-lg sm:rounded-xl p-3 sm:p-6 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between mb-2">
            <MessageCircle size={16} className="sm:w-5 sm:h-5 text-primary" />
            <span className="text-lg sm:text-xl md:text-2xl font-bold">{user._count.inquiries}</span>
          </div>
          <p className="text-xs sm:text-sm text-foreground/60">Inquiries</p>
        </div>
      </motion.div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Blog Posts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-xl p-4 sm:p-6"
        >
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Recent Blog Posts</h3>
          <div className="space-y-2 sm:space-y-3">
            {user.blogPosts.length > 0 ? (
              user.blogPosts.map(post => (
                <div key={post.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-background/50 rounded-lg gap-2">
                  <div className="min-w-0">
                    <p className="font-medium text-sm sm:text-base truncate">{post.title}</p>
                    <p className="text-xs text-foreground/60">{formatDate(post.createdAt)}</p>
                  </div>
                  <span className={`self-start sm:self-center px-2 py-1 text-xs rounded-full whitespace-nowrap ${
                    post.isPublished ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"
                  }`}>
                    {post.isPublished ? "Published" : "Draft"}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-foreground/60 text-center py-4 text-sm sm:text-base">No blog posts yet</p>
            )}
          </div>
        </motion.div>

        {/* Recent Portfolio Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border rounded-xl p-4 sm:p-6"
        >
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Recent Portfolio Items</h3>
          <div className="space-y-2 sm:space-y-3">
            {user.portfolioItems.length > 0 ? (
              user.portfolioItems.map(item => (
                <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-background/50 rounded-lg gap-2">
                  <div className="min-w-0">
                    <p className="font-medium text-sm sm:text-base truncate">{item.title}</p>
                    <p className="text-xs text-foreground/60">{formatDate(item.createdAt)}</p>
                  </div>
                  {item.featured && (
                    <span className="self-start sm:self-center px-2 py-1 text-xs bg-yellow-500/10 text-yellow-500 rounded-full whitespace-nowrap">
                      Featured
                    </span>
                  )}
                </div>
              ))
            ) : (
              <p className="text-foreground/60 text-center py-4 text-sm sm:text-base">No portfolio items yet</p>
            )}
          </div>
        </motion.div>

        {/* Recent Bookings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-card border border-border rounded-xl p-4 sm:p-6"
        >
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Recent Bookings</h3>
          <div className="space-y-2 sm:space-y-3">
            {user.bookings.length > 0 ? (
              user.bookings.map(booking => (
                <div key={booking.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-background/50 rounded-lg gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm sm:text-base truncate">{booking.clientName}</p>
                    <p className="text-xs text-foreground/60">{booking.eventType}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${
                      booking.status === 'CONFIRMED' ? 'bg-green-500/10 text-green-500' :
                      booking.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500' :
                      'bg-blue-500/10 text-blue-500'
                    }`}>
                      {booking.status}
                    </span>
                    <span className="text-xs text-foreground/60 whitespace-nowrap">
                      {formatDate(booking.createdAt)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-foreground/60 text-center py-4 text-sm sm:text-base">No bookings yet</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Edit User Modal - Responsive */}
      {showEditModal && (
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
                  onClick={() => setShowEditModal(false)}
                  className="p-1 text-foreground/60 hover:text-foreground"
                >
                  <X size={20} className="sm:w-6 sm:h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Full Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    className="w-full px-3 sm:px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:border-primary text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Role</label>
                  <select
                    value={editForm.role}
                    onChange={(e) => setEditForm({...editForm, role: e.target.value})}
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
                    value={editForm.emailVerified ? "true" : "false"}
                    onChange={(e) => setEditForm({...editForm, emailVerified: e.target.value === "true"})}
                    className="w-full px-3 sm:px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:border-primary text-sm sm:text-base"
                  >
                    <option value="true">Verified</option>
                    <option value="false">Unverified</option>
                  </select>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    onClick={handleUpdateUser}
                    className="w-full sm:flex-1 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-opacity-90 text-sm sm:text-base"
                  >
                    Update User
                  </button>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="w-full sm:flex-1 py-2 border border-border rounded-lg hover:border-primary text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal - Responsive */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-background border border-border rounded-xl max-w-md w-full"
          >
            <div className="p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-4">Confirm Delete</h2>
              <p className="text-sm sm:text-base text-foreground/70 mb-6">
                Are you sure you want to delete this user? This action cannot be undone.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleDeleteUser}
                  className="w-full sm:flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm sm:text-base"
                >
                  Delete
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="w-full sm:flex-1 py-2 border border-border rounded-lg hover:border-primary text-sm sm:text-base"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}