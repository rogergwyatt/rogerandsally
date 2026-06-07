'use client'
import { useState, useRef } from 'react'
import { upload } from '@vercel/blob/client'

const ACCEPT = '.png,.jpg,.jpeg,.svg,.pdf'
const MAX_BYTES = 25 * 1024 * 1024

export default function GraphicUpload({
  value,
  onChange,
  label = 'Upload a graphic to engrave (optional)',
}: {
  value?: string
  onChange: (url: string | undefined, filename?: string) => void
  label?: string
}) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [filename, setFilename] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setError('')

    if (file.size > MAX_BYTES) {
      setError('File is too large (max 25 MB).')
      return
    }

    setUploading(true)
    try {
      const blob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/upload',
      })
      setFilename(file.name)
      onChange(blob.url, file.name)
    } catch (err: any) {
      setError(err.message ?? 'Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  function clearFile() {
    setFilename('')
    onChange(undefined)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div>
      <label className="block text-walnut font-semibold mb-2">{label}</label>
      {value ? (
        <div className="flex items-center justify-between gap-3 border border-maple rounded px-3 py-2 bg-white">
          <a href={value} target="_blank" rel="noopener noreferrer" className="text-forest text-sm hover:underline truncate">
            {filename || 'View uploaded graphic'}
          </a>
          <button type="button" onClick={clearFile} className="text-xs text-slate hover:text-cherry flex-shrink-0">
            Remove
          </button>
        </div>
      ) : (
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          disabled={uploading}
          onChange={handleFile}
          className="block w-full text-sm text-slate file:mr-3 file:py-2 file:px-4 file:rounded file:border-0 file:bg-forest file:text-white file:text-sm file:font-semibold hover:file:bg-opacity-90 disabled:opacity-50"
        />
      )}
      {uploading && <p className="text-xs text-slate mt-1">Uploading…</p>}
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
      <p className="text-xs text-slate mt-1">PNG, JPG, SVG, or PDF · max 25 MB</p>
    </div>
  )
}
