'use client'

import { useState, useCallback } from 'react'
import Cropper, { Area, Point } from 'react-easy-crop'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { getCroppedImg, blobToFile } from '@/lib/utilities/crop-image.util'
import { ZoomIn, ZoomOut } from 'lucide-react'

interface AvatarCropDialogProps {
  /** The image source URL to crop */
  imageSrc: string
  /** Original file name for the output file */
  fileName: string
  /** Whether the dialog is open */
  open: boolean
  /** Callback when dialog open state changes */
  onOpenChange: (open: boolean) => void
  /** Callback with the cropped image file */
  onCropComplete: (croppedFile: File) => void
  /** Callback when crop is cancelled */
  onCancel: () => void
}

const AvatarCropDialog = ({
  imageSrc,
  fileName,
  open,
  onOpenChange,
  onCropComplete,
  onCancel
}: AvatarCropDialogProps) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const onCropChange = useCallback((location: Point) => {
    setCrop(location)
  }, [])

  const onZoomChange = useCallback((newZoom: number) => {
    setZoom(newZoom)
  }, [])

  const onCropCompleteCallback = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels)
    },
    []
  )

  const handleApply = async () => {
    if (!croppedAreaPixels) return

    setIsProcessing(true)
    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels)
      if (croppedBlob) {
        const croppedFile = blobToFile(
          croppedBlob,
          fileName.replace(/\.[^/.]+$/, '') + '_cropped.jpg'
        )
        onCropComplete(croppedFile)
        onOpenChange(false)
      }
    } catch (error) {
      console.error('Error cropping image:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCancel = () => {
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    onCancel()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>Crop Avatar</DialogTitle>
          <DialogDescription>
            Drag to position and use the slider to zoom. The circular area will
            be your avatar.
          </DialogDescription>
        </DialogHeader>

        {/* Cropper Container */}
        <div className='relative h-[300px] w-full overflow-hidden rounded-lg bg-muted'>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape='round'
            showGrid={false}
            onCropChange={onCropChange}
            onCropComplete={onCropCompleteCallback}
            onZoomChange={onZoomChange}
          />
        </div>

        {/* Zoom Controls */}
        <div className='flex items-center gap-4 px-2'>
          <ZoomOut className='size-4 text-muted-foreground' />
          <Slider
            value={[zoom]}
            min={1}
            max={3}
            step={0.1}
            onValueChange={(values) => setZoom(values[0])}
            className='flex-1'
          />
          <ZoomIn className='size-4 text-muted-foreground' />
        </div>

        <DialogFooter className='gap-2 sm:gap-0'>
          <Button type='button' variant='outline' onClick={handleCancel}>
            Cancel
          </Button>
          <Button type='button' onClick={handleApply} disabled={isProcessing}>
            {isProcessing ? 'Processing...' : 'Apply'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AvatarCropDialog
