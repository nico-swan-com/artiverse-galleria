/**
 * Notification Service
 *
 * Service for sending order-related email notifications.
 */

import { sendMail } from '@/lib/mailer/sendMail'
import { logger } from '@/lib/utilities/logger'
import { Order } from '@/features/billing/types'
import {
  OrderNotificationData,
  orderToNotificationData,
  NotificationResult
} from '../types'
import {
  generateOrderConfirmationEmail,
  generateOrderConfirmationText,
  generatePaymentConfirmationEmail,
  generatePaymentConfirmationText
} from './email-templates'

class NotificationService {
  /**
   * Send order confirmation email
   */
  async sendOrderConfirmation(order: Order): Promise<NotificationResult> {
    try {
      const data = orderToNotificationData(order)

      const html = generateOrderConfirmationEmail(data)
      const text = generateOrderConfirmationText(data)

      await sendMail({
        email: 'noreply@artiverse-galleria.com',
        sendTo: data.customerEmail,
        subject: `Order Confirmation - #${order.id}`,
        text,
        html
      })

      logger.info('Order confirmation email sent', {
        orderId: order.id,
        email: data.customerEmail
      })

      return { success: true }
    } catch (error) {
      logger.error('Failed to send order confirmation email', error as Error)
      return {
        success: false,
        error: 'Failed to send order confirmation email'
      }
    }
  }

  /**
   * Send payment confirmation email
   */
  async sendPaymentConfirmation(order: Order): Promise<NotificationResult> {
    try {
      const data = orderToNotificationData(order)

      const html = generatePaymentConfirmationEmail(data)
      const text = generatePaymentConfirmationText(data)

      await sendMail({
        email: 'noreply@artiverse-galleria.com',
        sendTo: data.customerEmail,
        subject: `Payment Received - Order #${order.id}`,
        text,
        html
      })

      logger.info('Payment confirmation email sent', {
        orderId: order.id,
        email: data.customerEmail
      })

      return { success: true }
    } catch (error) {
      logger.error('Failed to send payment confirmation email', error as Error)
      return {
        success: false,
        error: 'Failed to send payment confirmation email'
      }
    }
  }
}

export const notificationService = new NotificationService()
