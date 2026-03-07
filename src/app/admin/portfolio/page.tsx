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
  id?: string
  public_id?: string
}

interface PortfolioItem {
  id: string
  title: string
  slug: string
  description: string
  category: "PHOTOGRAPHY" | "VIDEOGRAPHY" | "GRAPHIC_DESIGN"
  images: PortfolioImage[]
  imageUrl: string
  videoUrl: string | null
  thumbnailUrl: string
  featured: boolean
  publishedAt: string | null
  tags: string[]
  views: number
  createdAt: string
}

interface UploadResponse {
  success: boolean
  partial?: boolean
  uploaded?: Array<{
    url: string
    public_id: string
    thumbnail?: string
    width?: number
    height?: number
    format?: string
    original_filename?: string
  }>
  failed?: Array<{
    index: number
    error: string
    original_filename?: string
  }>
  error?: string
  message?: string
}

interface SavedItemResponse {
  id: string
  title: string
  slug: string
  description: string
  category: "PHOTOGRAPHY" | "VIDEOGRAPHY" | "GRAPHIC_DESIGN"
  images: PortfolioImage[]
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
  const [showForm, setShowForm] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>("")
  const [uploading, setUploading] = useState<boolean>(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0)
  const [showImagePreview, setShowImagePreview] = useState<boolean>(false)
  
  const [formData, setFormData] = useState<{
    title: string
    description: string
    category: "PHOTOGRAPHY" | "VIDEOGRAPHY" | "GRAPHIC_DESIGN"
    tags: string
    featured: boolean
    images: PortfolioImage[]
    videoUrl: string
  }>({
    title: "",
    description: "",
    category: "PHOTOGRAPHY",
    tags: "",
    featured: false,
    images: [],
    videoUrl: "",
  })

  useEffect(() => {
    fetchPortfolioItems()
  }, [])

