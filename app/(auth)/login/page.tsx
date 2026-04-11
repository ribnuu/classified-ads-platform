// app/(auth)/login/page.tsx

'use client'

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FcGoogle } from "react-icons/fc"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>
            Sign in to post ads and manage your listings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
            className="w-full"
            variant="outline"
          >
            <FcGoogle className="mr-2 h-5 w-5" />
            Continue with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}