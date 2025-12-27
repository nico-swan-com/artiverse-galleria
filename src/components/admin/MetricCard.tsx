import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  description?: string
  trend?: {
    value: number
    positive: boolean
  }
}

const MetricCard = ({
  title,
  value,
  icon,
  description,
  trend
}: MetricCardProps) => {
  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>{title}</CardTitle>
        <div className='text-muted-foreground'>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>{value}</div>
        {(description || trend) && (
          <div className='mt-2 flex items-center text-xs text-muted-foreground'>
            {trend && (
              <span
                className={`mr-2 flex items-center font-medium ${trend.positive ? 'text-green-500' : 'text-red-500'}`}
              >
                {trend.positive ? (
                  <TrendingUp className='mr-1 h-3 w-3' />
                ) : (
                  <TrendingDown className='mr-1 h-3 w-3' />
                )}
                {trend.value}%
              </span>
            )}
            {description}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default MetricCard
