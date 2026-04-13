// app/(dashboard)/admin/approved/page.tsx

import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { getSafeUploadSrc } from "@/lib/upload-image"

export default async function ApprovedAdsPage() {
  const ads = await prisma.advertisement.findMany({
    where: { status: "ACTIVE" },
    include: {
      user: { select: { name: true } },
      category: { select: { name: true } },
      location: { select: { name: true } },
      images: { where: { isPrimary: true }, take: 1 },
    },
    orderBy: { updatedAt: "desc" },
  })

  const normalizedAds = ads.map((ad) => ({
    ...ad,
    price: Number(ad.price),
    images: ad.images.map((image) => ({
      ...image,
      filePath: getSafeUploadSrc(image.filePath),
    })),
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Approved Advertisements</h1>
        <p className="text-gray-600 mt-1">{normalizedAds.length} active ads on the platform</p>
      </div>

      <Card>
        <CardHeader><CardTitle>Active Ads</CardTitle></CardHeader>
        <CardContent>
          {normalizedAds.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No approved ads yet</p>
          ) : (
            <div className="space-y-4">
              {normalizedAds.map((ad) => (
                <div key={ad.id} className="flex items-center gap-4 border-b pb-4 last:border-0">
                  {ad.images[0] && <Image src={ad.images[0].filePath} alt={ad.title} width={60} height={60} className="rounded object-cover" />}
                  <div className="flex-1">
                    <p className="font-medium">{ad.title}</p>
                    <p className="text-sm text-gray-600">{ad.category.name} • {ad.location.name}</p>
                  </div>
                  <p className="font-bold">Rs. {Number(ad.price).toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}