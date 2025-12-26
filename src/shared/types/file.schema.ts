/**
 * File Schema
 *
 * Zod schema for file validation in forms.
 */
import { z } from 'zod'

export const FileSchema = z.preprocess((val) => {
  if (typeof File !== 'undefined' && val instanceof File) {
    return val
  }
  return undefined
}, z.instanceof(File))

export type FileInput = z.infer<typeof FileSchema>
