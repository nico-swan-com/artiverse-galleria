import { Suspense } from 'react'
import MediaAdminClient from './MediaAdminClient'

export const dynamic = 'force-dynamic'

export default function MediaAdminPage() {
  return (
    <Suspense>
      <MediaAdminClient />
    </Suspense>
  )
}
