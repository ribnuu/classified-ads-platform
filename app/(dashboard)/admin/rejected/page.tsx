// app/(dashboard)/admin/rejected/page.tsx

import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

export default async function RejectedAdsPage() {
  const ads = await prisma.advertisement.findMany({
    where: { status: "REJECTED" },
    include: {
      user: { select: { name: true } },
      category: { select: { name: true } },
      location: { select: { name: true } },
      images: { where: { isPrimary: true }, take: 1 },
    },
    orderBy: { updatedAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Rejected Advertisements</h1>
        <p className="text-gray-600 mt-1">{ads.length} rejected ads</p>
      </div>

      <Card>
        <CardHeader><CardTitle>Rejected Ads</CardTitle></CardHeader>
        <CardContent>
          {ads.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No rejected ads</p>
          ) : (
            <div className="space-y-4">
              {ads.map((ad) => (
                <div key={ad.id} className="space-y-2 border-b pb-4 last:border-0">
                  <div className="flex items-center gap-4">
                    {ad.images[0] && <Image src={ad.images[0].filePath} alt={ad.title} width={60} height={60} className="rounded object-cover" />}
                    <div className="flex-1">
                      <p className="font-medium">{ad.title}</p>
                      <p className="text-sm text-gray-600">{ad.category.name} • {ad.location.name}</p>
                    </div>
                    <p className="font-bold">Rs. {Number(ad.price).toLocaleString()}</p>
                  </div>
                  {ad.rejectionReason && (
                    <div className="bg-red-50 border border-red-200 rounded p-3 ml-[76px]">
                      <p className="text-sm text-red-800"><strong>Reason:</strong> {ad.rejectionReason}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}