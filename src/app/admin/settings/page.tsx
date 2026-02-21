"use client"

import { useState, useEffect } from "react"
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
  EyeOff
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
  const [settings, setSettings] = useState<SiteSettings | null>(null)
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

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
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
    } catch (err) {
      setError("Failed to load settings")
    } finally {
      setLoading(false)
    }
  }

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
    } catch (err) {
      setError("Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  const tabs = [
    { id: "general", label: "General", icon: Globe },
    { id: "contact", label: "Contact", icon: Mail },
    { id: "social", label: "Social Media", icon: Instagram },
    { id: "seo", label: "SEO", icon: Search },
    { id: "analytics", label: "Analytics", icon: Code }
  ]

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
        <h1 className="text-4xl font-bold mb-2">Site Settings</h1>
        <p className="text-foreground/60">Configure your website settings and preferences</p>
      </motion.div>

      {/* Success/Error Messages */}
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-3"
        >
          <Check size={20} className="text-green-500" />
          <p className="text-green-500">{success}</p>
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3"
        >
          <AlertCircle size={20} className="text-red-500" />
          <p className="text-red-500">{error}</p>
        </motion.div>
      )}

      {/* Settings Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-xl overflow-hidden"
      >
        {/* Tabs */}
        <div className="border-b border-border bg-background/50 p-4">
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
        <form onSubmit={handleSubmit} className="p-6">
          {/* General Settings */}
          {activeTab === "general" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Site Name</label>
                <input
                  type="text"
                  name="siteName"
                  value={formData.siteName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:border-primary"
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
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:border-primary resize-none"
                  placeholder="Brief description of your website"
                />
              </div>
            </div>
          )}

          {/* Contact Settings */}
          {activeTab === "contact" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                  <Mail size={16} />
                  Contact Email
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:border-primary"
                  placeholder="info@jayarts.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                  <Phone size={16} />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:border-primary"
                  placeholder="+265 123 456 789"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                  <MapPin size={16} />
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:border-primary"
                  placeholder="Lilongwe, Malawi"
                />
              </div>
            </div>
          )}

          {/* Social Media Settings */}
          {activeTab === "social" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                  <Instagram size={16} className="text-pink-500" />
                  Instagram URL
                </label>
                <input
                  type="url"
                  name="social.instagram"
                  value={formData.socialLinks.instagram}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:border-primary"
                  placeholder="https://instagram.com/jayarts"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                  <Facebook size={16} className="text-blue-500" />
                  Facebook URL
                </label>
                <input
                  type="url"
                  name="social.facebook"
                  value={formData.socialLinks.facebook}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:border-primary"
                  placeholder="https://facebook.com/jayarts"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                  <Twitter size={16} className="text-sky-500" />
                  Twitter URL
                </label>
                <input
                  type="url"
                  name="social.twitter"
                  value={formData.socialLinks.twitter}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:border-primary"
                  placeholder="https://twitter.com/jayarts"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                  <Linkedin size={16} className="text-blue-700" />
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  name="social.linkedin"
                  value={formData.socialLinks.linkedin}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:border-primary"
                  placeholder="https://linkedin.com/company/jayarts"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                  <Youtube size={16} className="text-red-500" />
                  YouTube URL
                </label>
                <input
                  type="url"
                  name="social.youtube"
                  value={formData.socialLinks.youtube}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:border-primary"
                  placeholder="https://youtube.com/jayarts"
                />
              </div>
            </div>
          )}

          {/* SEO Settings */}
          {activeTab === "seo" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Meta Title</label>
                <input
                  type="text"
                  name="metaTitle"
                  value={formData.metaTitle}
                  onChange={handleChange}
                  maxLength={60}
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:border-primary"
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
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:border-primary resize-none"
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
                      className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
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
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddKeyword())}
                    className="flex-1 px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:border-primary"
                    placeholder="Add keyword and press Enter"
                  />
                  <button
                    type="button"
                    onClick={handleAddKeyword}
                    className="px-4 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Analytics Settings */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Google Analytics ID</label>
                <div className="relative">
                  <input
                    type={showAnalytics.google ? "text" : "password"}
                    name="googleAnalyticsId"
                    value={formData.googleAnalyticsId}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:border-primary pr-10"
                    placeholder="G-XXXXXXXXXX"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAnalytics(prev => ({ ...prev, google: !prev.google }))}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground/60 hover:text-foreground"
                  >
                    {showAnalytics.google ? <EyeOff size={18} /> : <Eye size={18} />}
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
                    className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:border-primary pr-10"
                    placeholder="XXXXXXXXXXXXXXX"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAnalytics(prev => ({ ...prev, facebook: !prev.facebook }))}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground/60 hover:text-foreground"
                  >
                    {showAnalytics.facebook ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-border">
            <button
              type="button"
              onClick={fetchSettings}
              className="px-4 py-2 border border-border rounded-lg hover:border-primary flex items-center gap-2"
            >
              <RefreshCw size={18} />
              Reset
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-opacity-90 flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Changes
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
        className="bg-card border border-border rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold mb-4">Preview</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Globe className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm text-foreground/60">Site Name</p>
              <p className="font-medium">{formData.siteName || "JayArts Multimedia"}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Mail className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm text-foreground/60">Contact Email</p>
              <p className="font-medium">{formData.contactEmail || "Not set"}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Search className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm text-foreground/60">SEO Title</p>
              <p className="font-medium line-clamp-1">{formData.metaTitle || "Not set"}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}