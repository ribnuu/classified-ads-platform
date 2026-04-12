// app/(dashboard)/ads/my-ads/page.tsx

import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Plus } from "lucide-react"
import DeleteAdButton from "@/components/ads/DeleteAdButton"

export default async function MyAdsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect("/login")
  }

  const ads = await prisma.advertisement.findMany({
    where: { userId: session.user.id },
    include: {
      category: { select: { name: true } },
      location: { select: { name: true } },
      images: { where: { isPrimary: true }, take: 1 },
    },
    orderBy: { createdAt: "desc" },
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING": return <Badge variant="secondary">Pending Review</Badge>
      case "ACTIVE": return <Badge className="bg-green-500">Active</Badge>
      case "REJECTED": return <Badge variant="destructive">Rejected</Badge>
      default: return null
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Advertisements</h1>
        <Link href="/ads/new">
          <Button><Plus className="mr-2 h-4 w-4" />Post New Ad</Button>
        </Link>
      </div>

      {ads.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500 mb-4">You haven't posted any ads yet</p>
            <Link href="/ads/new"><Button>Post Your First Ad</Button></Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {ads.map((ad) => (
            <Card key={ad.id} className="overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-48 h-48 relative bg-gray-100">
                  {ad.images[0] ? (
                    <Image src={ad.images[0].filePath} alt={ad.title} fill className="object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <span className="text-gray-400">No image</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-semibold">{ad.title}</h3>
                      <p className="text-2xl font-bold text-primary">Rs. {ad.price.toLocaleString()}</p>
                    </div>
                    {getStatusBadge(ad.status)}
                  </div>

                  <div className="space-y-1 text-sm text-gray-600 mb-4">
                    <p>Category: {ad.category.name}</p>
                    <p>Location: {ad.location.name}</p>
                    <p>Posted: {formatDistanceToNow(new Date(ad.createdAt))} ago</p>
                  </div>

                  {ad.status === "REJECTED" && ad.rejectionReason && (
                    <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
                      <p className="text-sm text-red-800"><strong>Reason:</strong> {ad.rejectionReason}</p>
                    </div>
                  )}

                  <DeleteAdButton adId={ad.id} adTitle={ad.title} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}