// components/admin/ModerationQueue.tsx

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckCircle, XCircle, Eye, User, MapPin, AlertCircle } from "lucide-react"
import { approveAdvertisement, rejectAdvertisement, bulkApproveAds } from "@/actions/moderation.actions"
import toast from "react-hot-toast"

interface Ad {
  id: string
  title: string
  description: string
  price: number
  createdAt: Date
  user: { id: string; name: string | null; email: string | null; createdAt: Date }
  category: { name: string; parent: { name: string } | null }
  location: { name: string }
  images: { id: string; filePath: string }[]
}

export default function ModerationQueue({ ads }: { ads: Ad[] }) {
  const router = useRouter()
  const [selectedAds, setSelectedAds] = useState<string[]>([])
  const [rejectingAd, setRejectingAd] = useState<Ad | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")
  const [viewingAd, setViewingAd] = useState<Ad | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleApprove = async (adId: string) => {
    setIsProcessing(true)
    const result = await approveAdvertisement(adId)
    if (result.error) toast.error(result.error)
    else { toast.success(result.message ?? "Advertisement approved"); router.refresh() }
    setIsProcessing(false)
  }

  const handleReject = async () => {
    if (!rejectingAd) return
    if (rejectionReason.length < 10) {
      toast.error("Please provide a detailed rejection reason (min 10 characters)")
      return
    }
    setIsProcessing(true)
    const result = await rejectAdvertisement(rejectingAd.id, rejectionReason)
    if (result.error) toast.error(result.error)
    else { toast.success(result.message ?? "Advertisement rejected"); setRejectingAd(null); setRejectionReason(""); router.refresh() }
    setIsProcessing(false)
  }

  const handleBulkApprove = async () => {
    if (selectedAds.length === 0) return
    setIsProcessing(true)
    const result = await bulkApproveAds(selectedAds)
    if (result.error) toast.error(result.error)
    else { toast.success(result.message ?? "Selected advertisements approved"); setSelectedAds([]); router.refresh() }
    setIsProcessing(false)
  }

  const toggleSelectAll = () => setSelectedAds(selectedAds.length === ads.length ? [] : ads.map(ad => ad.id))
  const toggleSelect = (adId: string) => setSelectedAds(selectedAds.includes(adId) ? selectedAds.filter(id => id !== adId) : [...selectedAds, adId])

  if (ads.length === 0) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
        <p className="text-gray-500 text-lg">No pending ads to review</p>
      </div>
    )
  }

  return (
    <>
      {selectedAds.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 flex items-center justify-between">
          <p className="text-blue-800"><strong>{selectedAds.length}</strong> ad{selectedAds.length > 1 ? "s" : ""} selected</p>
          <Button onClick={handleBulkApprove} disabled={isProcessing} size="sm">
            <CheckCircle className="mr-2 h-4 w-4" />Approve Selected
          </Button>
        </div>
      )}

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"><Checkbox checked={selectedAds.length === ads.length} onCheckedChange={toggleSelectAll} /></TableHead>
              <TableHead>Ad Details</TableHead>
              <TableHead>Seller</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ads.map((ad) => (
              <TableRow key={ad.id}>
                <TableCell><Checkbox checked={selectedAds.includes(ad.id)} onCheckedChange={() => toggleSelect(ad.id)} /></TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {ad.images[0] && <Image src={ad.images[0].filePath} alt={ad.title} width={50} height={50} className="rounded object-cover" />}
                    <div>
                      <p className="font-medium">{ad.title}</p>
                      <p className="text-xs text-gray-500">{new Date(ad.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1"><User className="h-3 w-3 text-gray-400" /><span className="text-sm">{ad.user.name || "Anonymous"}</span></div>
                </TableCell>
                <TableCell><span className="text-sm">{ad.category.parent?.name} &gt; {ad.category.name}</span></TableCell>
                <TableCell>
                  <div className="flex items-center gap-1"><MapPin className="h-3 w-3 text-gray-400" /><span className="text-sm">{ad.location.name}</span></div>
                </TableCell>
                <TableCell><span className="font-semibold">Rs. {Number(ad.price).toLocaleString()}</span></TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => setViewingAd(ad)}><Eye className="h-4 w-4" /></Button>
                    <Button variant="default" size="sm" onClick={() => handleApprove(ad.id)} disabled={isProcessing}><CheckCircle className="mr-1 h-4 w-4" />Approve</Button>
                    <Button variant="destructive" size="sm" onClick={() => setRejectingAd(ad)} disabled={isProcessing}><XCircle className="mr-1 h-4 w-4" />Reject</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* View Dialog */}
      <Dialog open={!!viewingAd} onOpenChange={() => setViewingAd(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          {viewingAd && (
            <>
              <DialogHeader>
                <DialogTitle>{viewingAd.title}</DialogTitle>
                <DialogDescription>Posted by {viewingAd.user.name || "Anonymous"} on {new Date(viewingAd.createdAt).toLocaleDateString()}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {viewingAd.images.length > 0 && (
                  <div className="grid grid-cols-2 gap-2">
                    {viewingAd.images.map((image) => (
                      <Image key={image.id} src={image.filePath} alt={viewingAd.title} width={300} height={200} className="rounded object-cover w-full h-auto" />
                    ))}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div><p className="text-sm text-gray-600">Category</p><p className="font-medium">{viewingAd.category.parent?.name} &gt; {viewingAd.category.name}</p></div>
                  <div><p className="text-sm text-gray-600">Location</p><p className="font-medium">{viewingAd.location.name}</p></div>
                  <div><p className="text-sm text-gray-600">Price</p><p className="font-medium text-lg">Rs. {Number(viewingAd.price).toLocaleString()}</p></div>
                  <div><p className="text-sm text-gray-600">Seller</p><p className="font-medium">{viewingAd.user.name || "Anonymous"}</p><p className="text-sm text-gray-500">{viewingAd.user.email}</p></div>
                </div>
                <div><p className="text-sm text-gray-600 mb-2">Description</p><p className="whitespace-pre-wrap text-gray-800">{viewingAd.description}</p></div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setViewingAd(null)}>Close</Button>
                <Button variant="default" onClick={() => { setViewingAd(null); handleApprove(viewingAd.id) }}><CheckCircle className="mr-2 h-4 w-4" />Approve</Button>
                <Button variant="destructive" onClick={() => { setViewingAd(null); setRejectingAd(viewingAd) }}><XCircle className="mr-2 h-4 w-4" />Reject</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={!!rejectingAd} onOpenChange={() => setRejectingAd(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Advertisement</DialogTitle>
            <DialogDescription>Please provide a reason for rejecting &quot;{rejectingAd?.title}&quot;.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
              <div className="flex gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-yellow-800">Be specific about what needs to be changed.</p>
              </div>
            </div>
            <Textarea placeholder="e.g., Images are blurry, price is unrealistic..." value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} rows={5} className="resize-none" />
            <p className="text-sm text-gray-500">{rejectionReason.length} / 10 characters minimum</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectingAd(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleReject} disabled={isProcessing || rejectionReason.length < 10}>{isProcessing ? "Rejecting..." : "Confirm Rejection"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}