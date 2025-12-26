/**
 * Email Templates
 *
 * HTML email templates for order notifications.
 */

import { OrderNotificationData } from '../types'

/**
 * Generate order confirmation email HTML
 */
export function generateOrderConfirmationEmail(
  data: OrderNotificationData
): string {
  const itemsHtml = data.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
          ${item.title}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">
          ${item.quantity}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">
          R${item.unitPrice.toLocaleString()}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">
          R${item.totalPrice.toLocaleString()}
        </td>
      </tr>
    `
    )
    .join('')

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px 12px 0 0; padding: 40px 30px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">
        🎨 Artiverse Galleria
      </h1>
      <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">
        Order Confirmation
      </p>
    </div>
    
    <!-- Content -->
    <div style="background: white; padding: 40px 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
      
      <!-- Greeting -->
      <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 22px;">
        Hi ${data.customerName}! 👋
      </h2>
      <p style="color: #4b5563; line-height: 1.6; margin: 0 0 30px 0;">
        Thank you for your order! We've received your order and are getting it ready.
        Here's a summary of what you ordered:
      </p>
      
      <!-- Order Info -->
      <div style="background: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
        <p style="margin: 0; color: #6b7280; font-size: 14px;">
          <strong>Order Number:</strong> ${data.orderId}
        </p>
        <p style="margin: 8px 0 0 0; color: #6b7280; font-size: 14px;">
          <strong>Order Date:</strong> ${new Date(
            data.orderDate
          ).toLocaleDateString('en-ZA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>
      
      <!-- Items Table -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
        <thead>
          <tr style="background: #f9fafb;">
            <th style="padding: 12px; text-align: left; font-weight: 600; color: #374151; border-bottom: 2px solid #e5e7eb;">
              Item
            </th>
            <th style="padding: 12px; text-align: center; font-weight: 600; color: #374151; border-bottom: 2px solid #e5e7eb;">
              Qty
            </th>
            <th style="padding: 12px; text-align: right; font-weight: 600; color: #374151; border-bottom: 2px solid #e5e7eb;">
              Price
            </th>
            <th style="padding: 12px; text-align: right; font-weight: 600; color: #374151; border-bottom: 2px solid #e5e7eb;">
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>
      
      <!-- Totals -->
      <div style="border-top: 2px solid #e5e7eb; padding-top: 20px; margin-bottom: 30px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="color: #6b7280;">Subtotal:</span>
          <span style="color: #374151;">R${data.subtotal.toLocaleString()}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="color: #6b7280;">Shipping:</span>
          <span style="color: #374151;">R${data.shipping.toLocaleString()}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 16px;">
          <span style="color: #6b7280;">Tax:</span>
          <span style="color: #374151;">R${data.tax.toLocaleString()}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: 600;">
          <span style="color: #1f2937;">Total:</span>
          <span style="color: #667eea;">R${data.total.toLocaleString()}</span>
        </div>
      </div>
      
      <!-- Shipping Address -->
      <div style="background: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
        <h3 style="margin: 0 0 12px 0; color: #374151; font-size: 16px;">
          📦 Shipping Address
        </h3>
        <p style="margin: 0; color: #6b7280; line-height: 1.6;">
          ${data.shippingAddress.address}<br>
          ${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.zip}<br>
          ${data.shippingAddress.country}
        </p>
      </div>
      
      <!-- Footer Message -->
      <p style="color: #6b7280; line-height: 1.6; margin: 0; text-align: center; font-size: 14px;">
        If you have any questions about your order, please don't hesitate to contact us.
      </p>
      
    </div>
    
    <!-- Footer -->
    <div style="text-align: center; padding: 30px 20px;">
      <p style="color: #9ca3af; font-size: 14px; margin: 0;">
        © ${new Date().getFullYear()} Artiverse Galleria. All rights reserved.
      </p>
    </div>
    
  </div>
</body>
</html>
  `
}

/**
 * Generate payment confirmation email HTML
 */
