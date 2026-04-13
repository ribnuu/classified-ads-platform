// app/(public)/ads/[id]/page.tsx

import { getServerSession } from "next-auth"
import Link from "next/link"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import Image from "next/image"
import { MapPin, Calendar } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Button } from "@/components/ui/button"
import { getSafeUploadSrc } from "@/lib/upload-image"

export default async function AdDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  const isAuthenticated = !!session?.user
  const { id } = await params

  const ad = await prisma.advertisement.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, email: true, createdAt: true } },
      category: { select: { name: true } },
      location: { select: { name: true } },
      images: true,
    },
  })

  if (!ad || ad.status !== "ACTIVE") {
    notFound()
  }

  const safeImages = ad.images.map((image) => ({
    ...image,
    filePath: getSafeUploadSrc(image.filePath),
  }))

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-2">{ad.title}</h1>
      <p className="text-4xl font-bold text-primary mb-4">Rs. {ad.price.toLocaleString()}</p>
      
      <div className="flex gap-4 text-sm text-gray-600 mb-6">
        <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{ad.location.name}</span>
        <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />Posted {formatDistanceToNow(new Date(ad.createdAt))} ago</span>
      </div>

      {safeImages.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mb-6">
          {safeImages.map((img) => (
            <Image
              key={img.id}
              src={img.filePath}
              alt={ad.title}
              width={400}
              height={300}
              className="rounded object-cover w-full h-auto"
            />
          ))}
        </div>
      )}

      <div className="prose max-w-none mb-6">
        <h3 className="text-lg font-semibold mb-2">Description</h3>
        <p className="whitespace-pre-wrap">{ad.description}</p>
      </div>

      {isAuthenticated ? (
        <div className="border-t pt-4">
          <p className="font-semibold">Seller: {ad.user.name || "Anonymous"}</p>
          {ad.user.email && <p className="text-sm text-gray-600">Email: {ad.user.email}</p>}
          <p className="text-sm text-gray-600">Member since {formatDistanceToNow(new Date(ad.user.createdAt))} ago</p>
        </div>
      ) : (
        <div className="border-t pt-6 mt-6">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Want to contact the seller?</h3>
            <p className="text-gray-600 mb-4">Sign in to view seller information and contact details.</p>
            <Link href={`/login?callbackUrl=/ads/${id}`}>
              <Button size="lg">Sign In to Continue</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}