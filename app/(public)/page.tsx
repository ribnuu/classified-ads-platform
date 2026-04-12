// app/(public)/page.tsx

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { getRecentAds, getFeaturedCategories } from "@/actions/search.actions"
import AdCard from "@/components/ads/AdCard"
import { redirect } from "next/navigation"

export const revalidate = 0

export default async function HomePage() {
  const [recentAds, featuredCategories] = await Promise.all([
    getRecentAds(8),
    getFeaturedCategories(),
  ])

  console.log("[HomePage] Rendered with", {
    recentAdsCount: recentAds.length,
    featuredCategoriesCount: featuredCategories.length,
  })

  async function handleSearch(formData: FormData) {
    "use server"
    const query = formData.get("query") as string
    redirect(query ? `/ads/search?q=${encodeURIComponent(query)}` : "/ads/search")
  }

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Find What You Need in Sri Lanka
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Buy and sell everything from cars to furniture
          </p>

          <form action={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  name="query"
                  placeholder="Search for anything..."
                  className="pl-10 py-6 text-lg bg-white"
                />
              </div>
              <Button type="submit" size="lg">
                Search
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Featured Categories */}
      {featuredCategories.length > 0 && (
        <div className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Browse by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {featuredCategories.map((category) => (
                <Link key={category.id} href={`/categories/${category.slug}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer border">
                    <CardContent className="p-4 text-center">
                      <h3 className="font-semibold text-gray-900">{category.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {category._count?.ads || 0} ads
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recent Ads */}
      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Ads</h2>
            <Link href="/ads/search">
              <Button variant="outline">View All</Button>
            </Link>
          </div>
          
          {recentAds.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border">
              <p className="text-gray-500 text-lg">No recent ads available.</p>
              <Link href="/ads/new">
                <Button className="mt-4">Post the First Ad</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentAds.map((ad) => (
                <AdCard 
                  key={ad.id} 
                  id={ad.id}
                  title={ad.title}
                  price={Number(ad.price)}
                  location={ad.location}
                  category={ad.category}
                  images={ad.images}
                  createdAt={ad.createdAt}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-white">Ready to Sell?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Post your ad today and reach thousands of buyers
          </p>
          <Link href="/ads/new">
            <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
              Post a Free Ad
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}