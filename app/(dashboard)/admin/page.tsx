// app/(dashboard)/admin/page.tsx

import { getModerationStats, getPendingAds } from "@/actions/moderation.actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, CheckCircle, XCircle, TrendingUp } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function AdminDashboardPage() {
  const stats = await getModerationStats()
  const pendingAds = await getPendingAds()
  const recentPending = pendingAds.slice(0, 5)

  const statCards = [
    { title: "Pending Review", value: stats.pending, icon: Clock, color: "text-yellow-600", bgColor: "bg-yellow-100", href: "/admin/moderation" },
    { title: "Total Approved", value: stats.approved, icon: CheckCircle, color: "text-green-600", bgColor: "bg-green-100", href: "/admin/approved" },
    { title: "Total Rejected", value: stats.rejected, icon: XCircle, color: "text-red-600", bgColor: "bg-red-100", href: "/admin/rejected" },
    { title: "Approved Today", value: stats.approvedToday, icon: TrendingUp, color: "text-blue-600", bgColor: "bg-blue-100" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of platform activity and moderation queue</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon
          const card = (
            <Card key={stat.title} className={stat.href ? "hover:shadow-lg transition-shadow" : ""}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`p-2 rounded-full ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          )
          return stat.href ? <Link key={stat.title} href={stat.href}>{card}</Link> : card
        })}
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Recent Pending Advertisements</CardTitle>
            {stats.pending > 0 && (
              <Link href="/admin/moderation">
                <Button variant="outline" size="sm">View All ({stats.pending})</Button>
              </Link>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {recentPending.length > 0 ? (
            <div className="space-y-4">
              {recentPending.map((ad) => (
                <div key={ad.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                  <div className="flex-1">
                    <p className="font-medium">{ad.title}</p>
                    <p className="text-sm text-gray-600">
                      {ad.category.parent?.name} &gt; {ad.category.name} • {ad.location.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Posted by {ad.user.name || "Anonymous"} • {new Date(ad.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-lg mr-4">Rs. {Number(ad.price).toLocaleString()}</p>
                    <Link href={`/admin/moderation`}>
                      <Button size="sm">Review</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No pending ads to review</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}