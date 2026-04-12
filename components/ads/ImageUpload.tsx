"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { X, Upload } from "lucide-react"
import Image from "next/image"
import toast from "react-hot-toast"

interface ImageUploadProps {
  value: string[]
  onChange: (value: string[]) => void
  maxFiles?: number
}

export default function ImageUpload({ value = [], onChange, maxFiles = 5 }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (value.length + acceptedFiles.length > maxFiles) {
      toast.error(`You can only upload up to ${maxFiles} images`)
      return
    }

    setIsUploading(true)
    
    try {
      const formData = new FormData()
      acceptedFiles.forEach((file) => formData.append("files", file))

      const response = await fetch("/api/upload", { method: "POST", body: formData })

      if (!response.ok) throw new Error("Upload failed")

      const data = await response.json()
      
      if (data.filePaths) {
        onChange([...value, ...data.filePaths])
        toast.success(`Uploaded ${acceptedFiles.length} image(s)`)
      }
    } catch {
      toast.error("Failed to upload images")
    } finally {
      setIsUploading(false)
    }
  }, [value, onChange, maxFiles])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp", ".gif"] },
    maxSize: 5 * 1024 * 1024,
    disabled: isUploading || value.length >= maxFiles,
  })

  const removeImage = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? "border-primary bg-primary/10" : "border-gray-300 hover:border-primary"}
          ${value.length >= maxFiles ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <input {...getInputProps()} />
        <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
        {isDragActive ? (
          <p>Drop the images here...</p>
        ) : (
          <>
            <p>{isUploading ? "Uploading..." : "Drag & drop images here"}</p>
            <p className="text-sm text-gray-500">or click to select files</p>
            <p className="text-xs text-gray-400">JPG, PNG, WebP, GIF up to 5MB</p>
          </>
        )}
      </div>

      {value.length > 0 && (
        <div className="grid grid-cols-5 gap-2">
          {value.map((imagePath, index) => (
            <div key={index} className="relative aspect-square rounded-lg overflow-hidden border">
              <Image src={imagePath} alt={`Upload ${index + 1}`} fill className="object-cover" />
              <button
                type="button"
                onClick={() => removeImage(index)}
                title={`Remove image ${index + 1}`}
                aria-label={`Remove image ${index + 1}`}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <X className="h-3 w-3" />
              </button>
              {index === 0 && (
                <span className="absolute bottom-1 left-1 bg-primary text-white text-xs px-1 rounded">Cover</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}