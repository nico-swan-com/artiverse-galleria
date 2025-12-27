/**
 * Jest Setup File
 *
 * This file runs before each test file and sets up the testing environment.
 * It includes polyfills for Web APIs not available in jsdom.
 */

import '@testing-library/jest-dom'

// Polyfill TextEncoder/TextDecoder for Node.js environment
import { TextEncoder, TextDecoder } from 'util'
global.TextEncoder = TextEncoder as typeof global.TextEncoder
global.TextDecoder = TextDecoder as typeof global.TextDecoder

// Polyfill Web Fetch API classes for Next.js API route testing
// These are available in Node 18+ but may not be in jsdom environment

class MockHeaders {
  private headers: Map<string, string> = new Map()

  constructor(init?: HeadersInit) {
    if (init) {
      if (Array.isArray(init)) {
        init.forEach(([key, value]) =>
          this.headers.set(key.toLowerCase(), value)
        )
      } else if (init instanceof MockHeaders) {
        init.headers.forEach((value, key) => this.headers.set(key, value))
      } else {
        Object.entries(init).forEach(([key, value]) =>
          this.headers.set(key.toLowerCase(), value)
        )
      }
    }
  }

  get(name: string): string | null {
    return this.headers.get(name.toLowerCase()) || null
  }

  set(name: string, value: string): void {
    this.headers.set(name.toLowerCase(), value)
  }

  has(name: string): boolean {
    return this.headers.has(name.toLowerCase())
  }

  delete(name: string): void {
    this.headers.delete(name.toLowerCase())
  }

  append(name: string, value: string): void {
    const existing = this.headers.get(name.toLowerCase())
    this.headers.set(
      name.toLowerCase(),
      existing ? `${existing}, ${value}` : value
    )
  }

  forEach(
    callback: (value: string, key: string, parent: MockHeaders) => void
  ): void {
    this.headers.forEach((value, key) => callback(value, key, this))
  }

  entries(): IterableIterator<[string, string]> {
    return this.headers.entries()
  }

  keys(): IterableIterator<string> {
    return this.headers.keys()
  }

  values(): IterableIterator<string> {
    return this.headers.values()
  }
}

class MockRequest {
  private _url: string
  public method: string
  public headers: MockHeaders
  private _body: BodyInit | null

  constructor(input: string | MockRequest, init?: RequestInit) {
    if (typeof input === 'string') {
      this._url = input
    } else {
      this._url = input.url
    }
    this.method = init?.method || 'GET'
    this.headers = new MockHeaders(init?.headers)
    this._body = init?.body || null
  }

  get url(): string {
    return this._url
  }

  async json(): Promise<unknown> {
    if (typeof this._body === 'string') {
      return JSON.parse(this._body)
    }
    return {}
  }

  async text(): Promise<string> {
    if (typeof this._body === 'string') {
      return this._body
    }
    return ''
  }

  async formData(): Promise<FormData> {
    return new FormData()
  }
}

class MockResponse {
  public status: number
  public statusText: string
  public headers: MockHeaders
  public ok: boolean
  private _body: unknown

  constructor(body?: BodyInit | null, init?: ResponseInit) {
    this._body = body
    this.status = init?.status || 200
    this.statusText = init?.statusText || 'OK'
    this.headers = new MockHeaders(init?.headers)
    this.ok = this.status >= 200 && this.status < 300
  }

  async json(): Promise<unknown> {
    if (typeof this._body === 'string') {
      return JSON.parse(this._body)
    }
    return this._body
  }

  async text(): Promise<string> {
    if (typeof this._body === 'string') {
      return this._body
    }
    return JSON.stringify(this._body)
  }

  static json(data: unknown, init?: ResponseInit): MockResponse {
    return new MockResponse(JSON.stringify(data), {
      ...init,
      headers: {
        ...((init?.headers as Record<string, string>) || {}),
        'Content-Type': 'application/json'
      }
    })
  }
}

// Only set if not already defined (Node 18+ has native fetch)
if (typeof global.Request === 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(global as any).Request = MockRequest
}

if (typeof global.Response === 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(global as any).Response = MockResponse
}

if (typeof global.Headers === 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(global as any).Headers = MockHeaders
}

// Ensure File.arrayBuffer is available (Node 18+ should have it, but ensure it for tests)
// File extends Blob, and Blob should have arrayBuffer in Node 18+, but we ensure it's available
// Do this after Response is set up so we can use it if needed
if (typeof global.File !== 'undefined' && global.File.prototype) {
  const originalArrayBuffer = global.File.prototype.arrayBuffer
  // Check if arrayBuffer exists and is a function
  if (!originalArrayBuffer || typeof originalArrayBuffer !== 'function') {
    // If arrayBuffer doesn't exist, add it - File extends Blob, so try Blob's arrayBuffer first
    if (
      typeof global.Blob !== 'undefined' &&
      global.Blob.prototype &&
      typeof global.Blob.prototype.arrayBuffer === 'function'
    ) {
      global.File.prototype.arrayBuffer = global.Blob.prototype.arrayBuffer
    } else if (typeof global.Response !== 'undefined') {
      // Fallback to Response if Blob doesn't have it
      global.File.prototype.arrayBuffer = function (
        this: File
      ): Promise<ArrayBuffer> {
        return new global.Response(this).arrayBuffer()
      }
    }
  }
}

