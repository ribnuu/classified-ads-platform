import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import { existsSync } from "fs"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const files = formData.getAll("files") as File[]
    
    if (files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 })
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json({ error: `File type ${file.type} not allowed` }, { status: 400 })
      }
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json({ error: "File size exceeds 5MB limit" }, { status: 400 })
      }
    }

    const uploadDir = path.join(process.cwd(), "public/uploads")
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    const filePaths: string[] = []

    for (const file of files) {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      
      const timestamp = Date.now()
      const randomString = Math.random().toString(36).substring(2, 8)
      const extension = path.extname(file.name)
      const filename = `${timestamp}-${randomString}${extension}`
      
      const filepath = path.join(uploadDir, filename)
      await writeFile(filepath, buffer)
      
      filePaths.push(`/uploads/${filename}`)
    }

    return NextResponse.json({ success: true, filePaths })

  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}