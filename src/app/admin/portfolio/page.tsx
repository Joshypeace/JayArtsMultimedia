"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Edit2, Trash2, Eye, EyeOff, Upload } from "lucide-react"
import { CldImage } from 'next-cloudinary'

interface PortfolioItem {
  id: string
  title: string
  slug: string
  description: string
  category: "PHOTOGRAPHY" | "VIDEOGRAPHY" | "GRAPHIC_DESIGN"
  imageUrl: string
  videoUrl: string | null
  thumbnailUrl: string
  featured: boolean
  publishedAt: string | null
  tags: string[]
  views: number
  createdAt: string
}

export default function ManagePortfolio() {
  const [items, setItems] = useState<PortfolioItem[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "PHOTOGRAPHY" as "PHOTOGRAPHY" | "VIDEOGRAPHY" | "GRAPHIC_DESIGN",
    tags: "",
    featured: false,
    imageUrl: "",
    videoUrl: "",
    thumbnailUrl: ""
  })
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchPortfolioItems()
  }, [])

  const fetchPortfolioItems = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/portfolio')
      if (!response.ok) throw new Error("Failed to fetch portfolio")
      const data = await response.json()
      setItems(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load portfolio")
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
        imageUrl: data.url,
        thumbnailUrl: data.url
      }))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)

      const response = await fetch('/api/admin/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tags: tagsArray
        })
      })

      if (!response.ok) throw new Error("Failed to save portfolio item")
      
      const newItem = await response.json()
      setItems(prev => [newItem, ...prev])
      setShowForm(false)
      resetForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return

    try {
      const response = await fetch(`/api/admin/portfolio/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error("Failed to delete")
      
      setItems(prev => prev.filter(item => item.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete")
    }
  }

  const handleTogglePublish = async (id: string, currentlyPublished: boolean) => {
    try {
      const response = await fetch(`/api/admin/portfolio/${id}/publish`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          published: !currentlyPublished,
          publishedAt: currentlyPublished ? null : new Date().toISOString()
        })
      })

      if (!response.ok) throw new Error("Failed to update status")
      
      const updatedItem = await response.json()
      setItems(prev => prev.map(item => item.id === id ? updatedItem : item))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update")
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "PHOTOGRAPHY",
      tags: "",
      featured: false,
      imageUrl: "",
      videoUrl: "",
      thumbnailUrl: ""
    })
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not published"
    return new Date(dateString).toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-foreground/60">Loading portfolio...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">Portfolio Management</h1>
            <p className="text-foreground/60">Manage your portfolio items ({items.length} items)</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-opacity-90 transition-all"
          >
            <Plus size={20} />
            Add Item
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
          <h2 className="text-2xl font-bold">Add New Portfolio Item</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:border-primary"
                    placeholder="Enter title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value as "PHOTOGRAPHY" | "VIDEOGRAPHY" | "GRAPHIC_DESIGN"})}
                    className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:border-primary"
                  >
                    <option value="PHOTOGRAPHY">Photography</option>
                    <option value="VIDEOGRAPHY">Videography</option>
                    <option value="GRAPHIC_DESIGN">Graphic Design</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({...formData, tags: e.target.value})}
                    className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:border-primary"
                    placeholder="e.g., wedding, corporate, branding"
                  />
                  <p className="text-xs text-foreground/60 mt-1">Separate tags with commas</p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                    className="w-4 h-4"
                  />
                  <label htmlFor="featured" className="text-sm">Featured item</label>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Image *</label>
                  <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                    {formData.imageUrl ? (
                      <div className="relative h-40 rounded-lg overflow-hidden mb-2">
                        <CldImage
                          src={formData.imageUrl}
                          alt="Preview"
                          width={300}
                          height={200}
                          crop="fill"
                          gravity="auto"
                          className="object-cover rounded-lg"
                        />
                      </div>
                    ) : (
                      <Upload className="w-12 h-12 text-foreground/40 mx-auto mb-2" />
                    )}
                    
                    <input
                      type="file"
                      id="imageUpload"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <label htmlFor="imageUpload" className="cursor-pointer">
                      <span className="text-primary hover:underline">
                        {uploading ? "Uploading..." : "Click to upload image"}
                      </span>
                    </label>
                    <p className="text-xs text-foreground/60 mt-1">Recommended: 1200x800px</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Video URL (optional)</label>
                  <input
                    type="url"
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
                    className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:border-primary"
                    placeholder="https://youtube.com/..."
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description *</label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={4}
                className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:border-primary resize-none"
                placeholder="Enter description"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={uploading}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-opacity-90 disabled:opacity-50"
              >
                Save Item
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
                <th className="text-left py-4 px-6 font-semibold">Preview</th>
                <th className="text-left py-4 px-6 font-semibold">Title</th>
                <th className="text-left py-4 px-6 font-semibold">Category</th>
                <th className="text-left py-4 px-6 font-semibold">Status</th>
                <th className="text-left py-4 px-6 font-semibold">Published</th>
                <th className="text-left py-4 px-6 font-semibold">Views</th>
                <th className="text-left py-4 px-6 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="border-b border-border/50 hover:bg-primary/5 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="relative w-16 h-12 rounded overflow-hidden">
                      <CldImage
                        src={item.imageUrl}
                        alt={item.title}
                        width={64}
                        height={48}
                        crop="fill"
                        gravity="auto"
                        className="object-cover"
                      />
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-medium">{item.title}</div>
                    {item.featured && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        Featured
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => handleTogglePublish(item.id, !!item.publishedAt)}
                      className={`px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-1 ${
                        item.publishedAt 
                          ? "bg-green-500/10 text-green-400" 
                          : "bg-yellow-500/10 text-yellow-400"
                      }`}
                    >
                      {item.publishedAt ? (
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
                  </td>
                  <td className="py-4 px-6 text-sm text-foreground/70">
                    {formatDate(item.publishedAt)}
                  </td>
                  <td className="py-4 px-6 text-sm font-medium">
                    {item.views.toLocaleString()}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2">
                      <button 
                        className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
                        onClick={() => window.open(`/portfolio/${item.slug}`, '_blank')}
                      >
                        <Eye size={18} className="text-foreground/60" />
                      </button>
                      <button className="p-2 hover:bg-primary/10 rounded-lg transition-colors">
                        <Edit2 size={18} className="text-foreground/60" />
                      </button>
                      <button 
                        className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                        onClick={() => handleDelete(item.id)}
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

        {items.length === 0 && (
          <div className="text-center py-12">
            <p className="text-foreground/60">No portfolio items yet</p>
            <p className="text-foreground/40 text-sm mt-2">Click &quot;Add Item&quot; to create your first portfolio item</p>
          </div>
        )}
      </motion.div>
    </div>
  )
}