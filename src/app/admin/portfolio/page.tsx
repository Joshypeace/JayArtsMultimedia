"use client"

import { useState, useEffect } from "react"
import { motion, Reorder } from "framer-motion"
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Eye, 
  EyeOff, 
  Upload, 
  X,
  GripVertical,
  ChevronLeft,
  ChevronRight,
  Loader2
} from "lucide-react"
import { CldImage } from 'next-cloudinary'

interface PortfolioImage {
  url: string
  thumbnail: string
  caption?: string
  order: number
}

interface PortfolioItem {
  id: string
  title: string
  slug: string
  description: string
  category: "PHOTOGRAPHY" | "VIDEOGRAPHY" | "GRAPHIC_DESIGN"
  images: PortfolioImage[]  // New field for multiple images
  imageUrl: string          // Main image (first image)
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
  const [uploading, setUploading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [showImagePreview, setShowImagePreview] = useState(false)
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "PHOTOGRAPHY" as "PHOTOGRAPHY" | "VIDEOGRAPHY" | "GRAPHIC_DESIGN",
    tags: "",
    featured: false,
    images: [] as PortfolioImage[],
    videoUrl: "",
  })

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
    const files = event.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    try {
      const uploadPromises = Array.from(files).map(async (file, fileIndex) => {
        const uploadFormData = new FormData()
        uploadFormData.append('file', file)
        uploadFormData.append('type', 'image')

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData
        })

        if (!response.ok) throw new Error("Upload failed")
        const data = await response.json()
        
        return {
          url: data.url,
          thumbnail: data.url, // You can generate a thumbnail URL if needed
          caption: "",
          order: formData.images.length + fileIndex
        }
      })

      const uploadedImages = await Promise.all(uploadPromises)
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedImages]
      }))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const updateImageCaption = (index: number, caption: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => 
        i === index ? { ...img, caption } : img
      )
    }))
  }

  const reorderImages = (newOrder: PortfolioImage[]) => {
    setFormData(prev => ({
      ...prev,
      images: newOrder.map((img, index) => ({ ...img, order: index }))
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validate at least one image
    if (formData.images.length === 0) {
      setError("Please upload at least one image")
      return
    }

    try {
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      
      // Prepare images with order
      const imagesWithOrder = formData.images.map((img, index) => ({
        ...img,
        order: index
      }))

      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        tags: tagsArray,
        featured: formData.featured,
        images: imagesWithOrder,
        imageUrl: imagesWithOrder[0]?.url || "", // First image as main
        thumbnailUrl: imagesWithOrder[0]?.thumbnail || "",
        videoUrl: formData.videoUrl || null
      }

      const url = editingId 
        ? `/api/admin/portfolio/${editingId}`
        : '/api/admin/portfolio'
      
      const method = editingId ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!response.ok) throw new Error("Failed to save portfolio item")
      
      const savedItem = await response.json()
      
      if (editingId) {
        setItems(prev => prev.map(item => item.id === editingId ? savedItem : item))
      } else {
        setItems(prev => [savedItem, ...prev])
      }
      
      setShowForm(false)
      resetForm()
      setEditingId(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save")
    }
  }

  const handleEdit = (item: PortfolioItem) => {
    setFormData({
      title: item.title,
      description: item.description,
      category: item.category,
      tags: item.tags.join(', '),
      featured: item.featured,
      images: item.images || [{ 
        url: item.imageUrl, 
        thumbnail: item.thumbnailUrl,
        caption: "",
        order: 0 
      }],
      videoUrl: item.videoUrl || "",
    })
    setEditingId(item.id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
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
      images: [],
      videoUrl: "",
    })
    setEditingId(null)
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
            onClick={() => {
              resetForm()
              setShowForm(!showForm)
            }}
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
          <h2 className="text-2xl font-bold">
            {editingId ? 'Edit Portfolio Item' : 'Add New Portfolio Item'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
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

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Images *</label>
                  
                  {/* Image Upload Area */}
                  <div className="border-2 border-dashed border-border rounded-lg p-4 text-center mb-4">
                    <input
                      type="file"
                      id="imageUpload"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                    <label htmlFor="imageUpload" className="cursor-pointer block">
                      {uploading ? (
                        <div className="py-4">
                          <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-2" />
                          <p className="text-primary">Uploading...</p>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-12 h-12 text-foreground/40 mx-auto mb-2" />
                          <span className="text-primary hover:underline">
                            Click to upload images
                          </span>
                          <p className="text-xs text-foreground/60 mt-1">
                            You can select multiple images
                          </p>
                          <p className="text-xs text-foreground/60">
                            Recommended: 1200x800px each
                          </p>
                        </>
                      )}
                    </label>
                  </div>

                  {/* Image Gallery with Drag to Reorder */}
                  {formData.images.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Images ({formData.images.length}) - Drag to reorder
                      </label>
                      <Reorder.Group
                        axis="y"
                        values={formData.images}
                        onReorder={reorderImages}
                        className="space-y-2"
                      >
                        {formData.images.map((image, index) => (
                          <Reorder.Item
                            key={image.url}
                            value={image}
                            className="flex items-center gap-2 p-2 bg-input/50 border border-border rounded-lg"
                          >
                            <div className="cursor-move">
                              <GripVertical size={18} className="text-foreground/40" />
                            </div>
                            
                            <div className="relative w-16 h-12 rounded overflow-hidden flex-shrink-0">
                              <CldImage
                                src={image.url}
                                alt={`Preview ${index + 1}`}
                                width={64}
                                height={48}
                                crop="fill"
                                gravity="auto"
                                className="object-cover"
                              />
                            </div>

                            <input
                              type="text"
                              value={image.caption || ''}
                              onChange={(e) => updateImageCaption(index, e.target.value)}
                              placeholder="Caption (optional)"
                              className="flex-1 px-2 py-1 bg-input border border-border rounded text-sm focus:outline-none focus:border-primary"
                            />

                            <button
                              type="button"
                              onClick={() => setSelectedImageIndex(index)}
                              className="p-1 hover:bg-primary/10 rounded"
                            >
                              <Eye size={16} className="text-foreground/60" />
                            </button>

                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="p-1 hover:bg-red-500/10 rounded"
                            >
                              <X size={16} className="text-red-400" />
                            </button>
                          </Reorder.Item>
                        ))}
                      </Reorder.Group>
                    </div>
                  )}
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
                {editingId ? 'Update Item' : 'Save Item'}
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
                <th className="text-left py-4 px-6 font-semibold">Images</th>
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
                        src={item.images?.[0]?.url || item.imageUrl}
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
                    <div className="flex -space-x-2">
                      {item.images?.slice(0, 4).map((img, i) => (
                        <div
                          key={i}
                          className="relative w-8 h-8 rounded-full border-2 border-background overflow-hidden"
                        >
                          <CldImage
                            src={img.url}
                            alt=""
                            width={32}
                            height={32}
                            crop="fill"
                            gravity="auto"
                            className="object-cover"
                          />
                        </div>
                      ))}
                      {(item.images?.length || 1) > 4 && (
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center border-2 border-background">
                          +{(item.images?.length || 1) - 4}
                        </div>
                      )}
                    </div>
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
                      <button 
                        className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
                        onClick={() => handleEdit(item)}
                      >
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

      {/* Image Preview Modal */}
      {showImagePreview && formData.images[selectedImageIndex] && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative max-w-4xl w-full"
          >
            <button
              onClick={() => setShowImagePreview(false)}
              className="absolute -top-10 right-0 text-white hover:text-primary"
            >
              <X size={24} />
            </button>

            <div className="relative aspect-video rounded-lg overflow-hidden">
              <CldImage
                src={formData.images[selectedImageIndex].url}
                alt="Preview"
                fill
                className="object-contain"
              />
            </div>

            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => setSelectedImageIndex(prev => 
                  prev > 0 ? prev - 1 : formData.images.length - 1
                )}
                className="px-4 py-2 bg-primary/20 text-white rounded-lg hover:bg-primary/30"
              >
                <ChevronLeft size={20} />
              </button>
              
              <span className="text-white">
                {selectedImageIndex + 1} / {formData.images.length}
              </span>
              
              <button
                onClick={() => setSelectedImageIndex(prev => 
                  prev < formData.images.length - 1 ? prev + 1 : 0
                )}
                className="px-4 py-2 bg-primary/20 text-white rounded-lg hover:bg-primary/30"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}