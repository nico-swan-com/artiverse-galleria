import dotenv from 'dotenv'
import path from 'path'

// Load envs before anything else
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

async function testLatency() {
  console.log('Environment loaded.')

  // Dynamic import to ensure env vars are ready
  const { MediaRepository } = await import('../src/lib/media/media.repository')
  const { db } = await import('../src/lib/database/drizzle')

  const repo = new MediaRepository()

  console.log('----------------------------------------')
  console.log('Test 1: Fetching media metadata ONLY (optimized)')
  console.log('----------------------------------------')
  const start1 = performance.now()
  try {
    const results = await db.query.media.findMany({
      columns: {
        id: true,
        fileName: true,
        fileSize: true,
        mimeType: true,
        createdAt: true,
        updatedAt: true
        // Exclude data field which is bytea
      }
    })
    const end1 = performance.now()
    console.log(`Metadata query successful`)
    console.log(`scanned ${results.length} items`)
    console.log(`Latency: ${(end1 - start1).toFixed(2)}ms`)
  } catch (e) {
    console.error('Metadata query failed:', e)
  }

  console.log('\n----------------------------------------')
  console.log('Test 2: Full getAll() (Repository implementation)')
  console.log('----------------------------------------')

  const start2 = performance.now()
  try {
    // Add a timeout of 30 seconds
    const results = (await Promise.race([
      repo.getAll(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout after 30s')), 30000)
      )
    ])) as any[]

    const end2 = performance.now()
    console.log(`Full query successful`)
    console.log(`Wait time: ${(end2 - start2).toFixed(2)}ms`)
    console.log(`Items found: ${results.length}`)
  } catch (error) {
    console.error('Full query status:', error)
  }
}

testLatency()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
