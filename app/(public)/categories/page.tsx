// app/(public)/categories/page.tsx

import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Card, CardContent } from "@/components/ui/card"

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    where: { parentId: null },
    include: {
      _count: { select: { ads: { where: { status: "ACTIVE" } } } },
      children: {
        include: { _count: { select: { ads: { where: { status: "ACTIVE" } } } } }
      }
    },
    orderBy: { name: "asc" }
  })

  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-2">Browse Categories</h1>
      <p className="text-gray-600 mb-8">Find what you're looking for</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((parentCategory) => (
          <div key={parentCategory.id} className="space-y-2">
            <Card className="hover:shadow-lg hover:border-primary transition-all h-full">
              <CardContent className="p-6">
                <Link href={`/categories/${parentCategory.slug}`} className="inline-block mb-4">
                  <h2 className="text-xl font-bold text-gray-900 hover:text-primary">{parentCategory.name}</h2>
                </Link>
                <div className="space-y-2">
                  {parentCategory.children.length > 0 ? (
                    parentCategory.children.map((child) => (
                      <Link
                        key={child.id}
                        href={`/ads/search?category=${child.id}`}
                        className="block text-sm text-gray-600 hover:text-primary"
                      >
                        {child.name} <span className="text-xs text-gray-400">({child._count.ads})</span>
                      </Link>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No subcategories</p>
                  )}
                </div>
                <p className="text-sm font-medium text-primary mt-4">
                  {parentCategory._count.ads + parentCategory.children.reduce((total, child) => total + child._count.ads, 0)} ads
                </p>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No categories available</p>
        </div>
      )}
    </main>
  )
}
