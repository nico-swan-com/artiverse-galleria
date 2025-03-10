'use client'

import React from 'react'

import MetricCard from '@/components/dashboard/MetricCard'
import { dashboardStats, Product } from '@/data/data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import { CreditCard, DollarSign, FileText, TrendingUp } from 'lucide-react'
import PageTransition from '@/components/PageTransition'
import { useSession } from 'next-auth/react'

const Dashboard: React.FC = () => {
  const { status } = useSession()
  if (status !== 'authenticated') {
    return null
  }

  // Format revenue numbers
  const totalRevenue = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(dashboardStats.revenue.total)

  const monthlyRevenue = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(dashboardStats.revenue.currentMonth)

  // Format product data for chart
  const productChartData = dashboardStats.popularProducts.map((product) => ({
    name:
      product.name.length > 15
        ? product.name.substring(0, 15) + '...'
        : product.name,
    sales: product.sales
  }))



  return (
    <PageTransition>
      <div className='space-y-6'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Dashboard</h1>
          <p className='mt-1 text-muted-foreground'>
            Your e-commerce overview and analytics.
          </p>
        </div>

        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          <MetricCard
            title='Total Invoices'
            value={dashboardStats.invoices.total}
            icon={<FileText size={20} />}
            description={`${dashboardStats.invoices.paid} paid, ${dashboardStats.invoices.pending} pending`}
          />
          <MetricCard
            title='Total Revenue'
            value={totalRevenue}
            icon={<DollarSign size={20} />}
            trend={{ value: 12.5, positive: true }}
          />
          <MetricCard
            title='This Month'
            value={monthlyRevenue}
            icon={<TrendingUp size={20} />}
            trend={{ value: 8.2, positive: true }}
          />
          <MetricCard
            title='Pending Payments'
            value={dashboardStats.invoices.pending}
            icon={<CreditCard size={20} />}
            trend={{ value: 2.1, positive: false }}
          />
        </div>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-base'>Popular Products</CardTitle>
            </CardHeader>
            <CardContent className='pt-0'>
              <div className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart
                    data={productChartData}
                    margin={{
                      top: 20,
                      right: 20,
                      left: 20,
                      bottom: 40
                    }}
                  >
                    <CartesianGrid strokeDasharray='3 3' vertical={false} />
                    <XAxis
                      dataKey='name'
                      axisLine={false}
                      tickLine={false}
                      angle={-45}
                      textAnchor='end'
                      height={60}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) => `${value}`}
                    />
                    <Tooltip
                      contentStyle={{
                        background: 'rgba(255, 255, 255, 0.8)',
                        border: 'none',
                        borderRadius: '4px',
                        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Bar
                      dataKey='sales'
                      fill='hsl(var(--primary))'
                      radius={[4, 4, 0, 0]}
                      barSize={30}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-base'>Top Selling Products</CardTitle>
            </CardHeader>
            <CardContent className='pt-0'>
              <div className='space-y-4'>
                {dashboardStats.popularProducts.map((product, index) => (
                  <ProductItem
                    key={product.id}
                    product={product}
                    index={index + 1}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div> 
      </div>
    </PageTransition>
  )
}

interface ProductItemProps {
  product: Product
  index: number
}

const ProductItem: React.FC<ProductItemProps> = ({ product, index }) => {
  return (
    <div className='flex items-center gap-3'>
      <div className='flex size-8 items-center justify-center rounded-md bg-muted'>
        {index}
      </div>
      <div className='min-w-0 flex-1'>
        <p className='truncate text-sm font-medium'>{product.name}</p>
        <p className='text-xs text-muted-foreground'>{product.category}</p>
      </div>
      <div className='font-medium'>{product.sales} sales</div>
    </div>
  )
}

export default Dashboard
