"use client"

import { motion } from "framer-motion"
import { Check, Trash2 } from "lucide-react"

const inquiries = [
  { id: 1, name: "John Smith", email: "john@example.com", subject: "Portfolio Inquiry", date: "Dec 2", status: "New" },
  {
    id: 2,
    name: "Lisa Wong",
    email: "lisa@example.com",
    subject: "Service Question",
    date: "Dec 1",
    status: "Resolved",
  },
]

export default function ManageInquiries() {
  return (
    <div className="p-8 space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div>
          <h1 className="text-4xl font-bold mb-2">Inquiries</h1>
          <p className="text-foreground/60">Manage contact form submissions</p>
        </div>
      </motion.div>

      {/* Inquiries Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-effect border border-border rounded-xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-background/50">
                <th className="text-left py-4 px-6 font-semibold">Name</th>
                <th className="text-left py-4 px-6 font-semibold">Email</th>
                <th className="text-left py-4 px-6 font-semibold">Subject</th>
                <th className="text-left py-4 px-6 font-semibold">Date</th>
                <th className="text-left py-4 px-6 font-semibold">Status</th>
                <th className="text-left py-4 px-6 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((inquiry, idx) => (
                <motion.tr
                  key={inquiry.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="border-b border-border/50 hover:bg-primary/5 transition-colors"
                >
                  <td className="py-4 px-6 font-medium">{inquiry.name}</td>
                  <td className="py-4 px-6 text-foreground/70 text-sm">{inquiry.email}</td>
                  <td className="py-4 px-6 text-foreground/70">{inquiry.subject}</td>
                  <td className="py-4 px-6 text-foreground/70 text-sm">{inquiry.date}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        inquiry.status === "New" ? "bg-blue-500/10 text-blue-400" : "bg-green-500/10 text-green-400"
                      }`}
                    >
                      {inquiry.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-green-500/10 rounded-lg transition-colors">
                        <Check size={18} className="text-green-400" />
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
