'use client'

import { Suspense, useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { trackPageView } from '@/features/analytics/actions/analytics.actions'

function AnalyticsTrackerContent() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Track page view
    // We include search params to track filters/searches in the path if needed
    // or just the raw path. The trackPageView action handles the session logic.
    const url = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`

    // We delay slightly to ensure navigation is complete/hydration is done
    const timer = setTimeout(() => {
      trackPageView(url).catch(console.error)
    }, 1000)

    return () => clearTimeout(timer)
  }, [pathname, searchParams])

  return null
}

export function AnalyticsTracker() {
  return (
    <Suspense>
      <AnalyticsTrackerContent />
    </Suspense>
  )
}
