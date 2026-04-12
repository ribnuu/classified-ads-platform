// app/(dashboard)/ads/new/page.tsx

import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import AdForm from "@/components/ads/AdForm"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function NewAdPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect("/login")
  }

  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } })
  const locations = await prisma.location.findMany({ orderBy: { name: "asc" } })

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Post a New Advertisement</CardTitle>
          <CardDescription>All ads are reviewed before going live.</CardDescription>
        </CardHeader>
        <CardContent>
          <AdForm categories={categories} locations={locations} />
        </CardContent>
      </Card>
    </div>
  )
}