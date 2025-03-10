import React from 'react'
import { cn } from '@/lib/utils'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'

interface MetricCardProps {
  title: string
  value: string | number
  description?: string
  icon?: React.ReactNode
  footer?: React.ReactNode
  trend?: {
    value: number
    positive: boolean
  }
  className?: string
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  description,
  icon,
  footer,
  trend,
  className
}) => {
  return (
    <Card
      className={cn(
        'overflow-hidden transition-all duration-200 hover:shadow-md',
        className
      )}
    >
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium text-muted-foreground'>
          {title}
        </CardTitle>
        {icon && <div className='text-muted-foreground'>{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>{value}</div>
        {description && (
          <CardDescription className='mt-1 text-xs'>
            {description}
          </CardDescription>
        )}
        {trend && (
          <div
            className={`mt-2 flex items-center text-xs ${trend.positive ? 'text-green-500' : 'text-red-500'}`}
          >
            {trend.positive ? (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 20 20'
                fill='currentColor'
                className='mr-1 h-3 w-3'
              >
                <path
                  fillRule='evenodd'
                  d='M12.577 4.878a.75.75 0 01.919-.53l4.78 1.281a.75.75 0 01.531.919l-1.281 4.78a.75.75 0 01-1.449-.387l.81-3.022a19.407 19.407 0 00-5.594 5.203.75.75 0 01-1.139.093L7 10.06l-4.72 4.72a.75.75 0 01-1.06-1.061l5.25-5.25a.75.75 0 011.06 0l3.074 3.073a20.923 20.923 0 015.545-4.931l-3.042-.815a.75.75 0 01-.53-.919z'
                  clipRule='evenodd'
                />
              </svg>
            ) : (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 20 20'
                fill='currentColor'
                className='mr-1 h-3 w-3'
              >
                <path
                  fillRule='evenodd'
                  d='M1.22 5.222a.75.75 0 011.06 0L7 9.942l3.768-3.769a.75.75 0 011.113.058 20.908 20.908 0 013.813 7.254l1.574-2.727a.75.75 0 011.3.75l-2.475 4.286a.75.75 0 01-.916.384l-4.869-1.61a.75.75 0 01.45-1.43l2.975.984a19.375 19.375 0 00-3.34-6.44L7 10.072 1.72 4.792a.75.75 0 010-1.061 20.908 20.908 0 13.768 1.06z'
                  clipRule='evenodd'
                />
              </svg>
            )}
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </CardContent>
      {footer && <CardFooter className='pt-0'>{footer}</CardFooter>}
    </Card>
  )
}

export default MetricCard
