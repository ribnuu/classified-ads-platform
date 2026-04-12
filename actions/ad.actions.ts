"use server"

import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { adSchema } from "@/lib/validations/ad.schema"

export async function createAdvertisement(formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return { error: "You must be logged in to post an ad" }
  }

  const rawData = {
    title: formData.get("title"),
    description: formData.get("description"),
    price: formData.get("price"),
    categoryId: formData.get("categoryId"),
    locationId: formData.get("locationId"),
    images: JSON.parse(formData.get("images") as string),
  }

  const validatedFields = adSchema.safeParse(rawData)

  if (!validatedFields.success) {
    const errors = validatedFields.error.flatten().fieldErrors
    return { error: "Validation failed", fieldErrors: errors }
  }

  const { title, description, price, categoryId, locationId, images } = validatedFields.data
  const priceValue = parseFloat(price)

  try {
    const ad = await prisma.advertisement.create({
      data: {
        title,
        description,
        price: priceValue,
        categoryId,
        locationId,
        userId: session.user.id,
        status: "PENDING",
        images: {
          create: images.map((filePath: string, index: number) => ({
            filePath,
            isPrimary: index === 0,
          })),
        },
      },
      include: { images: true },
    })

    revalidatePath("/dashboard/my-ads")
    return { success: true, adId: ad.id, message: "Advertisement submitted for review" }
  } catch (error) {
    console.error("Failed to create advertisement:", error)
    return { error: "Failed to create advertisement. Please try again." }
  }
}

export async function deleteAdvertisement(id: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return { error: "Unauthorized" }
  }

  try {
    const ad = await prisma.advertisement.findUnique({
      where: { id },
      select: { userId: true },
    })

    if (!ad || ad.userId !== session.user.id) {
      return { error: "You don't have permission to delete this ad" }
    }

    await prisma.advertisement.delete({ where: { id } })
    revalidatePath("/dashboard/my-ads")
    return { success: true }
  } catch (error) {
    console.error("Failed to delete advertisement:", error)
    return { error: "Failed to delete advertisement" }
  }
}