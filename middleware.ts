// middleware.ts

import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Public routes - accessible to everyone
    const publicPaths = ["/", "/login", "/ads", "/categories", "/api"]
    if (publicPaths.some(p => path.startsWith(p))) {
      return NextResponse.next()
    }

    // Admin routes - only for MODERATOR role
    if (path.startsWith("/admin")) {
      if (token?.role !== "MODERATOR") {
        return NextResponse.redirect(new URL("/dashboard", req.url))
      }
    }

    // Protected routes - require authentication
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
        
        // Public routes don't require authentication
        const publicPaths = ["/", "/login", "/ads", "/categories", "/api"]
        if (publicPaths.some(p => path.startsWith(p))) {
          return true
        }
        
        // Admin routes require MODERATOR role
        if (path.startsWith("/admin")) {
          return token?.role === "MODERATOR"
        }
        
        // Other routes require authentication
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