// Mock next-auth to avoid ESM import issues
// Create a mock CredentialsSignin error class
class MockCredentialsSignin extends Error {
  type = 'CredentialsSignin'
  cause?: Error

  constructor(message?: string, options?: { cause?: Error }) {
    super(message)
    this.name = 'CredentialsSignin'
    this.cause = options?.cause
  }
}

jest.mock('next-auth', () => {
  const mockHandlers = {
    GET: jest.fn(),
    POST: jest.fn()
  }
  const mockSignIn = jest.fn()
  const mockSignOut = jest.fn()
  const mockAuth = jest.fn()

  const NextAuth = jest.fn(() => ({
    handlers: mockHandlers,
    signIn: mockSignIn,
    signOut: mockSignOut,
    auth: mockAuth
  }))

  return {
    __esModule: true,
    default: NextAuth,
    NextAuth,
    CredentialsSignin: MockCredentialsSignin
  }
})

jest.mock('next-auth/providers/credentials', () => ({
  __esModule: true,
  default: jest.fn((config) => ({
    id: 'credentials',
    name: 'Credentials',
    type: 'credentials',
    ...config
  }))
}))

jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
  signOut: jest.fn(),
  useSession: jest.fn(() => ({
    data: null,
    status: 'unauthenticated'
  })),
  SessionProvider: ({ children }: { children: React.ReactNode }) => children
}))

// Mock next/server for API route testing
// NextRequest and NextResponse need special handling as they extend native Request/Response
jest.mock('next/server', () => {
  class MockNextRequest {
    private _url: string
    public method: string
    public headers: Map<string, string>
    private _body: BodyInit | null
    public nextUrl: URL

    constructor(input: string | URL | Request, init?: RequestInit) {
      const urlString =
        typeof input === 'string'
          ? input
          : input instanceof URL
            ? input.toString()
            : input.url
      this._url = urlString
      this.nextUrl = new URL(urlString)
      this.method = init?.method || 'GET'
      this.headers = new Map()
      if (init?.headers) {
        if (init.headers instanceof Headers || init.headers instanceof Map) {
          init.headers.forEach((value: string, key: string) =>
            this.headers.set(key.toLowerCase(), value)
          )
        } else if (Array.isArray(init.headers)) {
          init.headers.forEach(([key, value]) =>
            this.headers.set(key.toLowerCase(), value)
          )
        } else {
          Object.entries(init.headers).forEach(([key, value]) =>
            this.headers.set(key.toLowerCase(), value)
          )
        }
      }
      this._body = init?.body || null
    }

    get url(): string {
      return this._url
    }

    async json(): Promise<unknown> {
      if (typeof this._body === 'string') {
        return JSON.parse(this._body)
      }
      return {}
    }

    async text(): Promise<string> {
      if (typeof this._body === 'string') {
        return this._body
      }
      return ''
    }

    async formData(): Promise<FormData> {
      return new FormData()
    }
  }

  class MockNextResponse {
    public status: number
    public statusText: string
    public headers: Map<string, string>
    public ok: boolean
    private _body: unknown

    constructor(body?: BodyInit | null, init?: ResponseInit) {
      this._body = body
      this.status = init?.status || 200
      this.statusText = init?.statusText || 'OK'
      this.headers = new Map()
      if (init?.headers) {
        if (init.headers instanceof Map) {
          init.headers.forEach((value, key) => this.headers.set(key, value))
        } else if (Array.isArray(init.headers)) {
          init.headers.forEach(([key, value]) => this.headers.set(key, value))
        } else {
          Object.entries(init.headers as Record<string, string>).forEach(
            ([key, value]) => this.headers.set(key, value)
          )
        }
      }
      this.ok = this.status >= 200 && this.status < 300
    }

    async json(): Promise<unknown> {
      if (typeof this._body === 'string') {
        return JSON.parse(this._body)
      }
      return this._body
    }

    async text(): Promise<string> {
      if (typeof this._body === 'string') {
        return this._body
      }
      return JSON.stringify(this._body)
    }

    static json(data: unknown, init?: ResponseInit): MockNextResponse {
      return new MockNextResponse(JSON.stringify(data), {
        ...init,
        headers: {
          ...((init?.headers as Record<string, string>) || {}),
          'Content-Type': 'application/json'
        }
      })
    }
  }

  return {
    NextRequest: MockNextRequest,
    NextResponse: MockNextResponse
  }
})
