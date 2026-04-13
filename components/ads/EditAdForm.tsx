// components/ads/EditAdForm.tsx

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Controller, useForm, type Path } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { adSchema, type AdFormData } from "@/lib/validations/ad.schema"
import { updateAdvertisement } from "@/actions/ad.actions"
import ImageUpload from "./ImageUpload"
import toast from "react-hot-toast"

interface Category {
  id: string
  name: string
  parentId: string | null
}

interface Location {
  id: string
  name: string
}

interface EditAdFormProps {
  ad: {
    id: string
    title: string
    description: string
    price: unknown
    categoryId: string
    locationId: string
    images: { id: string; filePath: string }[]
  }
  categories: Category[]
  locations: Location[]
}

export default function EditAdForm({ ad, categories, locations }: EditAdFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [selectedParentCategory, setSelectedParentCategory] = useState<string>("")

  const form = useForm<AdFormData>({
    resolver: zodResolver(adSchema),
    defaultValues: {
      title: ad.title,
      description: ad.description,
      price: String(ad.price),
      categoryId: ad.categoryId,
      locationId: ad.locationId,
      images: ad.images.map((image) => image.filePath),
    },
  })

  useEffect(() => {
    const existingImages = ad.images.map((image) => image.filePath)
    setUploadedImages(existingImages)
    form.setValue("images", existingImages)
  }, [ad.images, form])

  useEffect(() => {
    form.setValue("images", uploadedImages)
  }, [uploadedImages, form])

  useEffect(() => {
    const currentCategory = categories.find((category) => category.id === ad.categoryId)
    if (currentCategory?.parentId) {
      setSelectedParentCategory(currentCategory.parentId)
    } else if (currentCategory) {
      setSelectedParentCategory(currentCategory.id)
    }
  }, [ad.categoryId, categories])

  async function onSubmit(data: AdFormData) {
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("title", data.title)
      formData.append("description", data.description)
      formData.append("price", data.price.toString())
      formData.append("categoryId", data.categoryId)
      formData.append("locationId", data.locationId)
      formData.append("images", JSON.stringify(data.images))

      const result = await updateAdvertisement(ad.id, formData)

      if (result.error) {
        toast.error(result.error)
        if (result.fieldErrors) {
          Object.entries(result.fieldErrors).forEach(([field, errors]) => {
            if (errors?.[0]) {
              form.setError(field as Path<AdFormData>, { type: "manual", message: errors[0] })
            }
          })
        }
      } else {
        toast.success("Advertisement updated and submitted for review!")
        router.push("/dashboard/my-ads")
      }
    } catch {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const parentCategories = categories.filter((category) => !category.parentId)
  const getSubcategories = (parentId: string) => categories.filter((category) => category.parentId === parentId)
  const selectedParentCategoryName = parentCategories.find((category) => category.id === selectedParentCategory)?.name

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Controller
        control={form.control}
        name="title"
        render={({ field }) => (
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input placeholder="e.g., iPhone 13 Pro Max - Excellent Condition" {...field} />
            <p className="text-sm text-muted-foreground">10-100 characters</p>
            {form.formState.errors.title?.message && (
              <p className="text-sm font-medium text-destructive">{form.formState.errors.title.message}</p>
            )}
          </div>
        )}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Main Category</label>
          <Select
            value={selectedParentCategory}
            onValueChange={(value: string | null) => {
              if (!value) return
              setSelectedParentCategory(value)
              form.setValue("categoryId", "")
            }}
          >
            <SelectTrigger>
              <span className={selectedParentCategoryName ? "text-foreground" : "text-muted-foreground"}>
                {selectedParentCategoryName ?? "Select main category"}
              </span>
            </SelectTrigger>
            <SelectContent>
              {parentCategories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Controller
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <div className="space-y-2">
              <label className="text-sm font-medium">Subcategory</label>
              <Select onValueChange={field.onChange} value={field.value} disabled={!selectedParentCategory}>
                <SelectTrigger>
                  <span className={field.value ? "text-foreground" : "text-muted-foreground"}>
                    {categories.find((category) => category.id === field.value)?.name ?? "Select subcategory"}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  {selectedParentCategory && getSubcategories(selectedParentCategory).map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.categoryId?.message && (
                <p className="text-sm font-medium text-destructive">{form.formState.errors.categoryId.message}</p>
              )}
            </div>
          )}
        />
      </div>

      <Controller
        control={form.control}
        name="price"
        render={({ field }) => (
          <div className="space-y-2">
            <label className="text-sm font-medium">Price (LKR)</label>
            <Input type="text" placeholder="e.g., 50000" {...field} />
            {form.formState.errors.price?.message && (
              <p className="text-sm font-medium text-destructive">{form.formState.errors.price.message}</p>
            )}
          </div>
        )}
      />

      <Controller
        control={form.control}
        name="locationId"
        render={({ field }) => (
          <div className="space-y-2">
            <label className="text-sm font-medium">Location</label>
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger>
                <span className={field.value ? "text-foreground" : "text-muted-foreground"}>
                  {locations.find((location) => location.id === field.value)?.name ?? "Select your location"}
                </span>
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location.id} value={location.id}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.locationId?.message && (
              <p className="text-sm font-medium text-destructive">{form.formState.errors.locationId.message}</p>
            )}
          </div>
        )}
      />

      <Controller
        control={form.control}
        name="description"
        render={({ field }) => (
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea placeholder="Describe your item in detail..." className="min-h-[150px]" {...field} />
            <p className="text-sm text-muted-foreground">Minimum 30 characters</p>
            {form.formState.errors.description?.message && (
              <p className="text-sm font-medium text-destructive">{form.formState.errors.description.message}</p>
            )}
          </div>
        )}
      />

      <div className="space-y-2">
        <label className="text-sm font-medium">Images</label>
        <ImageUpload value={uploadedImages} onChange={setUploadedImages} maxFiles={5} />
        <p className="text-sm text-muted-foreground">Add or remove images. First image will be the cover.</p>
        {form.formState.errors.images?.message && (
          <p className="text-sm font-medium text-destructive">{form.formState.errors.images.message}</p>
        )}
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? "Updating..." : "Update Advertisement"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
