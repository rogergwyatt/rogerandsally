'use client'
import { useRef, useState } from 'react'
import { upload } from '@vercel/blob/client'

const MAX_BYTES = 200 * 1024 * 1024 // 200 MB

export default function VideoUpload({
  value,
  onChange,
  onUploadingChange,
  label = 'Product video (optional)',
}: {
  value?: string
  onChange: (url: string | undefined) => void
  onUploadingChange?: (uploading: boolean) => void
  label?: string
}) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setError('')
    if (file.size > MAX_BYTES) {
      setError('Video is too large (max 200 MB).')
      if (inputRef.current) inputRef.current.value = ''
      return
    }

    setUploading(true)
    onUploadingChange?.(true)
    setProgress(0)
    try {
      const blob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/upload/video',
        onUploadProgress: ({ percentage }) => setProgress(Math.round(percentage)),
      })
      onChange(blob.url)
    } catch (err: any) {
      setError(err.message ?? 'Upload failed. Please try again.')
      if (inputRef.current) inputRef.current.value = ''
    } finally {
      setUploading(false)
      onUploadingChange?.(false)
    }
  }

  function clearFile() {
    onChange(undefined)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div>
      <label className="block text-walnut font-semibold mb-2">{label}</label>
      {value ? (
        <div className="flex items-center justify-between gap-3 border border-maple rounded px-3 py-2 bg-white">
          <video src={value} className="h-16 rounded" muted />
          <a href={value} target="_blank" rel="noopener noreferrer" className="text-forest text-sm hover:underline truncate flex-1">
            View uploaded video
          </a>
          <button type="button" onClick={clearFile} className="text-xs text-slate hover:text-cherry flex-shrink-0">
            Remove
          </button>
        </div>
      ) : (
        <input
          ref={inputRef}
          type="file"
          accept="video/mp4,video/quicktime,video/webm"
          disabled={uploading}
          onChange={handleFile}
          className="block w-full text-sm text-slate file:mr-3 file:py-2 file:px-4 file:rounded file:border-0 file:bg-forest file:text-white file:text-sm file:font-semibold hover:file:bg-opacity-90 disabled:opacity-50"
        />
      )}
      {uploading && <p className="text-xs text-slate mt-1">Uploading… {progress}%</p>}
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
      <p className="text-xs text-slate mt-1">MP4, MOV, or WebM · max 200 MB</p>
    </div>
  )
}
