export function getImageSrc(fileOrUrl: string | File | undefined): string {
  if (typeof fileOrUrl === 'string') {
    return fileOrUrl
  }
  if (typeof File !== 'undefined' && fileOrUrl instanceof File) {
    return URL.createObjectURL(fileOrUrl)
  }
  return '' // Or a placeholder image URL
}
