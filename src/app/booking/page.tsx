// app/booking/page.tsx
import { Suspense } from "react"
import BookingContent from "./BookingContent"
import PublicNavBar from "@/components/public/navbar"
import Footer from "@/components/public/footer"

export default function BookingPage() {
  return (
    <Suspense fallback={
      <div className="bg-background text-foreground min-h-screen">
        <PublicNavBar />
        <main className="pt-20">
          <div className="max-w-2xl mx-auto py-20 px-4">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-foreground/60">Loading booking form...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    }>
      <BookingContent />
    </Suspense>
  )
}