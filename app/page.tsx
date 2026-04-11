// app/page.tsx

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Classified Ads Platform
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Buy and sell items in your area
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/ads/search">
              <Button size="lg">Browse Ads</Button>
            </Link>
            <Link href="/ads/new">
              <Button size="lg" variant="outline">Post Ad</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}