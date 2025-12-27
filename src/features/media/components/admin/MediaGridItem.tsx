import React from 'react'
import Image from 'next/image'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2, Image as ImageIcon } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { Media } from '@/features/media/types/media.schema'
import { Badge } from '@/components/ui/badge'

interface MediaGridItemProps {
  media: Media
  onEdit: () => void
  onDelete: (id: string) => void
  loading: boolean
}

const MediaGridItem: React.FC<MediaGridItemProps> = ({
  media,
  onEdit,
  onDelete,
  loading
}) => {
  return (
    <Card className='overflow-hidden transition-all duration-300 hover:shadow-md'>
      <div className='flex h-40 w-full items-center justify-center overflow-hidden rounded-md bg-gray-100'>
        <Image
          src={`/api/media/${media.id}`}
          alt={media.altText ?? media.fileName}
          width={320}
          height={160}
          className='size-full object-contain'
          style={{ objectFit: 'contain' }}
        />
      </div>
      <CardContent className='p-4'>
        <div className='mb-2 flex items-center gap-2'>
          <ImageIcon className='size-4 text-gray-400' />
          <span className='truncate text-base font-medium'>
            {media.fileName}
          </span>
        </div>
        {media.tags && media.tags.length > 0 && (
          <div className='mb-2 flex flex-wrap gap-1'>
            {media.tags.map((tag) => (
              <Badge key={tag} variant='secondary'>
                {tag}
              </Badge>
            ))}
          </div>
        )}
        <div className='flex gap-2 text-xs text-muted-foreground'>
          <span>{media.mimeType}</span>
          <span>• {(media.fileSize / 1024).toFixed(1)} KB</span>
        </div>
      </CardContent>
      <CardFooter className='flex justify-between p-4 pt-0'>
        <div className='text-xs text-muted-foreground'>
          Uploaded{' '}
          {media.createdAt
            ? formatDistanceToNow(new Date(media.createdAt), {
                addSuffix: true
              })
            : 'Unknown'}
        </div>
        <div className='flex space-x-2'>
          <Button
            size='icon'
            variant='outline'
            onClick={onEdit}
            disabled={loading}
          >
            <Pencil size={16} />
            <span className='sr-only'>Edit</span>
          </Button>
          <Button
            size='icon'
            variant='destructive'
            onClick={() => onDelete(media.id)}
            disabled={loading}
          >
            <Trash2 size={16} />
            <span className='sr-only'>Delete</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

export default MediaGridItem
