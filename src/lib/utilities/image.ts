export function encodeImageBufferToDataUrl(buffer: Buffer): string {
  // PNG magic number: 89 50 4E 47 0D 0A 1A 0A
  const isJpeg =
    buffer.length > 3 &&
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff
  let mime = 'image/png'
  if (isJpeg) mime = 'image/jpeg'
  return `data:${mime};base64,${buffer.toString('base64')}`
}
