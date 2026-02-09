"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Edit2, Trash2, Eye, EyeOff, Upload, Calendar, Clock, Tag } from "lucide-react"
import { CldImage } from 'next-cloudinary'
import dynamic from 'next/dynamic'
import 'react-quill/dist/quill.snow.css'

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage: string
  category: string
  readTime: number
  publishedAt: string | null
  isPublished: boolean
  isFeatured: boolean
  tags: string[]
  views: number
  likes: number
  createdAt: string
  updatedAt: string
  author: {
    name: string
    email: string
  }
  _count?: {
    comments: number
  }
}

interface BlogFormData {
  title: string
  excerpt: string
  content: string
  coverImage: string
  category: string
  readTime: number
  isPublished: boolean
  isFeatured: boolean
  tags: string[]
  metaTitle?: string
  metaDescription?: string
}

const categories = [
  "Photography",
  "Videography", 
  "Design",
  "Tutorials",
  "Business",
  "Technology",
  "Inspiration"
]

export default function ManageBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [uploading, setUploading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  const [formData, setFormData] = useState<BlogFormData>({
    title: "",
    excerpt: "",
    content: "",
    coverImage: "",
    category: "Photography",
    readTime: 5,
    isPublished: false,
    isFeatured: false,
    tags: [],
    metaTitle: "",
    metaDescription: ""
  })

  useEffect(() => {
    fetchBlogPosts()
  }, [])

  const fetchBlogPosts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/blog')
      if (!response.ok) throw new Error("Failed to fetch blog posts")
      const data = await response.json()
      setPosts(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load blog posts")
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'image')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) throw new Error("Upload failed")
      const data = await response.json()
      
      setFormData(prev => ({
        ...prev,
        coverImage: data.url
      }))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const input = e.currentTarget.value.trim()
      if (input && !formData.tags.includes(input)) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, input]
        }))
        e.currentTarget.value = ''
      }
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      const url = editingId 
        ? `/api/admin/blog/${editingId}`
        : '/api/admin/blog'
      
      const method = editingId ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to save blog post")
      }
      
      const savedPost = await response.json()
      
      if (editingId) {
        setPosts(prev => prev.map(post => post.id === editingId ? savedPost : post))
      } else {
        setPosts(prev => [savedPost, ...prev])
      }
      
      setShowForm(false)
      resetForm()
      setEditingId(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save blog post")
    }
  }

  const handleEdit = (post: BlogPost) => {
    setFormData({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      coverImage: post.coverImage,
      category: post.category,
      readTime: post.readTime,
      isPublished: post.isPublished,
      isFeatured: post.isFeatured,
      tags: post.tags,
      
    })
    setEditingId(post.id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post? This action cannot be undone.")) return

    try {
      const response = await fetch(`/api/admin/blog/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error("Failed to delete blog post")
      
      setPosts(prev => prev.filter(post => post.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete blog post")
    }
  }

  const handleTogglePublish = async (id: string, isPublished: boolean) => {
    try {
      const response = await fetch(`/api/admin/blog/${id}/publish`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !isPublished })
      })

      if (!response.ok) throw new Error("Failed to update status")
      
      const updatedPost = await response.json()
      setPosts(prev => prev.map(post => post.id === id ? updatedPost : post))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status")
    }
  }

  const handleToggleFeature = async (id: string, isFeatured: boolean) => {
    try {
      const response = await fetch(`/api/admin/blog/${id}/feature`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFeatured: !isFeatured })
      })

      if (!response.ok) throw new Error("Failed to update feature status")
      
      const updatedPost = await response.json()
      setPosts(prev => prev.map(post => post.id === id ? updatedPost : post))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update feature status")
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      coverImage: "",
      category: "Photography",
      readTime: 5,
      isPublished: false,
      isFeatured: false,
      tags: [],
      metaTitle: "",
      metaDescription: ""
    })
    setEditingId(null)
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not published"
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-foreground/60">Loading blog posts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">Blog Management</h1>
            <p className="text-foreground/60">Create and manage blog posts ({posts.length} posts)</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => {
              resetForm()
              setShowForm(!showForm)
            }}
            className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-opacity-90 transition-all"
          >
            <Plus size={20} />
            New Post
          </motion.button>
        </div>
      </motion.div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-xl p-6 space-y-6"
        >
          <h2 className="text-2xl font-bold">
            {editingId ? 'Edit Blog Post' : 'Create New Blog Post'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:border-primary"
                    placeholder="Enter blog post title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Excerpt *</label>
                  <textarea
                    required
                    value={formData.excerpt}
                    onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:border-primary resize-none"
                    placeholder="Enter a brief excerpt (appears in blog listing)"
                    maxLength={200}
                  />
                  <p className="text-xs text-foreground/60 mt-1">
                    {formData.excerpt.length}/200 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Content *</label>
                  <div className="border border-border rounded-lg overflow-hidden">
                    {ReactQuill && (
                      <ReactQuill
                        theme="snow"
                        value={formData.content}
                        onChange={(content) => setFormData({...formData, content})}
                        className="h-64 bg-input"
                      />
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:border-primary"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Read Time (minutes)</label>
                    <div className="flex items-center gap-2">
                      <Clock size={18} className="text-foreground/60" />
                      <input
                        type="number"
                        min="1"
                        value={formData.readTime}
                        onChange={(e) => setFormData({...formData, readTime: parseInt(e.target.value) || 5})}
                        className="flex-1 px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Tags</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.tags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-primary hover:text-primary/70"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    onKeyDown={handleTagInput}
                    className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:border-primary"
                    placeholder="Type tag and press Enter or comma"
                  />
                  <p className="text-xs text-foreground/60 mt-1">Add tags to help categorize your post</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isPublished"
                      checked={formData.isPublished}
                      onChange={(e) => setFormData({...formData, isPublished: e.target.checked})}
                      className="w-4 h-4"
                    />
                    <label htmlFor="isPublished" className="text-sm font-medium">Publish immediately</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isFeatured"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})}
                      className="w-4 h-4"
                    />
                    <label htmlFor="isFeatured" className="text-sm font-medium">Featured post</label>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Cover Image *</label>
                  <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                    {formData.coverImage ? (
                      <div className="relative h-48 rounded-lg overflow-hidden mb-3">
                        <CldImage
                          src={formData.coverImage}
                          alt="Cover preview"
                          width={300}
                          height={200}
                          crop="fill"
                          gravity="auto"
                          className="object-cover rounded-lg"
                        />
                      </div>
                    ) : (
                      <Upload className="w-12 h-12 text-foreground/40 mx-auto mb-3" />
                    )}
                    
                    <input
                      type="file"
                      id="coverImageUpload"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <label htmlFor="coverImageUpload" className="cursor-pointer block">
                      <span className="text-primary hover:underline">
                        {uploading ? "Uploading..." : "Click to upload cover image"}
                      </span>
                    </label>
                    <p className="text-xs text-foreground/60 mt-1">Recommended: 1200x630px</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Meta Title (SEO)</label>
                  <input
                    type="text"
                    value={formData.metaTitle}
                    onChange={(e) => setFormData({...formData, metaTitle: e.target.value})}
                    className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:border-primary"
                    placeholder="Optional: Custom SEO title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Meta Description (SEO)</label>
                  <textarea
                    value={formData.metaDescription}
                    onChange={(e) => setFormData({...formData, metaDescription: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:border-primary resize-none"
                    placeholder="Optional: Custom SEO description"
                    maxLength={160}
                  />
                  <p className="text-xs text-foreground/60 mt-1">
                    {formData.metaDescription?.length || 0}/160 characters
                  </p>
                </div>

                <div className="pt-4 border-t border-border">
                  <h3 className="font-medium mb-2">SEO Preview</h3>
                  <div className="space-y-2 text-sm">
                    <p className="font-medium truncate">
                      {formData.metaTitle || formData.title || "Title will appear here"}
                    </p>
                    <p className="text-foreground/70 line-clamp-2">
                      {formData.metaDescription || formData.excerpt || "Description will appear here"}
                    </p>
                    <p className="text-foreground/50 truncate">example.com/blog/...</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-border">
              <button
                type="submit"
                disabled={uploading}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-opacity-90 disabled:opacity-50"
              >
                {editingId ? 'Update Post' : 'Save & Publish'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  resetForm()
                }}
                className="px-6 py-2 border border-border text-foreground rounded-lg hover:border-primary"
              >
                Cancel
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => resetForm()}
                  className="px-6 py-2 text-foreground/70 hover:text-foreground"
                >
                  Reset Form
                </button>
              )}
            </div>
          </form>
        </motion.div>
      )}

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
                <th className="text-left py-4 px-6 font-semibold">Title</th>
                <th className="text-left py-4 px-6 font-semibold">Author</th>
                <th className="text-left py-4 px-6 font-semibold">Category</th>
                <th className="text-left py-4 px-6 font-semibold">Date</th>
                <th className="text-left py-4 px-6 font-semibold">Status</th>
                <th className="text-left py-4 px-6 font-semibold">Stats</th>
                <th className="text-left py-4 px-6 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post, idx) => (
                <motion.tr
                  key={post.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="border-b border-border/50 hover:bg-primary/5 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="font-medium line-clamp-1">{post.title}</div>
                    {post.isFeatured && (
                      <span className="text-xs bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded-full mt-1 inline-block">
                        Featured
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-foreground/70">{post.author.name}</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                      {post.category}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-foreground/70">
                    {formatDate(post.publishedAt || post.createdAt)}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleTogglePublish(post.id, post.isPublished)}
                        className={`px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-1 w-fit ${
                          post.isPublished 
                            ? "bg-green-500/10 text-green-400" 
                            : "bg-yellow-500/10 text-yellow-400"
                        }`}
                      >
                        {post.isPublished ? (
                          <>
                            <Eye size={12} />
                            Published
                          </>
                        ) : (
                          <>
                            <EyeOff size={12} />
                            Draft
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleToggleFeature(post.id, post.isFeatured)}
                        className={`px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-1 w-fit ${
                          post.isFeatured 
                            ? "bg-purple-500/10 text-purple-400" 
                            : "bg-gray-500/10 text-gray-400"
                        }`}
                      >
                        <Tag size={12} />
                        {post.isFeatured ? 'Featured' : 'Feature'}
                      </button>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-col gap-1 text-sm">
                      <div className="flex items-center gap-2">
                        <Eye size={14} className="text-foreground/60" />
                        <span>{post.views.toLocaleString()} views</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-foreground/60" />
                        <span>{post.readTime} min read</span>
                      </div>
                      {post._count && (
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-foreground/60" />
                          <span>{post._count.comments} comments</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2">
                      <button 
                        className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
                        onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                        title="View"
                      >
                        <Eye size={18} className="text-foreground/60" />
                      </button>
                      <button 
                        className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
                        onClick={() => handleEdit(post)}
                        title="Edit"
                      >
                        <Edit2 size={18} className="text-foreground/60" />
                      </button>
                      <button 
                        className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                        onClick={() => handleDelete(post.id)}
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

        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-foreground/60">No blog posts yet</p>
            <p className="text-foreground/40 text-sm mt-2">Click &quot;New Post&quot; to create your first blog post</p>
          </div>
        )}
      </motion.div>
    </div>
  )
}