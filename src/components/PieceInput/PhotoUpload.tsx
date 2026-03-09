import { Upload, Camera, Loader2 } from 'lucide-react'
import { useCallback, useRef } from 'react'
import { useAppStore } from '../../store/useAppStore'
import { extractDimensionsFromPhoto } from '../../services/gemini'
import { PhotoPreview } from './PhotoPreview'

export function PhotoUpload() {
  const geminiApiKey = useAppStore((s) => s.geminiApiKey)
  const uploadedPhotoUrl = useAppStore((s) => s.uploadedPhotoUrl)
  const extractionStatus = useAppStore((s) => s.extractionStatus)
  const setUploadedPhoto = useAppStore((s) => s.setUploadedPhoto)
  const setExtractionStatus = useAppStore((s) => s.setExtractionStatus)
  const setExtractionResult = useAppStore((s) => s.setExtractionResult)
  const setExtractionError = useAppStore((s) => s.setExtractionError)
  const setSettingsOpen = useAppStore((s) => s.setSettingsOpen)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(
    async (file: File) => {
      // Validate type
      if (!file.type.startsWith('image/')) {
        setExtractionError('Please upload an image file (JPEG, PNG, or WebP).')
        return
      }

      // Create object URL for preview
      const objectUrl = URL.createObjectURL(file)
      setUploadedPhoto(objectUrl)
      setExtractionResult(null)
      setExtractionError(null)

      if (!geminiApiKey) {
        setExtractionStatus('idle')
        return
      }

      // Read as base64 and extract
      setExtractionStatus('extracting')
      try {
        const base64 = await fileToBase64(file)
        const result = await extractDimensionsFromPhoto(base64, file.type, geminiApiKey)
        setExtractionResult(result)
        setExtractionStatus('done')
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to extract dimensions'
        setExtractionError(message)
        setExtractionStatus('error')
      }
    },
    [geminiApiKey, setUploadedPhoto, setExtractionStatus, setExtractionResult, setExtractionError]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  if (uploadedPhotoUrl) {
    return <PhotoPreview />
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-2">
          <Camera size={14} />
          Sketch Photo
          <span className="text-xs font-normal text-gray-400 normal-case">(optional)</span>
        </h2>
      </div>

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
        className="px-6 py-10 flex flex-col items-center gap-3 cursor-pointer hover:bg-gray-50/50 transition-colors"
      >
        {extractionStatus === 'extracting' ? (
          <>
            <Loader2 size={32} className="text-blue-500 animate-spin" />
            <p className="text-sm text-gray-500">Extracting dimensions...</p>
          </>
        ) : (
          <>
            <Upload size={32} className="text-gray-300" />
            <p className="text-sm text-gray-500">
              Drop a photo of your sketch here, or click to browse
            </p>
            <p className="text-xs text-gray-400">JPEG, PNG, or WebP</p>
          </>
        )}
      </div>

      {!geminiApiKey && (
        <div className="px-4 py-2 bg-amber-50 border-t border-amber-100 text-xs text-amber-700">
          Add a{' '}
          <button
            onClick={(e) => {
              e.stopPropagation()
              setSettingsOpen(true)
            }}
            className="underline hover:text-amber-900"
          >
            Gemini API key
          </button>{' '}
          in settings to enable automatic dimension extraction.
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
        }}
        className="hidden"
      />
    </div>
  )
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      // Strip the data URL prefix to get raw base64
      const base64 = result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
