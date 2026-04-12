// components/admin/AdminNav.tsx

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Clock, CheckCircle, XCircle } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Pending Approval", href: "/admin/moderation", icon: Clock },
  { name: "Approved Ads", href: "/admin/approved", icon: CheckCircle },
  { name: "Rejected Ads", href: "/admin/rejected", icon: XCircle },
]

export default function AdminNav() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-white border-r min-h-[calc(100vh-4rem)] sticky top-16">
      <nav className="p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                ${isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "text-gray-700 hover:bg-gray-100"}`}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}