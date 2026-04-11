// middleware.ts

import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Allow public routes
    const publicPaths = ['/', '/login', '/ads', '/categories']
    if (publicPaths.some(p => path.startsWith(p))) {
      return NextResponse.next()
    }

    // Protect admin routes
    if (path.startsWith('/admin') && token?.role !== 'MODERATOR') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const publicPaths = ['/', '/login', '/ads', '/categories']
        if (publicPaths.some(p => req.nextUrl.pathname.startsWith(p))) {
          return true
        }
        return !!token
      },
    },
  }
)

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/ads/new'],
}