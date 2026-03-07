"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import {
  Save,
  Globe,
  Mail,
  Phone,
  MapPin,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  Search,
  Code,
  RefreshCw,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  Menu
} from "lucide-react"

interface SiteSettings {
  id: string
  siteName: string
  siteDescription: string | null
  contactEmail: string
  phone: string | null
  address: string | null
  socialLinks: {
    instagram?: string
    facebook?: string
    twitter?: string
    linkedin?: string
    youtube?: string
  }
  metaTitle: string | null
  metaDescription: string | null
  keywords: string[]
  googleAnalyticsId: string | null
  facebookPixelId: string | null
  updatedAt: string
}

export default function SettingsPage() {
  const [, setSettings] = useState<SiteSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [activeTab, setActiveTab] = useState("general")
  const [newKeyword, setNewKeyword] = useState("")
  const [showAnalytics, setShowAnalytics] = useState({
    google: false,
    facebook: false
  })
  const [showMobileTabs, setShowMobileTabs] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    siteName: "",
    siteDescription: "",
    contactEmail: "",
    phone: "",
    address: "",
    socialLinks: {
      instagram: "",
      facebook: "",
      twitter: "",
      linkedin: "",
      youtube: ""
    },
    metaTitle: "",
    metaDescription: "",
    keywords: [] as string[],
    googleAnalyticsId: "",
    facebookPixelId: ""
  })

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/settings')
      const data = await response.json()
      
      if (data.success) {
        setSettings(data.data)
        setFormData({
          siteName: data.data.siteName || "",
          siteDescription: data.data.siteDescription || "",
          contactEmail: data.data.contactEmail || "",
          phone: data.data.phone || "",
          address: data.data.address || "",
          socialLinks: {
            instagram: data.data.socialLinks?.instagram || "",
            facebook: data.data.socialLinks?.facebook || "",
            twitter: data.data.socialLinks?.twitter || "",
            linkedin: data.data.socialLinks?.linkedin || "",
            youtube: data.data.socialLinks?.youtube || ""
          },
          metaTitle: data.data.metaTitle || "",
          metaDescription: data.data.metaDescription || "",
          keywords: data.data.keywords || [],
          googleAnalyticsId: data.data.googleAnalyticsId || "",
          facebookPixelId: data.data.facebookPixelId || ""
        })
      } else {
        setError(data.error)
      }
    } catch {
      setError("Failed to load settings")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (name.startsWith('social.')) {
      const social = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [social]: value
        }
      }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleAddKeyword = () => {
    if (newKeyword.trim() && !formData.keywords.includes(newKeyword.trim())) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, newKeyword.trim()]
      }))
      setNewKeyword("")
    }
  }

  const handleRemoveKeyword = (keyword: string) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      
      if (data.success) {
        setSuccess("Settings saved successfully!")
        setTimeout(() => setSuccess(""), 3000)
      } else {
        setError(data.error)
      }
    } catch{
      setError("Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  const tabs = [
    { id: "general", label: "General", icon: Globe },
    { id: "contact", label: "Contact", icon: Mail },
    { id: "social", label: "Social", icon: Instagram },
    { id: "seo", label: "SEO", icon: Search },
    { id: "analytics", label: "Analytics", icon: Code }
  ]

  if (loading) {
    return (
      <div className="p-4 sm:p-6 md:p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-foreground/60">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">Site Settings</h1>
        <p className="text-foreground/60 text-sm sm:text-base">Configure your website settings and preferences</p>
      </motion.div>

      {/* Success/Error Messages */}
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 sm:p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-3"
        >
          <Check size={16} className="sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
          <p className="text-green-500 text-sm sm:text-base">{success}</p>
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 sm:p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3"
        >
          <AlertCircle size={16} className="sm:w-5 sm:h-5 text-red-500 flex-shrink-0" />
          <p className="text-red-500 text-sm sm:text-base">{error}</p>
        </motion.div>
      )}

      {/* Settings Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-xl overflow-hidden"
      >
        {/* Mobile Tabs Dropdown */}
        <div className="sm:hidden border-b border-border bg-background/50 p-4">
          <button
            onClick={() => setShowMobileTabs(!showMobileTabs)}
            className="w-full flex items-center justify-between p-2 bg-primary/10 rounded-lg"
          >
            <div className="flex items-center gap-2">
              {tabs.find(t => t.id === activeTab)?.icon && (
                <span className="text-primary">
                  {(() => {
                    const Icon = tabs.find(t => t.id === activeTab)?.icon
                    return Icon ? <Icon size={18} /> : null
                  })()}
                </span>
              )}
              <span className="font-medium">{tabs.find(t => t.id === activeTab)?.label}</span>
            </div>
            <Menu size={18} className={`transform transition-transform ${showMobileTabs ? 'rotate-180' : ''}`} />
          </button>

          {showMobileTabs && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 space-y-1"
            >
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id)
                      setShowMobileTabs(false)
                    }}
                    className={`w-full flex items-center gap-2 px-4 py-3 rounded-lg transition-all ${
                      activeTab === tab.id
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-primary/10 text-foreground/70"
                    }`}
                  >
                    <Icon size={18} />
                    {tab.label}
                  </button>
                )
              })}
            </motion.div>
          )}
        </div>

        {/* Desktop Tabs */}
        <div className="hidden sm:block border-b border-border bg-background/50 p-4">
          <div className="flex gap-2 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-primary/10 text-foreground/70 hover:text-foreground"
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6">
          {/* General Settings */}
          {activeTab === "general" && (
            <div className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Site Name</label>
                <input
                  type="text"
                  name="siteName"
                  value={formData.siteName}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:border-primary text-sm sm:text-base"
                  placeholder="JayArts Multimedia"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Site Description</label>
                <textarea
                  name="siteDescription"
                  value={formData.siteDescription}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 sm:px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:border-primary resize-none text-sm sm:text-base"
                  placeholder="Brief description of your website"
                />
              </div>
            </div>
          )}

          {/* Contact Settings */}
          {activeTab === "contact" && (
            <div className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                  <Mail size={16} className="text-primary" />
                  <span>Contact Email</span>
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:border-primary text-sm sm:text-base"
                  placeholder="info@jayarts.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                  <Phone size={16} className="text-primary" />
                  <span>Phone Number</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:border-primary text-sm sm:text-base"
                  placeholder="+265 123 456 789"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                  <MapPin size={16} className="text-primary" />
                  <span>Address</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:border-primary text-sm sm:text-base"
                  placeholder="Lilongwe, Malawi"
                />
              </div>
            </div>
          )}

          {/* Social Media Settings */}
          {activeTab === "social" && (
            <div className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                  <Instagram size={16} className="text-pink-500" />
                  <span>Instagram URL</span>
                </label>
                <input
                  type="url"
                  name="social.instagram"
                  value={formData.socialLinks.instagram}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:border-primary text-sm sm:text-base"
                  placeholder="https://instagram.com/jayarts"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                  <Facebook size={16} className="text-blue-500" />
                  <span>Facebook URL</span>
                </label>
                <input
                  type="url"
                  name="social.facebook"
                  value={formData.socialLinks.facebook}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:border-primary text-sm sm:text-base"
                  placeholder="https://facebook.com/jayarts"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                  <Twitter size={16} className="text-sky-500" />
                  <span>Twitter URL</span>
                </label>
                <input
                  type="url"
                  name="social.twitter"
                  value={formData.socialLinks.twitter}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:border-primary text-sm sm:text-base"
                  placeholder="https://twitter.com/jayarts"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                  <Linkedin size={16} className="text-blue-700" />
                  <span>LinkedIn URL</span>
                </label>
                <input
                  type="url"
                  name="social.linkedin"
                  value={formData.socialLinks.linkedin}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:border-primary text-sm sm:text-base"
                  placeholder="https://linkedin.com/company/jayarts"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                  <Youtube size={16} className="text-red-500" />
                  <span>YouTube URL</span>
                </label>
                <input
                  type="url"
                  name="social.youtube"
                  value={formData.socialLinks.youtube}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:border-primary text-sm sm:text-base"
                  placeholder="https://youtube.com/jayarts"
                />
              </div>
            </div>
          )}

          {/* SEO Settings */}
          {activeTab === "seo" && (
            <div className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Meta Title</label>
                <input
                  type="text"
                  name="metaTitle"
                  value={formData.metaTitle}
                  onChange={handleChange}
                  maxLength={60}
                  className="w-full px-3 sm:px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:border-primary text-sm sm:text-base"
                  placeholder="JayArts Multimedia - Professional Creative Services"
                />
                <p className="text-xs text-foreground/60 mt-1">
                  Recommended: 50-60 characters. Current: {formData.metaTitle.length}
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Meta Description</label>
                <textarea
                  name="metaDescription"
                  value={formData.metaDescription}
                  onChange={handleChange}
                  rows={3}
                  maxLength={160}
                  className="w-full px-3 sm:px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:border-primary resize-none text-sm sm:text-base"
                  placeholder="Professional photography, videography, and design services in Malawi"
                />
                <p className="text-xs text-foreground/60 mt-1">
                  Recommended: 150-160 characters. Current: {formData.metaDescription.length}
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Keywords</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.keywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 bg-primary/10 text-primary rounded-full text-xs sm:text-sm"
                    >
                      {keyword}
                      <button
                        type="button"
                        onClick={() => handleRemoveKeyword(keyword)}
                        className="hover:text-primary/70"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddKeyword())}
                    className="w-full sm:flex-1 px-3 sm:px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:border-primary text-sm sm:text-base"
                    placeholder="Add keyword and press Enter"
                  />
                  <button
                    type="button"
                    onClick={handleAddKeyword}
                    className="w-full sm:w-auto px-4 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 text-sm sm:text-base"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Analytics Settings */}
          {activeTab === "analytics" && (
            <div className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Google Analytics ID</label>
                <div className="relative">
                  <input
                    type={showAnalytics.google ? "text" : "password"}
                    name="googleAnalyticsId"
                    value={formData.googleAnalyticsId}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:border-primary pr-10 text-sm sm:text-base"
                    placeholder="G-XXXXXXXXXX"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAnalytics(prev => ({ ...prev, google: !prev.google }))}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground/60 hover:text-foreground"
                  >
                    {showAnalytics.google ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Facebook Pixel ID</label>
                <div className="relative">
                  <input
                    type={showAnalytics.facebook ? "text" : "password"}
                    name="facebookPixelId"
                    value={formData.facebookPixelId}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:border-primary pr-10 text-sm sm:text-base"
                    placeholder="XXXXXXXXXXXXXXX"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAnalytics(prev => ({ ...prev, facebook: !prev.facebook }))}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground/60 hover:text-foreground"
                  >
                    {showAnalytics.facebook ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-6 sm:mt-8 pt-6 border-t border-border">
            <button
              type="button"
              onClick={fetchSettings}
              className="w-full sm:w-auto px-4 py-2 border border-border rounded-lg hover:border-primary flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <RefreshCw size={16} className="sm:w-4 sm:h-4" />
              Reset
            </button>
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-opacity-90 flex items-center justify-center gap-2 disabled:opacity-50 text-sm sm:text-base"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={16} className="sm:w-4 sm:h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>

      {/* Preview Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card border border-border rounded-xl p-4 sm:p-6"
      >
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Preview</h3>
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-start gap-3">
            <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-foreground/60">Site Name</p>
              <p className="font-medium text-sm sm:text-base break-words">{formData.siteName || "JayArts Multimedia"}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-foreground/60">Contact Email</p>
              <p className="font-medium text-sm sm:text-base break-words">{formData.contactEmail || "Not set"}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-foreground/60">SEO Title</p>
              <p className="font-medium text-sm sm:text-base break-words line-clamp-2">{formData.metaTitle || "Not set"}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}