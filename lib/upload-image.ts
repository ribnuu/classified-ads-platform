import { existsSync } from "fs"
import { join } from "path"

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect width="800" height="600" fill="#f3f4f6"/><path d="M320 250h160v110H320z" fill="#d1d5db"/><path d="M270 360l70-80 55 60 35-40 100 60H270z" fill="#cbd5e1"/><circle cx="360" cy="300" r="18" fill="#e5e7eb"/><text x="50%" y="78%" dominant-baseline="middle" text-anchor="middle" fill="#6b7280" font-family="Arial, sans-serif" font-size="28">Image unavailable</text></svg>'
  )

export function getSafeUploadSrc(src?: string | null) {
  if (!src) {
    return PLACEHOLDER_IMAGE
  }

  if (!src.startsWith("/uploads/")) {
    return src
  }

  const filePath = join(process.cwd(), "public", src)
  return existsSync(filePath) ? src : PLACEHOLDER_IMAGE
}