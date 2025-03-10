export interface User {
  id: string
  email: string
  password: string // In a real app, this would be a hash
  name: string
}
