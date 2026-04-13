// components/layout/Header.tsx

'use client'

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Menu, X, LogOut, LayoutDashboard, Shield } from "lucide-react"
import { useState } from "react"

export default function Header() {
  const { data: session } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 bg-white border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="font-bold text-xl text-primary shrink-0">
            ClassifiedAds
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4 ml-auto">
            <Link href="/categories" className="text-gray-700 hover:text-primary transition-colors">
              Categories
            </Link>
            <Link href="/ads/search" className="text-gray-700 hover:text-primary transition-colors">
              Browse
            </Link>

            {session?.user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="outline" size="sm">
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>

                {session.user.role === "MODERATOR" && (
                  <Link href="/admin">
                    <Button variant="outline" size="sm">
                      <Shield className="h-4 w-4 mr-2" />
                      Admin
                    </Button>
                  </Link>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <nav className="container mx-auto px-4 py-4 space-y-2">
            <Link href="/categories" onClick={() => setIsMenuOpen(false)}>
              <div className="px-3 py-2 rounded hover:bg-gray-100 cursor-pointer">
                Categories
              </div>
            </Link>
            <Link href="/ads/search" onClick={() => setIsMenuOpen(false)}>
              <div className="px-3 py-2 rounded hover:bg-gray-100 cursor-pointer">
                Browse Ads
              </div>
            </Link>

            {session?.user ? (
              <>
                <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                  <div className="px-3 py-2 rounded hover:bg-gray-100 cursor-pointer flex items-center gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </div>
                </Link>

                {session.user.role === "MODERATOR" && (
                  <Link href="/admin" onClick={() => setIsMenuOpen(false)}>
                    <div className="px-3 py-2 rounded hover:bg-gray-100 cursor-pointer flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Admin
                    </div>
                  </Link>
                )}

                <button
                  className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 flex items-center gap-2"
                  onClick={() => {
                    signOut({ callbackUrl: "/" })
                    setIsMenuOpen(false)
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                  <div className="px-3 py-2 rounded hover:bg-gray-100 cursor-pointer">
                    Sign In
                  </div>
                </Link>
                <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                  <div className="px-3 py-2 rounded hover:bg-gray-100 cursor-pointer font-medium">
                    Sign Up
                  </div>
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
