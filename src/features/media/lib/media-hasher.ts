import crypto from 'crypto'

/**
 * Media hashing utility
 * Handles content hashing for duplicate detection
 * Uses SHA-256 algorithm to generate unique content identifiers
 */
export class MediaHasher {
  /**
   * Calculate SHA-256 hash of media data for duplicate detection
   * @param data - Buffer or File containing media data
   * @returns SHA-256 hash as hexadecimal string
   */
  static async calculateHash(data: Buffer | File): Promise<string> {
    let buffer: Buffer

    if (data instanceof File) {
      buffer = Buffer.from(await data.arrayBuffer())
    } else {
      buffer = data
    }

    return crypto.createHash('sha256').update(buffer).digest('hex')
  }
}
