import '@testing-library/jest-dom'
import { render, fireEvent, waitFor, screen, act } from '@testing-library/react'
import MediaUploadForm from './MediaUploadForm'

global.URL.createObjectURL = jest.fn(() => 'mock-url')

jest.mock('browser-image-compression', () => jest.fn(async (file) => file))

interface MediaMetaData {
  fileName: string
  altText: string
  tags: string[]
}

jest.mock('./EditImageDialog', () => ({
  __esModule: true,
  default: ({
    open,
    onOpenChange,
    onSave,
    loading
  }: {
    open: boolean
    onOpenChange: (open: boolean) => void
    file: File | null
    onSave: (meta: MediaMetaData) => void
    loading: boolean
  }) => {
    if (!open) return null
    return (
      <div role='dialog'>
        <button
          onClick={() =>
            onSave({ fileName: 'test.png', altText: '', tags: [] })
          }
          disabled={loading}
        >
          Save & Apply
        </button>
        <button onClick={() => onOpenChange(false)}>Cancel</button>
      </div>
    )
  }
}))

describe('MediaUploadForm', () => {
  const existingMedia = [{ fileName: 'existing.png', contentHash: 'abc123' }]
  const onUpload = jest.fn().mockResolvedValue(undefined)

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('shows duplicate modal if file matches existing hash', async () => {
    render(
      <MediaUploadForm
        onUpload={onUpload}
        loading={false}
        existingMedia={existingMedia}
      />
    )
    const file = new File(['test'], 'existing.png', { type: 'image/png' })
    Object.defineProperty(global, 'crypto', {
      value: {
        subtle: { digest: async () => new Uint8Array([0xab, 0xc1, 0x23]) }
      },
      configurable: true
    })
    await act(async () => {
      fireEvent.change(screen.getByLabelText(/file/i), {
        target: { files: [file] }
      })
    })
    await waitFor(() =>
      expect(screen.getByText(/duplicate file detected/i)).toBeInTheDocument()
    )
  })

  it('shows file size modal if file is too large', async () => {
    render(
      <MediaUploadForm onUpload={onUpload} loading={false} existingMedia={[]} />
    )
    const file = new File([new ArrayBuffer(6 * 1024 * 1024)], 'big.png', {
      type: 'image/png'
    })
    await act(async () => {
      fireEvent.change(screen.getByLabelText(/file/i), {
        target: { files: [file] }
      })
    })
    await waitFor(() =>
      expect(screen.getByText(/file too large/i)).toBeInTheDocument()
    )
  })

  it('disables file input when loading', () => {
    render(
      <MediaUploadForm onUpload={onUpload} loading={true} existingMedia={[]} />
    )
    expect(screen.getByLabelText(/file/i)).toBeDisabled()
  })

  it('disables save button in dialog when loading', async () => {
    const { rerender } = render(
      <MediaUploadForm onUpload={onUpload} loading={false} existingMedia={[]} />
    )
    const file = new File(['test'], 'test.png', { type: 'image/png' })
    await act(async () => {
      fireEvent.change(screen.getByLabelText(/file/i), {
        target: { files: [file] }
      })
    })
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument())
    // Simulate loading state by re-rendering with loading=true
    // Re-render the dialog with loading=true to ensure the button is disabled
    rerender(
      <MediaUploadForm onUpload={onUpload} loading={true} existingMedia={[]} />
    )
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /save & apply/i })
      ).toBeDisabled()
    })
  })
})
