export type Artist = {
  id: string
  name: string
  bio: string
  photoUrl: string
  coverImageUrl: string
  featured: boolean
  styles: string[]
  contact?: {
    email?: string
    website?: string
    instagram?: string
  }
  // Adding missing properties needed by components
  profileImage: string
  biography: string
  specialization: string
  location: string
  email: string
  website?: string
  exhibitions?: string[]
  statement?: string
}
