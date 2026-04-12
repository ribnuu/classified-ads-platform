import { z } from "zod"

export const adSchema = z.object({
  title: z
    .string()
    .min(10, "Title must be at least 10 characters")
    .max(100, "Title cannot exceed 100 characters"),
  
  description: z
    .string()
    .min(30, "Description must be at least 30 characters")
    .max(2000, "Description cannot exceed 2000 characters"),
  
  price: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Price must be a valid number")
    .refine(val => parseFloat(val) > 0, "Price must be greater than 0")
    .refine(val => parseFloat(val) < 10000000, "Price cannot exceed 10,000,000"),
  
  categoryId: z
    .string()
    .min(1, "Please select a category"),
  
  locationId: z
    .string()
    .min(1, "Please select a location"),
  
  images: z
    .array(z.string())
    .min(1, "At least one image is required")
    .max(5, "Maximum 5 images allowed"),
})

export type AdFormData = z.infer<typeof adSchema>