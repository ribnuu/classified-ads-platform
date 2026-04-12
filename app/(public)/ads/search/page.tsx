// app/(public)/ads/search/page.tsx

import { searchAds } from "@/actions/search.actions"
import AdGrid from "@/components/ads/AdGrid"

export default async function SearchPage({ searchParams }: { searchParams: { q?: string; page?: string } }) {
  const params = {
    query: searchParams.q,
    page: searchParams.page ? Number(searchParams.page) : 1,
    limit: 20,
  }

  const { ads, pagination } = await searchAds(params)
  const normalizedAds = ads.map((ad) => ({
    ...ad,
    price: Number(ad.price),
  }))

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">{params.query ? `Results for "${params.query}"` : "Browse Ads"}</h1>
      <p className="mb-4 text-gray-600">{pagination.totalCount} results found</p>
      <AdGrid ads={normalizedAds} />
    </div>
  )
}