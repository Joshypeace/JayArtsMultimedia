"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  Mail,
  Calendar,
  Edit2,
  Trash2,
  CheckCircle,
  Clock,
  FileText,
  Image,
  Package,
  Calendar as BookingIcon,
  MessageCircle
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

const roleColors = {
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

  useEffect(() => {
    fetchUser()
  }, [params.id])

  const fetchUser = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/users/${params.id}`)
      const data = await response.json()
      
      if (data.success) {
        setUser(data.data)
      } else {
        setError(data.error)
      }
    } catch {
      setError("Failed to load user details")
    } finally {
      setLoading(false)
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
      <div className="p-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="p-8">
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
          <p className="text-red-400">{error || "User not found"}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-foreground/60 hover:text-primary transition-colors"
      >
        <ArrowLeft size={20} />
        Back to Users
      </button>

      {/* User Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-xl p-8"
      >
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
            {user.image ? (
              <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-4xl font-bold text-primary">
                {user.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">{user.name}</h1>
                <div className="flex items-center gap-4 text-foreground/60">
                  <div className="flex items-center gap-1">
                    <Mail size={16} />
                    {user.email}
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${roleColors[user.role]}`}>
                    {user.role}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {/* Implement edit */}}
                  className="px-4 py-2 border border-border rounded-lg hover:border-primary flex items-center gap-2"
                >
                  <Edit2 size={18} />
                  Edit
                </button>
                <button
                  onClick={() => {/* Implement delete */}}
                  className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 flex items-center gap-2"
                >
                  <Trash2 size={18} />
                  Delete
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 mt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <CheckCircle size={20} className={user.emailVerified ? "text-green-500" : "text-yellow-500"} />
                </div>
                <div>
                  <p className="text-sm text-foreground/60">Email Status</p>
                  <p className="font-semibold">{user.emailVerified ? "Verified" : "Unverified"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Calendar size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm text-foreground/60">Joined</p>
                  <p className="font-semibold">{formatDate(user.createdAt)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Clock size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm text-foreground/60">Last Active</p>
                  <p className="font-semibold">{formatDate(user.lastLogin)}</p>
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
        className="grid grid-cols-5 gap-4"
      >
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <FileText className="w-5 h-5 text-primary" />
            <span className="text-2xl font-bold">{user._count.blogPosts}</span>
          </div>
          <p className="text-sm text-foreground/60">Blog Posts</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <Image className="w-5 h-5 text-primary" />
            <span className="text-2xl font-bold">{user._count.portfolioItems}</span>
          </div>
          <p className="text-sm text-foreground/60">Portfolio Items</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <Package className="w-5 h-5 text-primary" />
            <span className="text-2xl font-bold">{user._count.services}</span>
          </div>
          <p className="text-sm text-foreground/60">Services</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <BookingIcon className="w-5 h-5 text-primary" />
            <span className="text-2xl font-bold">{user._count.bookings}</span>
          </div>
          <p className="text-sm text-foreground/60">Bookings</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            <span className="text-2xl font-bold">{user._count.inquiries}</span>
          </div>
          <p className="text-sm text-foreground/60">Inquiries</p>
        </div>
      </motion.div>

      {/* Recent Activity */}
      <div className="grid grid-cols-2 gap-6">
        {/* Recent Blog Posts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Recent Blog Posts</h3>
          <div className="space-y-3">
            {user.blogPosts.length > 0 ? (
              user.blogPosts.map(post => (
                <div key={post.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                  <div>
                    <p className="font-medium">{post.title}</p>
                    <p className="text-xs text-foreground/60">{formatDate(post.createdAt)}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    post.isPublished ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"
                  }`}>
                    {post.isPublished ? "Published" : "Draft"}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-foreground/60 text-center py-4">No blog posts yet</p>
            )}
          </div>
        </motion.div>

        {/* Recent Portfolio Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Recent Portfolio Items</h3>
          <div className="space-y-3">
            {user.portfolioItems.length > 0 ? (
              user.portfolioItems.map(item => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-foreground/60">{formatDate(item.createdAt)}</p>
                  </div>
                  {item.featured && (
                    <span className="px-2 py-1 text-xs bg-yellow-500/10 text-yellow-500 rounded-full">
                      Featured
                    </span>
                  )}
                </div>
              ))
            ) : (
              <p className="text-foreground/60 text-center py-4">No portfolio items yet</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}