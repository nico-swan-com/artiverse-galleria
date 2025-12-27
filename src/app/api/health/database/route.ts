import { NextResponse } from 'next/server'
import { db } from '@/lib/database/drizzle'
import { sql } from 'drizzle-orm'

/**
 * Database Health Check Endpoint
 *
 * GET /api/health/database
 *
 * Checks database connectivity and returns basic metrics.
 * Useful for monitoring and deployment verification.
 */
export async function GET() {
  try {
    const startTime = Date.now()

    // Test database connection with a simple query
    const result = await db.execute(
      sql`SELECT 1 as health_check, NOW() as timestamp`
    )

    const responseTime = Date.now() - startTime

    // Get basic database stats
    const stats = await db.execute(
      sql`
        SELECT 
          (SELECT COUNT(*) FROM artiverse.users) as user_count,
          (SELECT COUNT(*) FROM artiverse.products) as product_count,
          (SELECT COUNT(*) FROM artiverse.artists) as artist_count,
          (SELECT COUNT(*) FROM artiverse.media) as media_count
      `
    )

    const healthData = {
      status: 'healthy',
      database: {
        connected: true,
        responseTime: `${responseTime}ms`,
        timestamp: result[0]?.timestamp || new Date().toISOString()
      },
      stats: {
        users: Number(stats[0]?.user_count || 0),
        products: Number(stats[0]?.product_count || 0),
        artists: Number(stats[0]?.artist_count || 0),
        media: Number(stats[0]?.media_count || 0)
      }
    }

    return NextResponse.json(healthData, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        database: {
          connected: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      },
      { status: 503 }
    )
  }
}
