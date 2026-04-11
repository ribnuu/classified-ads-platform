// types/next-auth.d.ts

import type { DefaultSession, DefaultUser } from "next-auth"
import type { UserRole } from "@prisma/client"

declare module "next-auth" {
  interface User extends DefaultUser {
    role?: UserRole
  }

  interface Session {
    user: {
      id: string
      role: UserRole
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: UserRole
  }
}