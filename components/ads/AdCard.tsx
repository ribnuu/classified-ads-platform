// components/ads/AdCard.tsx

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Clock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface AdCardProps {
  id: string
  title: string
  price: number
  location: { name: string }
  category: { name: string }
  images: { filePath: string }[]
  createdAt: Date
}

export default function AdCard({ id, title, price, location, category, images, createdAt }: AdCardProps) {
  return (
    <Link href={`/ads/${id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
        <div className="relative aspect-square bg-gray-100">
          {images[0] ? (
            <Image src={images[0].filePath} alt={title} fill className="object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full">
              <span className="text-gray-400">No image</span>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-1 line-clamp-1">{title}</h3>
          <p className="text-2xl font-bold text-primary mb-2">Rs. {price.toLocaleString()}</p>
          <p className="text-sm text-gray-600 mb-1">{category.name}</p>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{location.name}</span>
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{formatDistanceToNow(new Date(createdAt))} ago</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}