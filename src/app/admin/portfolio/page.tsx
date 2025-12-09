"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, Edit2, Trash2 } from "lucide-react"

const initialPortfolio = [
  { id: 1, title: "Luxury Brand Campaign", category: "Photography", status: "Published" },
  { id: 2, title: "Corporate Documentary", category: "Videography", status: "Published" },
  { id: 3, title: "Brand Identity System", category: "Design", status: "Published" },
]

export default function ManagePortfolio() {
  const [items, setItems] = useState(initialPortfolio)
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="p-8 space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">Portfolio Management</h1>
            <p className="text-foreground/60">Manage your portfolio items</p>
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

      {/* Add Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-effect border border-border rounded-xl p-6 space-y-4"
        >
          <h2 className="text-lg font-bold">Add New Portfolio Item</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Title"
              className="px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:border-primary"
            />
            <select className="px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:border-primary">
              <option>Photography</option>
              <option>Videography</option>
              <option>Design</option>
            </select>
          </div>
          <textarea
            placeholder="Description"
            rows={3}
            className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:border-primary resize-none"
          />
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-opacity-90">
              Save
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-border text-foreground rounded-lg hover:border-primary"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      {/* Portfolio List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-effect border border-border rounded-xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-background/50">
                <th className="text-left py-4 px-6 font-semibold">Title</th>
                <th className="text-left py-4 px-6 font-semibold">Category</th>
                <th className="text-left py-4 px-6 font-semibold">Status</th>
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
                  <td className="py-4 px-6 font-medium">{item.title}</td>
                  <td className="py-4 px-6 text-foreground/70">{item.category}</td>
                  <td className="py-4 px-6">
                    <span className="px-3 py-1 bg-green-500/10 text-green-400 text-xs font-semibold rounded-full">
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-primary/10 rounded-lg transition-colors">
                        <Edit2 size={18} className="text-foreground/60" />
                      </button>
                      <button className="p-2 hover:bg-red-500/10 rounded-lg transition-colors">
                        <Trash2 size={18} className="text-red-400" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
