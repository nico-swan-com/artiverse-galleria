/**
 * PayFast Webhook (ITN) Route
 *
 * Handles Instant Transaction Notifications from PayFast.
 * This endpoint is called by PayFast to notify us of payment status changes.
 */

import { NextRequest, NextResponse } from 'next/server'
import { billingService } from '@/features/billing/lib/billing.service'
import { logger } from '@/lib/utilities/logger'

export async function POST(request: NextRequest) {
  try {
    // Get the raw body for signature validation
    const formData = await request.formData()
    const payload: Record<string, string> = {}

    formData.forEach((value, key) => {
      payload[key] = String(value)
    })

    // Get signature from payload
    const signature = payload.signature

    logger.info('Received PayFast ITN', {
      paymentId: payload.pf_payment_id,
      orderId: payload.m_payment_id,
      status: payload.payment_status
    })

    // Process the webhook
    const success = await billingService.processWebhook(payload, signature)

    if (success) {
      // PayFast expects a 200 OK response with no body
      return new NextResponse(null, { status: 200 })
    } else {
      logger.error('Webhook processing failed', {
        orderId: payload.m_payment_id
      })
      return new NextResponse('Webhook processing failed', { status: 400 })
    }
  } catch (error) {
    logger.error('Webhook error', error as Error)
    return new NextResponse('Internal server error', { status: 500 })
  }
}

// PayFast may also send GET requests for verification
export async function GET() {
  return NextResponse.json({ status: 'Webhook endpoint active' })
}
