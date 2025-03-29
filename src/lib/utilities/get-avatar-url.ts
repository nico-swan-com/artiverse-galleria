import crypto from 'crypto'

export const getAvatarUrl = (
  email: string,
  name: string
): string | undefined => {
  if (email && name) {
    const trimmedEmail = email.trim().toLowerCase()
    const hash = crypto.createHash('sha256').update(trimmedEmail).digest('hex')
    return `https://www.gravatar.com/avatar/${hash}?d=https%3A%2F%2Fui-avatars.com%2Fapi%2F/${encodeURI(name)}/128`
  }
  return
}
