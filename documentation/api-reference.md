# Artiverse Galleria API Reference

This document provides comprehensive documentation for the Artiverse Galleria REST API.

## Base URL

```
/api
```

## Authentication

The API uses **NextAuth.js** session-based authentication. Protected endpoints require a valid session cookie obtained after signing in via `/login`.

---

## Endpoints

### Authentication

#### `GET/POST /api/auth/[...nextauth]`

NextAuth.js catch-all route handling all authentication flows including sign-in, sign-out, callbacks, and session management.

**Note:** Handled automatically by NextAuth.js. See [NextAuth.js documentation](https://next-auth.js.org/) for details.

---

### Media

#### `GET /api/media`

List all media files.

**Response:**

```json
[
  {
    "id": "uuid",
    "fileName": "image.jpg",
    "mimeType": "image/jpeg",
    "fileSize": 102400,
    "alt": "Description",
    "tags": ["art", "painting"],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

#### `POST /api/media`

Upload a single image file.

**Request:** `multipart/form-data`
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | File | Yes | Image file to upload |

**Response:**

```json
{
  "id": "uuid",
  "fileName": "image.jpg",
  "mimeType": "image/jpeg",
  "fileSize": 102400
}
```

---

#### `GET /api/media/list`

Alternative endpoint to list all media with wrapper response.

**Response:**

```json
{
  "success": true,
  "media": [...]
}
```

---

#### `POST /api/media/upload`

Batch upload multiple files.

**Request:** `multipart/form-data`
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | File[] | Yes | One or more image files |

**Response:**

```json
{
  "success": true,
  "files": [
    { "id": "uuid1", "url": "/api/media/uuid1" },
    { "id": "uuid2", "url": "/api/media/uuid2" }
  ]
}
```

---

#### `GET /api/media/[id]`

Retrieve an image by ID with optional processing, resizing, compression, and watermarking.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Media UUID |

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `quality` | number | 80 | Image quality (1-100). Applied to JPEG/WebP compression |
| `width` | number | - | Resize width in pixels (maintains aspect ratio, fits inside) |
| `height` | number | - | Resize height in pixels (maintains aspect ratio, fits inside) |
| `watermark` | "1" \| "0" | "0" | Enable watermarking (set to "1" to enable) |
| `wmText` | string | "" | Watermark text (used if `wmLogo` not provided) |
| `wmLogo` | string | "" | Watermark logo filename from `/public` directory |
| `wmPos` | string | "southeast" | Watermark position (Sharp gravity: "north", "south", "east", "west", "northeast", "northwest", "southeast", "southwest", "center") |
| `wmOpacity` | number | 0.5 | Watermark opacity (0-1) |
| `wmScale` | number | 0.2 | Watermark scale relative to image width (0-1) |
| `skipWatermark` | "1" | - | Skip watermark for system assets (set to "1" to skip) |
| `t` | number | - | Cache-busting timestamp (disables caching when present) |

**Response:**

- **Content-Type:** Image binary (`image/jpeg`, `image/png`, or `image/webp` depending on processing)
- **Content-Length:** Size of processed image in bytes
- **ETag:** Weak ETag for conditional requests
- **Cache-Control:** `public, max-age=60, no-cache` (or `no-store, no-cache, must-revalidate, proxy-revalidate` if `t` parameter present)

**Caching:**

- Uses ETag (`W/"..."`) for conditional requests
- Returns `304 Not Modified` if `If-None-Match` header matches ETag
- Cache-Control headers set based on query parameters

**Image Processing:**

- Large PNGs (>500KB) are automatically converted to WebP for better compression
- Processed images are only served if smaller than original
- Supports JPEG, PNG, and WebP formats

---

#### `DELETE /api/media/[id]`

Delete a media file by ID.

**Response:**

```json
{ "success": true }
```

---

#### `PATCH /api/media/[id]`

Update media metadata.

**Request Body:**

```json
{
  "fileName": "new-name.jpg",
  "alt": "Updated description",
  "tags": ["updated", "tags"]
}
```

**Response:** Updated media object.

---

### Artists

#### `GET /api/artists`

Get all artists (public endpoint).

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `sortBy` | string | "name" | Sort field (name, createdAt, updatedAt, etc.) |
| `order` | "ASC" \| "DESC" | "DESC" | Sort order |

**Response:**

```json
{
  "artists": [
    {
      "id": "uuid",
      "name": "Artist Name",
      "image": "url",
      "biography": "Bio text",
      "specialization": "Painting",
      "location": "City, Country",
      "email": "artist@example.com",
      "website": "https://example.com",
      "styles": ["abstract", "modern"],
      "exhibitions": ["Exhibition 1", "Exhibition 2"],
      "statement": "Artist statement",
      "featured": false
    }
  ],
  "total": 10
}
```

**Rate Limiting:** 100 requests per minute per IP

---

#### `GET /api/artists/all`

Alternative endpoint - same as `/api/artists` (no rate limiting applied).

---

### Admin

#### `GET /api/admin/users`

Get all users. **Requires admin authentication.**

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 10 | Items per page |
| `sortBy` | string | "createdAt" | Sort field |
| `order` | "ASC" \| "DESC" | "DESC" | Sort order |

**Response:**

```json
{
  "users": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "name": "User Name",
      "role": "Client",
      "status": "Active",
      "avatar": "url",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 50
}
```

**Note:** Password fields are excluded from responses.

---

### Billing

#### `POST /api/billing/webhook`

PayFast Instant Transaction Notification (ITN) webhook.

**Request:** `application/x-www-form-urlencoded` (sent by PayFast)

Key fields:

- `pf_payment_id` - PayFast payment ID
- `m_payment_id` - Order ID
- `payment_status` - COMPLETE, FAILED, PENDING, etc.
- `signature` - MD5 signature for validation

**Response:** `200 OK` with empty body on success.

---

#### `GET /api/billing/webhook`

Health check for webhook endpoint.

**Response:**

```json
{ "status": "Webhook endpoint active" }
```

**Rate Limiting:** 200 requests per minute per IP

---

### Health

#### `GET /api/health/database`

Database health check endpoint. Checks database connectivity and returns basic metrics.

**Response (Healthy):**

```json
{
  "status": "healthy",
  "database": {
    "connected": true,
    "responseTime": "5ms",
    "timestamp": "2024-01-01T00:00:00.000Z"
  },
  "stats": {
    "users": 10,
    "products": 25,
    "artists": 5,
    "media": 50
  }
}
```

**Response (Unhealthy):**

```json
{
  "status": "unhealthy",
  "database": {
    "connected": false,
    "error": "Connection timeout"
  }
}
```

**Status Codes:**

- `200` - Database is healthy
- `503` - Database is unhealthy or connection failed

---

## Error Responses

All endpoints return standardized error responses:

```json
{
  "error": "Error message",
  "statusCode": 400
}
```

**Common Status Codes:**
| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid input or validation error |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 429 | Too Many Requests - Rate limit exceeded (includes `Retry-After` header) |
| 500 | Internal Server Error |
| 503 | Service Unavailable - Database or service unavailable |

## Rate Limiting

The API implements rate limiting to prevent abuse:

| Endpoint Category                                | Limit        | Window     |
| ------------------------------------------------ | ------------ | ---------- |
| Authentication (`/login`, `/register`)           | 5 requests   | 15 minutes |
| Media Upload (`/api/media`, `/api/media/upload`) | 10 requests  | 1 minute   |
| General API Routes                               | 100 requests | 1 minute   |
| Webhook Endpoints                                | 200 requests | 1 minute   |

**Rate Limit Response:**
When rate limit is exceeded, the API returns:

- **Status Code:** `429 Too Many Requests`
- **Headers:** `Retry-After: <seconds>`
- **Body:** Error message with retry information

## Authentication

Protected endpoints require:

- Valid NextAuth.js session cookie
- Appropriate user role (for admin endpoints)

**Authentication Methods:**

- Session-based authentication via NextAuth.js
- JWT tokens stored in secure HTTP-only cookies
- Role-based access control (RBAC) for admin endpoints

**Getting Authenticated:**

1. POST credentials to `/api/auth/signin` or use `/login` page
2. Receive session cookie automatically
3. Include cookie in subsequent requests
