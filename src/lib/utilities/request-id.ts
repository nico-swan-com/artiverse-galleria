import { randomBytes } from 'crypto'

/**
 * Request ID Utility
 *
 * Generates unique request IDs for security audit logs and request tracking.
 * Request IDs help correlate logs across services and track security events.
 */

/**
 * Generate a unique request ID
 * Format: timestamp-randomstring (e.g., "1704067200000-a1b2c3d4")
 */
export function generateRequestId(): string {
  const timestamp = Date.now().toString()
  const random = randomBytes(4).toString('hex')
  return `${timestamp}-${random}`
}

/**
 * Get or generate request ID from headers
 * Checks for existing request ID in headers, generates new one if not present
 */
export function getRequestId(
  headers: Headers | Record<string, string>
): string {
  const headerName = 'x-request-id'
  const headerValue =
    headers instanceof Headers
      ? headers.get(headerName)
      : headers[headerName] || headers['X-Request-ID']

  return headerValue || generateRequestId()
}

/**
 * Add request ID to response headers
 */
export function addRequestIdToHeaders(
  headers: Headers,
  requestId: string
): void {
  headers.set('x-request-id', requestId)
}

/**
 * Request ID middleware for API routes
 * Extracts or generates request ID and adds it to response headers
 */
export function withRequestId<T extends unknown[]>(
  handler: (request: Request, ...args: T) => Promise<Response>
) {
  return async (request: Request, ...args: T): Promise<Response> => {
    const requestId = getRequestId(request.headers)
    const response = await handler(request, ...args)

    // Clone response to add headers
    const newResponse = response.clone()
    addRequestIdToHeaders(newResponse.headers, requestId)

    return newResponse
  }
}
