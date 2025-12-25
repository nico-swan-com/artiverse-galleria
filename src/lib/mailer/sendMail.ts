'use server'

import nodemailer from 'nodemailer'
import { env } from '../config/env.config'
import { SMTP_CONFIG } from '../constants/app.constants'
import { logger } from '../utilities/logger'

const transporter = nodemailer.createTransport({
  service: 'smtp',
  host: env.SMTP_SERVER_HOST,
  port: env.SMTP_SERVER_PORT,
  secure: env.SMTP_SERVER_SECURE,
  auth: {
    user: env.SMTP_SERVER_USERNAME,
    pass: env.SMTP_SERVER_PASSWORD
  }
})

export async function sendMail({
  email,
  sendTo,
  subject,
  text,
  html
}: {
  email: string
  sendTo?: string
  subject: string
  text: string
  html?: string
}) {
  const emailOptions = {
    from: email,
    to: sendTo || env.SITE_MAIL_RECEIVER,
    subject: subject,
    text: text,
    html: html ? html : ''
  }

  if (env.SMTP_SIMULATOR) {
    // Simulate an API call
    await new Promise((resolve) =>
      setTimeout(resolve, SMTP_CONFIG.SIMULATOR_DELAY)
    )
    logger.info('Message sent (simulated)', { emailOptions })
    return
  }

  try {
    await transporter.verify()
  } catch (error) {
    logger.error('SMTP connection verification failed', error)
    return
  }
  const info = await transporter.sendMail(emailOptions)
  logger.info('Message sent', {
    messageId: info.messageId,
    recipient: env.SITE_MAIL_RECEIVER
  })
  return info
}
