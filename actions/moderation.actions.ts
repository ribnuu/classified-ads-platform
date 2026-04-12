// actions/moderation.actions.ts

"use server"

import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { sendModerationEmail } from "@/lib/email"

export async function getPendingAds() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user || session.user.role !== "MODERATOR") {
    throw new Error("Unauthorized")
  }

  try {
    const ads = await prisma.advertisement.findMany({
      where: { status: "PENDING" },
      include: {
        user: { select: { id: true, name: true, email: true, createdAt: true } },
        category: { select: { name: true, parent: { select: { name: true } } } },
        location: { select: { name: true } },
        images: { where: { isPrimary: true }, take: 1 },
      },
      orderBy: { createdAt: "asc" },
    })
    return ads
  } catch (error) {
    console.error("Failed to fetch pending ads:", error)
    return []
  }
}

export async function getModerationStats() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user || session.user.role !== "MODERATOR") {
    throw new Error("Unauthorized")
  }

  try {
    const [pending, approved, rejected] = await Promise.all([
      prisma.advertisement.count({ where: { status: "PENDING" } }),
      prisma.advertisement.count({ where: { status: "ACTIVE" } }),
      prisma.advertisement.count({ where: { status: "REJECTED" } }),
    ])

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const approvedToday = await prisma.advertisement.count({
      where: { status: "ACTIVE", updatedAt: { gte: today } },
    })

    return { pending, approved, rejected, approvedToday }
  } catch (error) {
    console.error("Failed to fetch stats:", error)
    return { pending: 0, approved: 0, rejected: 0, approvedToday: 0 }
  }
}

export async function approveAdvertisement(adId: string) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user || session.user.role !== "MODERATOR") {
    return { error: "Unauthorized" }
  }

  try {
    const ad = await prisma.advertisement.update({
      where: { id: adId },
      data: { status: "ACTIVE", rejectionReason: null },
      include: { user: { select: { email: true, name: true } } },
    })

    if (ad.user.email) {
      await sendModerationEmail({
        to: ad.user.email,
        userName: ad.user.name || "User",
        adTitle: ad.title,
        status: "approved",
      })
    }

    revalidatePath("/admin/moderation")
    revalidatePath("/admin")
    revalidatePath("/")
    revalidatePath("/ads/search")
    
    return { success: true, message: `"${ad.title}" has been approved` }
  } catch (error) {
    console.error("Failed to approve ad:", error)
    return { error: "Failed to approve advertisement" }
  }
}

export async function rejectAdvertisement(adId: string, reason: string) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user || session.user.role !== "MODERATOR") {
    return { error: "Unauthorized" }
  }

  if (!reason || reason.trim().length < 10) {
    return { error: "Please provide a rejection reason (minimum 10 characters)" }
  }

  try {
    const ad = await prisma.advertisement.update({
      where: { id: adId },
      data: { status: "REJECTED", rejectionReason: reason },
      include: { user: { select: { email: true, name: true } } },
    })

    if (ad.user.email) {
      await sendModerationEmail({
        to: ad.user.email,
        userName: ad.user.name || "User",
        adTitle: ad.title,
        status: "rejected",
        reason,
      })
    }

    revalidatePath("/admin/moderation")
    revalidatePath("/admin")
    
    return { success: true, message: `"${ad.title}" has been rejected` }
  } catch (error) {
    console.error("Failed to reject ad:", error)
    return { error: "Failed to reject advertisement" }
  }
}

export async function bulkApproveAds(adIds: string[]) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user || session.user.role !== "MODERATOR") {
    return { error: "Unauthorized" }
  }

  try {
    const updates = await Promise.all(
      adIds.map(id => 
        prisma.advertisement.update({
          where: { id },
          data: { status: "ACTIVE" },
          include: { user: { select: { email: true, name: true } } },
        })
      )
    )

    updates.forEach(ad => {
      if (ad.user.email) {
        sendModerationEmail({
          to: ad.user.email,
          userName: ad.user.name || "User",
          adTitle: ad.title,
          status: "approved",
        }).catch(console.error)
      }
    })

    revalidatePath("/admin/moderation")
    revalidatePath("/")
    revalidatePath("/ads/search")
    
    return { success: true, message: `${updates.length} ads approved` }
  } catch (error) {
    console.error("Failed to bulk approve:", error)
    return { error: "Failed to approve ads" }
  }
}