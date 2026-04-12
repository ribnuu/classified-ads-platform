// components/ads/AdGrid.tsx

import AdCard from "./AdCard"

interface Ad { id: string; title: string; price: number; location: { name: string }; category: { name: string }; images: { filePath: string }[]; createdAt: Date }

export default function AdGrid({ ads }: { ads: Ad[] }) {
  if (ads.length === 0) {
    return <div className="text-center py-12"><p className="text-gray-500 text-lg">No advertisements found</p></div>
  }
  return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">{ads.map(ad => <AdCard key={ad.id} {...ad} />)}</div>
}