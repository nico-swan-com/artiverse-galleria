import { NewAnalyticsEvent } from '../schema'

// User IDs from users.ts
const ADMIN_USER_ID = 'a1b2c3d4-e5f6-7890-1234-56789abcdef0'
const CLIENT_USER_ID = 'b2c3d4e5-f6a7-8901-2345-6789abcdef01'
const ARTIST_USER_ID = 'b2c3d4e5-f6a7-8901-2345-6789abcdef02'

// Helper to create date relative to now (days ago)
const daysAgo = (days: number) => {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date
}

export const analyticsEvents: NewAnalyticsEvent[] = [
  // Admin Activity
  {
    eventType: 'admin_login',
    userId: ADMIN_USER_ID,
    sessionId: 'sess_admin_001',
    path: '/login',
    createdAt: daysAgo(2)
  },
  {
    eventType: 'view_dashboard',
    userId: ADMIN_USER_ID,
    sessionId: 'sess_admin_001',
    path: '/admin',
    createdAt: daysAgo(2)
  },
  {
    eventType: 'view_orders',
    userId: ADMIN_USER_ID,
    sessionId: 'sess_admin_001',
    path: '/admin/orders',
    createdAt: daysAgo(2)
  },

  // Artist Activity
  {
    eventType: 'artist_login',
    userId: ARTIST_USER_ID,
    sessionId: 'sess_artist_001',
    path: '/login',
    createdAt: daysAgo(5)
  },
  {
    eventType: 'view_profile',
    userId: ARTIST_USER_ID,
    sessionId: 'sess_artist_001',
    path: '/profile',
    createdAt: daysAgo(5)
  },

  // Client Activity - Session 1 (Browsing)
  {
    eventType: 'page_view',
    userId: CLIENT_USER_ID,
    sessionId: 'sess_client_001',
    path: '/',
    createdAt: daysAgo(10)
  },
  {
    eventType: 'view_product',
    userId: CLIENT_USER_ID,
    sessionId: 'sess_client_001',
    path: '/artworks/c9de4b7f-5765-460a-9528-e86a12784777',
    metadata: JSON.stringify({
      productId: 'c9de4b7f-5765-460a-9528-e86a12784777'
    }),
    createdAt: daysAgo(10)
  },
  {
    eventType: 'add_to_cart',
    userId: CLIENT_USER_ID,
    sessionId: 'sess_client_001',
    path: '/artworks/c9de4b7f-5765-460a-9528-e86a12784777',
    metadata: JSON.stringify({
      productId: 'c9de4b7f-5765-460a-9528-e86a12784777',
      price: 1200
    }),
    createdAt: daysAgo(10)
  },

  // Client Activity - Session 2 (Purchasing)
  {
    eventType: 'page_view',
    userId: CLIENT_USER_ID,
    sessionId: 'sess_client_002',
    path: '/cart',
    createdAt: daysAgo(1)
  },
  {
    eventType: 'checkout_start',
    userId: CLIENT_USER_ID,
    sessionId: 'sess_client_002',
    path: '/checkout',
    createdAt: daysAgo(1)
  },
  {
    eventType: 'order_placed',
    userId: CLIENT_USER_ID,
    sessionId: 'sess_client_002',
    path: '/checkout/success',
    metadata: JSON.stringify({ orderId: 'ORD-2023-005', total: 2850 }),
    createdAt: daysAgo(1)
  }
]
