// actions/search.actions.ts

"use server"

import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"

interface SearchParams {
  query?: string
  categoryId?: string
  locationId?: string
  minPrice?: number
  maxPrice?: number
  page?: number
  limit?: number
}

export async function searchAds(params: SearchParams) {
  const { query, categoryId, locationId, minPrice, maxPrice, page = 1, limit = 20 } = params

  const where: Prisma.AdvertisementWhereInput = { status: "ACTIVE" }

  if (query) {
    where.OR = [
      { title: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
    ]
  }

  if (categoryId) {
    where.categoryId = categoryId
  }

  if (locationId) where.locationId = locationId
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {}
    if (minPrice !== undefined) where.price.gte = minPrice
    if (maxPrice !== undefined) where.price.lte = maxPrice
  }

  const skip = (page - 1) * limit

  try {
    const [ads, totalCount] = await Promise.all([
      prisma.advertisement.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true, title: true, price: true, createdAt: true,
          location: { select: { id: true, name: true, slug: true } },
          category: { 
            select: { 
              id: true, name: true, slug: true,
              parent: { select: { id: true, name: true, slug: true } }
            } 
          },
          images: { where: { isPrimary: true }, take: 1, select: { id: true, filePath: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.advertisement.count({ where }),
    ])

    return {
      ads,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        hasMore: page * limit < totalCount,
      },
    }
  } catch (error) {
    console.error("Search error:", error)
    return { ads: [], pagination: { currentPage: 1, totalPages: 0, totalCount: 0, hasMore: false } }
  }
}

export async function getCategoriesWithHierarchy() {
  try {
    return await prisma.category.findMany({
      where: { parentId: null },
      include: {
        _count: { select: { ads: { where: { status: "ACTIVE" } } } },
        children: {
          orderBy: { name: "asc" },
          include: { _count: { select: { ads: { where: { status: "ACTIVE" } } } },
          },
        },
      },
      orderBy: { name: "asc" },
    })
  } catch { return [] }
}

export async function getAllLocations() {
  try { return await prisma.location.findMany({ orderBy: { name: "asc" } }) } 
  catch { return [] }
}

export async function getRecentAds(limit: number = 8) {
  try {
    return await prisma.advertisement.findMany({
      where: { status: "ACTIVE" },
      select: {
        id: true, title: true, price: true, createdAt: true,
        location: { select: { name: true } },
        category: { select: { name: true, slug: true } },
        images: { where: { isPrimary: true }, take: 1, select: { filePath: true } },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    })
  } catch { return [] }
}

export async function getFeaturedCategories() {
  try {
    const categories = await prisma.category.findMany({
      where: { parentId: null },
      select: {
        id: true,
        name: true,
        slug: true,
        _count: { select: { ads: { where: { status: "ACTIVE" } } } },
        children: {
          select: {
            _count: { select: { ads: { where: { status: "ACTIVE" } } } },
          },
        },
      },
      take: 6,
    })

    return categories
      .map((category) => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        _count: {
          ads:
            category._count.ads +
            category.children.reduce((total, child) => total + child._count.ads, 0),
        },
      }))
      .sort((left, right) => right._count.ads - left._count.ads)
  } catch { return [] }
}