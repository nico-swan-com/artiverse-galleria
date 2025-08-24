import { z } from 'zod'

export const FileSchema = z.preprocess((val) => {
  if (typeof File !== 'undefined' && val instanceof File) {
    return val
  }
  return undefined
}, z.instanceof(File))
