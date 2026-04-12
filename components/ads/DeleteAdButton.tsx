// components/ads/DeleteAdButton.tsx

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Trash2 } from "lucide-react"
import { deleteAdvertisement } from "@/actions/ad.actions"
import toast from "react-hot-toast"

interface DeleteAdButtonProps {
  adId: string
  adTitle: string
}

export default function DeleteAdButton({ adId, adTitle }: DeleteAdButtonProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    const result = await deleteAdvertisement(adId)
    
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Advertisement deleted")
      setIsOpen(false)
      router.refresh()
    }
    setIsDeleting(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        <Trash2 className="mr-2 h-4 w-4" />Delete
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Advertisement</DialogTitle>
          <DialogDescription>
            {"Are you sure you want to delete “"}{adTitle}{"”? This cannot be undone."}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}