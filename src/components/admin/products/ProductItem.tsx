import React from 'react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { Product } from '@/lib/products'

interface ProductItemProps {
  product: Product
  onEdit: (product: Product) => void
  onDelete: (id: string) => void
}

const ProductItem: React.FC<ProductItemProps> = ({
  product,
  onEdit,
  onDelete
}) => {
  return (
    <Card className='overflow-hidden transition-all duration-300 hover:shadow-md'>
      <div className='relative aspect-square overflow-hidden bg-muted'>
        <img
          src={product.image}
          alt={product.name}
          className='h-full w-full object-cover transition-transform duration-300 hover:scale-105'
          loading='lazy'
        />
      </div>
      <CardContent className='p-4'>
        <div className='flex items-start justify-between gap-2'>
          <div>
            <h3 className='text-base font-medium'>{product.name}</h3>
            <p className='text-sm text-muted-foreground'>{product.category}</p>
          </div>
          <div className='text-base font-semibold'>
            ${product.price.toFixed(2)}
          </div>
        </div>
        <div className='mt-3 flex items-center justify-between text-xs text-muted-foreground'>
          <div>Stock: {product.stock}</div>
          <div>Sales: {product.sales}</div>
        </div>
      </CardContent>
      <CardFooter className='flex justify-between p-4 pt-0'>
        <div className='text-xs text-muted-foreground'>
          Added{' '}
          {product.createdAt
            ? formatDistanceToNow(product.createdAt, {
                addSuffix: true
              })
            : 'Unknown'}
        </div>
        <div className='flex space-x-2'>
          <Button size='icon' variant='outline' onClick={() => onEdit(product)}>
            <Pencil size={16} />
            <span className='sr-only'>Edit</span>
          </Button>
          <Button
            size='icon'
            variant='outline'
            className='text-destructive'
            onClick={() => onDelete(product.id)}
          >
            <Trash2 size={16} />
            <span className='sr-only'>Delete</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

export default ProductItem