  const fetchPortfolioItems = async (): Promise<void> => {
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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    setError("")
    
    try {
      const formData = new FormData()
      
      // Append all files
      Array.from(files).forEach(file => {
        formData.append('files', file)
      })

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const data: UploadResponse = await response.json()

      if (data.success) {
        // Process successfully uploaded images
        const newImages: PortfolioImage[] = (data.uploaded || []).map((img, index) => ({
          id: img.public_id || `${img.url}-${Date.now()}-${index}`,
          url: img.url,
          thumbnail: img.thumbnail || img.url,
          caption: "",
          order: formData.getAll('files').length + index,
          public_id: img.public_id
        }))

        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...newImages]
        }))

        // Show warning for failed uploads
        if (data.partial && data.failed && data.failed.length > 0) {
          setError(`${data.failed.length} image(s) failed to upload`)
        }
      } else {
        setError(data.error || "Upload failed")
      }
    } catch (err) {
      console.error("Upload error:", err)
      setError("Failed to upload images")
    } finally {
      setUploading(false)
      // Clear the input
      event.target.value = ''
    }
  }

  const removeImage = (index: number): void => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const updateImageCaption = (index: number, caption: string): void => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => 
        i === index ? { ...img, caption } : img
      )
    }))
  }

  const reorderImages = (newOrder: PortfolioImage[]): void => {
    setFormData(prev => ({
      ...prev,
      images: newOrder.map((img, index) => ({ ...img, order: index }))
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    setError("")

    // Validate at least one image
    if (formData.images.length === 0) {
      setError("Please upload at least one image")
      return
    }

    try {
      const tagsArray: string[] = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      
      // Prepare images with order
      const imagesWithOrder: PortfolioImage[] = formData.images.map((img, index) => ({
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
        imageUrl: imagesWithOrder[0]?.url || "",
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
      
      const savedItem: SavedItemResponse = await response.json()
      
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

  const handleEdit = (item: PortfolioItem): void => {
    setFormData({
      title: item.title,
      description: item.description,
      category: item.category,
      tags: item.tags?.join(', ') || '',
      featured: item.featured || false,
      images: item.images?.length ? item.images.map((img, idx) => ({
        ...img,
        id: img.public_id || `${img.url}-${idx}`
      })) : [{ 
        url: item.imageUrl, 
        thumbnail: item.thumbnailUrl,
        caption: "",
        order: 0,
        id: `${item.imageUrl}-0`
      }],
      videoUrl: item.videoUrl || "",
    })
    setEditingId(item.id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: string): Promise<void> => {
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

  const handleTogglePublish = async (id: string, currentlyPublished: boolean): Promise<void> => {
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
      
      const updatedItem: PortfolioItem = await response.json()
      setItems(prev => prev.map(item => item.id === id ? updatedItem : item))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update")
    }
  }

  const resetForm = (): void => {
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

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "Not published"
    return new Date(dateString).toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="p-4 sm:p-6 md:p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-foreground/60">Loading portfolio...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">Portfolio Management</h1>
            <p className="text-foreground/60 text-sm sm:text-base">Manage your portfolio items ({items.length} items)</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              resetForm()
              setShowForm(!showForm)
            }}
            className="flex items-center gap-2 px-4 sm:px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-opacity-90 transition-all w-full sm:w-auto justify-center"
          >
            <Plus size={20} />
            {showForm ? 'Cancel' : 'Add Item'}
          </motion.button>
        </div>
      </motion.div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 sm:p-4"
        >
          <p className="text-red-400 text-sm sm:text-base">{error}</p>
        </motion.div>
      )}

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-xl p-4 sm:p-6 space-y-4 sm:space-y-6"
        >
          <h2 className="text-xl sm:text-2xl font-bold">
            {editingId ? 'Edit Portfolio Item' : 'Add New Portfolio Item'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-3 sm:px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:border-primary text-sm sm:text-base"
                    placeholder="Enter title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value as "PHOTOGRAPHY" | "VIDEOGRAPHY" | "GRAPHIC_DESIGN"})}
                    className="w-full px-3 sm:px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:border-primary text-sm sm:text-base"
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
                    className="w-full px-3 sm:px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:border-primary text-sm sm:text-base"
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
                    className="w-full px-3 sm:px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:border-primary text-sm sm:text-base"
                    placeholder="https://youtube.com/..."
                  />
                </div>
              </div>

              {/* Right Column - Image Upload */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Images *</label>
                  
                  {/* Image Upload Area */}
                  <div className="border-2 border-dashed border-border rounded-lg p-4 sm:p-6 text-center mb-4">
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
                        <div className="py-4 sm:py-6">
                          <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 text-primary animate-spin mx-auto mb-2" />
                          <p className="text-primary text-sm sm:text-base">Uploading...</p>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-10 h-10 sm:w-12 sm:h-12 text-foreground/40 mx-auto mb-2" />
                          <span className="text-primary hover:underline text-sm sm:text-base">
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
                        className="space-y-2 max-h-[400px] overflow-y-auto pr-2"
                      >
                        {formData.images.map((image, index) => {
                          const uniqueKey = image.id || `${image.url}-${index}`
                          
                          return (
                            <Reorder.Item
                              key={uniqueKey}
                              value={image}
                              className="flex items-center gap-2 p-2 bg-input/50 border border-border rounded-lg"
                            >
                              <div className="cursor-move flex-shrink-0">
                                <GripVertical size={18} className="text-foreground/40" />
                              </div>
                              
                              {/* Image Preview */}
                              <div className="relative w-12 h-10 sm:w-16 sm:h-12 rounded overflow-hidden flex-shrink-0 bg-input">
                                {image?.url ? (
                                  <CldImage
                                    src={image.url}
                                    alt={`Preview ${index + 1}`}
                                    width={64}
                                    height={48}
                                    crop="fill"
                                    gravity="auto"
                                    className="object-cover"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none'
                                    }}
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-red-500/10">
                                    <span className="text-xs text-red-400">Error</span>
                                  </div>
                                )}
                              </div>

                              <input
                                type="text"
                                value={image.caption || ''}
                                onChange={(e) => updateImageCaption(index, e.target.value)}
                                placeholder="Caption"
                                className="flex-1 min-w-0 px-2 py-1 bg-input border border-border rounded text-xs sm:text-sm focus:outline-none focus:border-primary"
                              />

                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedImageIndex(index)
                                  setShowImagePreview(true)
                                }}
                                className="p-1 hover:bg-primary/10 rounded flex-shrink-0"
                                disabled={!image?.url}
                              >
                                <Eye size={16} className={image?.url ? "text-foreground/60" : "text-foreground/20"} />
                              </button>

                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="p-1 hover:bg-red-500/10 rounded flex-shrink-0"
                              >
                                <X size={16} className="text-red-400" />
                              </button>
                            </Reorder.Item>
                          )
                        })}
                      </Reorder.Group>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Description - Full Width */}
            <div>
              <label className="block text-sm font-medium mb-2">Description *</label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={4}
                className="w-full px-3 sm:px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:border-primary resize-none text-sm sm:text-base"
                placeholder="Enter description"
              />
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={uploading}
                className="px-4 sm:px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-opacity-90 disabled:opacity-50 text-sm sm:text-base"
              >
                {uploading ? 'Saving...' : (editingId ? 'Update Item' : 'Save Item')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  resetForm()
                }}
                className="px-4 sm:px-6 py-2 border border-border text-foreground rounded-lg hover:border-primary text-sm sm:text-base"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Portfolio Items List - Responsive Cards for Mobile, Table for Desktop */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card border border-border rounded-xl overflow-hidden"
      >
        {/* Mobile View - Cards (hidden on md and up) */}
        <div className="block md:hidden p-4 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-foreground/60">No portfolio items yet</p>
              <p className="text-foreground/40 text-sm mt-2">Click &quot;Add Item&quot; to create your first portfolio item</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="bg-primary/5 rounded-lg p-4 space-y-3 border border-border/50">
                <div className="flex items-start gap-3">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <CldImage
                      src={item.images?.[0]?.url || item.imageUrl}
                      alt={item.title}
                      width={64}
                      height={64}
                      crop="fill"
                      gravity="auto"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">{item.title}</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                        {item.category}
                      </span>
                      {item.featured && (
                        <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-foreground/60">Images</p>
                    <p className="font-medium">{item.images?.length || 1}</p>
                  </div>
                  <div>
                    <p className="text-foreground/60">Views</p>
                    <p className="font-medium">{item.views?.toLocaleString() || 0}</p>
                  </div>
                  <div>
                    <p className="text-foreground/60">Status</p>
                    <button
                      onClick={() => handleTogglePublish(item.id, !!item.publishedAt)}
                      className={`mt-1 px-2 py-0.5 text-xs font-semibold rounded-full flex items-center gap-1 w-fit ${
                        item.publishedAt 
                          ? "bg-green-500/10 text-green-400" 
                          : "bg-yellow-500/10 text-yellow-400"
                      }`}
                    >
                      {item.publishedAt ? (
                        <>
                          <Eye size={10} />
                          Published
                        </>
                      ) : (
                        <>
                          <EyeOff size={10} />
                          Draft
                        </>
                      )}
                    </button>
                  </div>
                  <div>
                    <p className="text-foreground/60">Published</p>
                    <p className="font-medium text-xs">{formatDate(item.publishedAt)}</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-border/50">
                  <button 
                    className="flex-1 flex items-center justify-center gap-1 p-2 hover:bg-primary/10 rounded-lg transition-colors text-xs"
                    onClick={() => window.open(`/portfolio/${item.slug}`, '_blank')}
                  >
                    <Eye size={14} />
                    View
                  </button>
                  <button 
                    className="flex-1 flex items-center justify-center gap-1 p-2 hover:bg-primary/10 rounded-lg transition-colors text-xs"
                    onClick={() => handleEdit(item)}
                  >
                    <Edit2 size={14} />
                    Edit
                  </button>
                  <button 
                    className="flex-1 flex items-center justify-center gap-1 p-2 hover:bg-red-500/10 rounded-lg transition-colors text-xs"
                    onClick={() => handleDelete(item.id)}
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
          <table className="w-full min-w-[800px] lg:min-w-0">
            <thead>
              <tr className="border-b border-border bg-background/50">
                <th className="text-left py-3 sm:py-4 px-4 sm:px-6 font-semibold text-xs sm:text-sm">Preview</th>
                <th className="text-left py-3 sm:py-4 px-4 sm:px-6 font-semibold text-xs sm:text-sm">Title</th>
                <th className="text-left py-3 sm:py-4 px-4 sm:px-6 font-semibold text-xs sm:text-sm">Images</th>
                <th className="text-left py-3 sm:py-4 px-4 sm:px-6 font-semibold text-xs sm:text-sm">Category</th>
                <th className="text-left py-3 sm:py-4 px-4 sm:px-6 font-semibold text-xs sm:text-sm">Status</th>
                <th className="text-left py-3 sm:py-4 px-4 sm:px-6 font-semibold text-xs sm:text-sm">Published</th>
                <th className="text-left py-3 sm:py-4 px-4 sm:px-6 font-semibold text-xs sm:text-sm">Views</th>
                <th className="text-left py-3 sm:py-4 px-4 sm:px-6 font-semibold text-xs sm:text-sm">Actions</th>
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
                  <td className="py-3 sm:py-4 px-4 sm:px-6">
                    <div className="relative w-12 h-10 sm:w-16 sm:h-12 rounded overflow-hidden">
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
                  <td className="py-3 sm:py-4 px-4 sm:px-6">
                    <div className="font-medium text-sm">{item.title}</div>
                    {item.featured && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        Featured
                      </span>
                    )}
                  </td>
                  <td className="py-3 sm:py-4 px-4 sm:px-6">
                    <div className="flex -space-x-2">
                      {(item.images?.length ? item.images : [{ url: item.imageUrl }]).slice(0, 4).map((img, i) => (
                        <div
                          key={i}
                          className="relative w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-background overflow-hidden"
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
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center border-2 border-background">
                          +{(item.images?.length || 1) - 4}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 sm:py-4 px-4 sm:px-6">
                    <span className="px-2 sm:px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full whitespace-nowrap">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-3 sm:py-4 px-4 sm:px-6">
                    <button
                      onClick={() => handleTogglePublish(item.id, !!item.publishedAt)}
                      className={`px-2 sm:px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-1 whitespace-nowrap ${
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
                  <td className="py-3 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm text-foreground/70 whitespace-nowrap">
                    {formatDate(item.publishedAt)}
                  </td>
                  <td className="py-3 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm font-medium">
                    {item.views?.toLocaleString() || 0}
                  </td>
                  <td className="py-3 sm:py-4 px-4 sm:px-6">
                    <div className="flex gap-1 sm:gap-2">
                      <button 
                        className="p-1 sm:p-2 hover:bg-primary/10 rounded-lg transition-colors"
                        onClick={() => window.open(`/portfolio/${item.slug}`, '_blank')}
                        title="View"
                      >
                        <Eye size={16} className="text-foreground/60" />
                      </button>
                      <button 
                        className="p-1 sm:p-2 hover:bg-primary/10 rounded-lg transition-colors"
                        onClick={() => handleEdit(item)}
                        title="Edit"
                      >
                        <Edit2 size={16} className="text-foreground/60" />
                      </button>
                      <button 
                        className="p-1 sm:p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                        onClick={() => handleDelete(item.id)}
                        title="Delete"
                      >
                        <Trash2 size={16} className="text-red-400" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State for Desktop */}
        {items.length === 0 && (
          <div className="hidden md:block text-center py-12">
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
            className="relative w-full max-w-4xl"
          >
            <button
              onClick={() => setShowImagePreview(false)}
              className="absolute -top-8 sm:-top-10 right-0 text-white hover:text-primary z-10"
            >
              <X size={20} className="sm:w-6 sm:h-6" />
            </button>

            <div className="relative aspect-video rounded-lg overflow-hidden">
              <CldImage
                src={formData.images[selectedImageIndex].url}
                alt="Preview"
                fill
                className="object-contain"
              />
            </div>

            <div className="flex justify-between items-center mt-3 sm:mt-4">
              <button
                onClick={() => setSelectedImageIndex((prev: number) => 
                  prev > 0 ? prev - 1 : formData.images.length - 1
                )}
                className="p-2 sm:px-4 sm:py-2 bg-primary/20 text-white rounded-lg hover:bg-primary/30"
              >
                <ChevronLeft size={18} className="sm:w-5 sm:h-5" />
              </button>
              
              <span className="text-white text-sm sm:text-base">
                {selectedImageIndex + 1} / {formData.images.length}
              </span>
              
              <button
                onClick={() => setSelectedImageIndex((prev: number) => 
                  prev < formData.images.length - 1 ? prev + 1 : 0
                )}
                className="p-2 sm:px-4 sm:py-2 bg-primary/20 text-white rounded-lg hover:bg-primary/30"
              >
                <ChevronRight size={18} className="sm:w-5 sm:h-5" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}