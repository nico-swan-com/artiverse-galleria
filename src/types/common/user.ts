export interface User {
  id: string
  email: string
  password: string
  name: string
  role: string
  createdAt: Date
  avatar: string | null // can be a base64 string, URL, or null
  status: string
}
