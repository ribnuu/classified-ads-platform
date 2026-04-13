// app/(public)/categories/[slug]/page.tsx

import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const category = await prisma.category.findFirst({
    where: { slug },
    include: {
      children: {
        include: {
          _count: { select: { ads: { where: { status: "ACTIVE" } } } },
        },
        orderBy: { name: "asc" },
      },
    },
  })

  if (!category) {
    notFound()
  }

  if (category.parentId) {
    redirect(`/ads/search?category=${category.id}`)
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
      <p className="text-gray-600 mb-6">Choose a subcategory to browse active ads</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {category.children.map((child) => (
          <Link key={child.id} href={`/ads/search?category=${child.id}`}>
            <Card className="hover:shadow-lg hover:border-primary transition-all cursor-pointer">
              <CardContent className="p-5">
                <h2 className="font-semibold text-lg">{child.name}</h2>
                <p className="text-sm text-gray-500 mt-1">{child._count.ads} active ads</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-6">
        <Link href="/categories">
          <Button variant="outline">Back to Categories</Button>
        </Link>
      </div>
    </main>
  )
}
