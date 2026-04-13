// app/(dashboard)/ads/[id]/edit/page.tsx

import { getServerSession } from "next-auth"
import { notFound, redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import EditAdForm from "@/components/ads/EditAdForm"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function EditAdPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/login")
  }

  const { id } = await params

  const ad = await prisma.advertisement.findUnique({
    where: { id },
    include: {
      images: true,
    },
  })

  if (!ad || ad.userId !== session.user.id) {
    notFound()
  }

  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } })
  const locations = await prisma.location.findMany({ orderBy: { name: "asc" } })

  const serializedAd = {
    ...ad,
    price: ad.price.toString(),
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Edit Advertisement</CardTitle>
          <CardDescription>Update your listing and submit it for review again.</CardDescription>
        </CardHeader>
        <CardContent>
          <EditAdForm ad={serializedAd} categories={categories} locations={locations} />
        </CardContent>
      </Card>
    </div>
  )
}
