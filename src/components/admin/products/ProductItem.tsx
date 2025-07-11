import React from 'react'
import Image from 'next/image'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Pencil } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { Product } from '@/lib/products'
import Link from 'next/link'
import DeleteProductDialog from './ProductDeleteDialog'

interface ProductItemProps {
  product: Product
}

const ProductItem: React.FC<ProductItemProps> = ({ product }) => {
  return (
    <Card className='overflow-hidden transition-all duration-300 hover:shadow-md'>
      {typeof product.featureImage === 'string' && product.featureImage ? (
        <Image
          src={product.featureImage}
          alt={`${product.title} - Product image`}
          width={400}
          height={300}
          className='transition-transform duration-300 hover:scale-105'
          loading='lazy'
          style={{ objectFit: 'cover', width: '100%', height: '200px' }}
          sizes='(max-width: 768px) 100vw, 33vw'
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.style.display = 'none'
            target.nextElementSibling?.classList.remove('hidden')
          }}
        />
      ) : null}
      <div
        className={`flex h-[200px] w-full items-center justify-center bg-muted ${typeof product.featureImage === 'string' && product.featureImage ? 'hidden' : ''}`}
      >
        <span className='text-muted-foreground'>No image available</span>
      </div>
      <CardContent className='p-4'>
        <div className='flex items-start justify-between gap-2'>
          <div>
            <h3 className='text-base font-medium'>{product.title}</h3>
            <p className='text-sm text-muted-foreground'>{product.category}</p>
          </div>
          <div className='text-base font-semibold'>
            ${Number(product.price).toFixed(2)}
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
          <Link href={`/admin/products/${product.id}/edit`} passHref>
            <Button size='icon' variant='outline'>
              <Pencil size={16} />
              <span className='sr-only'>Edit</span>
            </Button>
          </Link>
          <DeleteProductDialog product={product} />
        </div>
      </CardFooter>
    </Card>
  )
}

export default ProductItem
