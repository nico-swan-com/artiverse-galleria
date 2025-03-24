'use server'

import nodemailer from 'nodemailer'
const SMTP_SERVER_HOST = process.env.SMTP_SERVER_HOST
const SMTP_SERVER_USERNAME = process.env.SMTP_SERVER_USERNAME
const SMTP_SERVER_PASSWORD = process.env.SMTP_SERVER_PASSWORD
const SITE_MAIL_RECEIVER = process.env.SITE_MAIL_RECEIVER
const SMTP_SERVER_PORT = process.env.SMTP_SERVER_PORT
const SMTP_SERVER_SECURE = process.env.SMTP_SERVER_SECURE
const SMTP_SIMULATOR = process.env.SMTP_SIMULATOR || 'true'

if (
  !SMTP_SERVER_HOST ||
  !SMTP_SERVER_USERNAME ||
  !SMTP_SERVER_PASSWORD ||
  !SITE_MAIL_RECEIVER ||
  !SMTP_SERVER_PORT ||
  !SMTP_SERVER_SECURE
) {
  throw new Error(
    'Please set SMTP_SERVER_HOST, SMTP_SERVER_USERNAME, SMTP_SERVER_PASSWORD, SITE_MAIL_RECEIVER, SMTP_SERVER_PORT, SMTP_SERVER_SECURE environment variables.'
  )
}

const transporter = nodemailer.createTransport({
  service: 'smtp',
  host: SMTP_SERVER_HOST,
  port: Number(SMTP_SERVER_PORT),
  secure: SMTP_SERVER_SECURE === 'true',
  auth: {
    user: SMTP_SERVER_USERNAME,
    pass: SMTP_SERVER_PASSWORD
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
    to: sendTo || SITE_MAIL_RECEIVER,
    subject: subject,
    text: text,
    html: html ? html : ''
  }

  if (SMTP_SIMULATOR === 'true') {
    // Simulate an API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    console.log('Message Sent', emailOptions)
    return
  }

  try {
    await transporter.verify()
  } catch (error) {
    console.error('Something Went Wrong', error)
    return
  }
  const info = await transporter.sendMail(emailOptions)
  console.log('Message Sent', info.messageId)
  console.log('Mail sent to', SITE_MAIL_RECEIVER)
  return info
}
