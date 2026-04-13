// proxy.ts

import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function proxy(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    const publicPaths = ["/", "/login", "/ads", "/categories", "/api"]
    if (publicPaths.some((p) => path.startsWith(p))) {
      return NextResponse.next()
    }

    if (path.startsWith("/admin")) {
      if (token?.role !== "MODERATOR") {
        return NextResponse.redirect(new URL("/dashboard", req.url))
      }
    }

    if (path.startsWith("/dashboard")) {
      if (!token) {
        return NextResponse.redirect(new URL("/login", req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const path = req.nextUrl.pathname

        const publicPaths = ["/", "/login", "/ads", "/categories", "/api"]
        if (publicPaths.some((p) => path.startsWith(p))) {
          return true
        }

        if (path.startsWith("/admin")) {
          return token?.role === "MODERATOR"
        }

        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/ads/new",
    "/ads/:id/edit",
  ],
}