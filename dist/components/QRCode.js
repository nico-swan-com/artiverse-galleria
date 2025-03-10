import React, { useRef, useEffect } from 'react'
import QRCodeLib from 'qrcode'
import { Download } from 'lucide-react'
const QRCode = ({
  url,
  size = 200,
  includeMargin = true,
  downloadEnabled = true,
  title = 'Artwork QR Code'
}) => {
  const canvasRef = useRef(null)
  useEffect(() => {
    if (canvasRef.current) {
      QRCodeLib.toCanvas(
        canvasRef.current,
        url,
        {
          width: size,
          margin: includeMargin ? 4 : 0,
          color: {
            dark: '#121212',
            light: '#FFFFFF'
          }
        },
        (error) => {
          if (error) console.error('Error generating QR code:', error)
        }
      )
    }
  }, [url, size, includeMargin])
  const downloadQRCode = () => {
    if (canvasRef.current) {
      const link = document.createElement('a')
      link.download = `${title.replace(/\s+/g, '-').toLowerCase()}.png`
      link.href = canvasRef.current.toDataURL('image/png')
      link.click()
    }
  }
  return (
    <div className='qr-code-container'>
      <canvas ref={canvasRef} width={size} height={size} />
      <p className='mt-2 text-center text-xs text-gallery-dark-gray'>
        Scan to view online
      </p>
      {downloadEnabled && (
        <button
          onClick={downloadQRCode}
          className='mt-3 flex items-center justify-center text-xs text-gallery-dark-gray transition-colors hover:text-gallery-black'
          aria-label='Download QR Code'
        >
          <Download size={14} className='mr-1' />
          <span>Download</span>
        </button>
      )}
    </div>
  )
}
export default QRCode
