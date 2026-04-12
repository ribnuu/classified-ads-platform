// app/(dashboard)/admin/moderation/page.tsx

import { getPendingAds } from "@/actions/moderation.actions"
import ModerationQueue from "@/components/admin/ModerationQueue"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function ModerationPage() {
  const pendingAds = await getPendingAds()
  const normalizedPendingAds = pendingAds.map((ad) => ({
    ...ad,
    price: Number(ad.price),
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Moderation Queue</h1>
        <p className="text-gray-600 mt-1">Review and moderate pending advertisements</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Advertisements ({normalizedPendingAds.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <ModerationQueue ads={normalizedPendingAds} />
        </CardContent>
      </Card>
    </div>
  )
}