export function generatePaymentConfirmationEmail(
  data: OrderNotificationData
): string {
  const itemsHtml = data.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
          ${item.title}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">
          ${item.quantity}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">
          R${item.totalPrice.toLocaleString()}
        </td>
      </tr>
    `
    )
    .join('')

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Received</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 12px 12px 0 0; padding: 40px 30px; text-align: center;">
      <div style="font-size: 48px; margin-bottom: 10px;">✅</div>
      <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">
        Payment Received
      </h1>
      <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">
        Thank you for your payment!
      </p>
    </div>
    
    <!-- Content -->
    <div style="background: white; padding: 40px 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
      
      <!-- Greeting -->
      <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 22px;">
        Hi ${data.customerName}! 🎉
      </h2>
      <p style="color: #4b5563; line-height: 1.6; margin: 0 0 30px 0;">
        Great news! We've received your payment of <strong style="color: #10b981;">R${data.total.toLocaleString()}</strong>
        for order <strong>${data.orderId}</strong>.
      </p>
      
      <!-- Payment Summary -->
      <div style="background: #ecfdf5; border: 1px solid #10b981; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
        <h3 style="margin: 0 0 12px 0; color: #065f46; font-size: 16px;">
          💳 Payment Summary
        </h3>
        <p style="margin: 0; color: #047857; font-size: 24px; font-weight: 600;">
          R${data.total.toLocaleString()}
        </p>
        <p style="margin: 8px 0 0 0; color: #059669; font-size: 14px;">
          Payment received on ${new Date().toLocaleDateString('en-ZA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>
      
      <!-- Order Items -->
      <h3 style="color: #374151; margin: 0 0 16px 0; font-size: 16px;">
        📋 Order Summary
      </h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
        <thead>
          <tr style="background: #f9fafb;">
            <th style="padding: 12px; text-align: left; font-weight: 600; color: #374151; border-bottom: 2px solid #e5e7eb;">
              Item
            </th>
            <th style="padding: 12px; text-align: center; font-weight: 600; color: #374151; border-bottom: 2px solid #e5e7eb;">
              Qty
            </th>
            <th style="padding: 12px; text-align: right; font-weight: 600; color: #374151; border-bottom: 2px solid #e5e7eb;">
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="padding: 12px; text-align: right; font-weight: 600; color: #374151;">
              Total Paid:
            </td>
            <td style="padding: 12px; text-align: right; font-weight: 600; color: #10b981; font-size: 18px;">
              R${data.total.toLocaleString()}
            </td>
          </tr>
        </tfoot>
      </table>
      
      <!-- What's Next -->
      <div style="background: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
        <h3 style="margin: 0 0 12px 0; color: #374151; font-size: 16px;">
          🚀 What happens next?
        </h3>
        <ul style="margin: 0; padding-left: 20px; color: #6b7280; line-height: 1.8;">
          <li>We're preparing your artwork for shipping</li>
          <li>You'll receive a shipping notification with tracking info</li>
          <li>Expected delivery: 3-5 business days</li>
        </ul>
      </div>
      
      <!-- Footer Message -->
      <p style="color: #6b7280; line-height: 1.6; margin: 0; text-align: center; font-size: 14px;">
        Thank you for supporting independent artists! 🎨
      </p>
      
    </div>
    
    <!-- Footer -->
    <div style="text-align: center; padding: 30px 20px;">
      <p style="color: #9ca3af; font-size: 14px; margin: 0;">
        © ${new Date().getFullYear()} Artiverse Galleria. All rights reserved.
      </p>
    </div>
    
  </div>
</body>
</html>
  `
}

/**
 * Generate plain text version of order confirmation
 */
export function generateOrderConfirmationText(
  data: OrderNotificationData
): string {
  const items = data.items
    .map(
      (item) =>
        `- ${item.title} (x${item.quantity}) - R${item.totalPrice.toLocaleString()}`
    )
    .join('\n')

  return `
ARTIVERSE GALLERIA - ORDER CONFIRMATION
=======================================

Hi ${data.customerName}!

Thank you for your order! We've received your order and are getting it ready.

ORDER DETAILS
-------------
Order Number: ${data.orderId}
Order Date: ${new Date(data.orderDate).toLocaleDateString('en-ZA')}

ITEMS
-----
${items}

Subtotal: R${data.subtotal.toLocaleString()}
Shipping: R${data.shipping.toLocaleString()}
Tax: R${data.tax.toLocaleString()}
-----------------
Total: R${data.total.toLocaleString()}

SHIPPING ADDRESS
----------------
${data.shippingAddress.address}
${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.zip}
${data.shippingAddress.country}

If you have any questions, please contact us.

Thank you for shopping with Artiverse Galleria!
  `.trim()
}

/**
 * Generate plain text version of payment confirmation
 */
export function generatePaymentConfirmationText(
  data: OrderNotificationData
): string {
  const items = data.items
    .map(
      (item) =>
        `- ${item.title} (x${item.quantity}) - R${item.totalPrice.toLocaleString()}`
    )
    .join('\n')

  return `
ARTIVERSE GALLERIA - PAYMENT RECEIVED
=====================================

Hi ${data.customerName}!

Great news! We've received your payment of R${data.total.toLocaleString()} for order ${data.orderId}.

PAYMENT SUMMARY
---------------
Amount Paid: R${data.total.toLocaleString()}
Payment Date: ${new Date().toLocaleDateString('en-ZA')}

ORDER ITEMS
-----------
${items}

WHAT'S NEXT?
------------
- We're preparing your artwork for shipping
- You'll receive a shipping notification with tracking info
- Expected delivery: 3-5 business days

Thank you for supporting independent artists!

Artiverse Galleria
  `.trim()
}
