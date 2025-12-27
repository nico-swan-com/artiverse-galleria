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

Retrieve an image by ID with optional processing.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Media UUID |

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `quality` | number | 80 | Image quality (1-100) |
| `width` | number | - | Resize width (maintains aspect ratio) |
| `height` | number | - | Resize height (maintains aspect ratio) |
| `watermark` | "1" \| "0" | "0" | Enable watermarking |
| `wmText` | string | - | Watermark text |
| `wmLogo` | string | - | Watermark logo filename (from /public) |
| `wmPos` | string | "southeast" | Watermark position (gravity) |
| `wmOpacity` | number | 0.5 | Watermark opacity (0-1) |
| `wmScale` | number | 0.2 | Watermark scale relative to image |
| `skipWatermark` | "1" | - | Skip watermark for system assets |
| `t` | number | - | Cache-busting timestamp |

**Response:** Image binary with appropriate `Content-Type` header.

**Caching:** Uses ETag for conditional requests. Returns `304 Not Modified` if content unchanged.

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

**Response:** Array of artist objects with pagination metadata.

---

#### `GET /api/artists/all`

Alternative endpoint - same as `/api/artists`.

---

### Admin

#### `GET /api/admin/users`

Get all users. **Requires admin authentication.**

**Response:** Array of user objects.

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
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 500 | Internal Server Error |
