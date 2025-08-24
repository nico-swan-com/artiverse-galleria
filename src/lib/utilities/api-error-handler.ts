import { NextResponse } from 'next/server'

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export const handleApiError = (error: unknown) => {
  if (error instanceof ApiError) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: error.status,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  console.error('Internal Server Error:', error)

  return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), {
    status: 500,
    headers: { 'Content-Type': 'application/json' }
  })
}
