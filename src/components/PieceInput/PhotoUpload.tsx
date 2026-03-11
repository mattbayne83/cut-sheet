import { Camera, Loader2 } from 'lucide-react'
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
      if (!file.type.startsWith('image/')) {
        setExtractionError('Please upload an image file (JPEG, PNG, or WebP).')
        return
      }

      const objectUrl = URL.createObjectURL(file)
      setUploadedPhoto(objectUrl)
      setExtractionResult(null)
      setExtractionError(null)

      if (!geminiApiKey) {
        setExtractionStatus('idle')
        return
      }

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
    <div className="bg-surface rounded-[var(--radius-card)] border border-border overflow-hidden">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
        className="px-4 py-8 flex flex-col items-center gap-3 cursor-pointer hover:bg-surface-raised/50 transition-colors"
      >
        {extractionStatus === 'extracting' ? (
          <>
            <Loader2 size={32} className="text-primary animate-spin" />
            <p className="text-[15px] text-text-secondary">Reading your sketch...</p>
          </>
        ) : (
          <>
            <div className="w-14 h-14 rounded-full bg-primary-light flex items-center justify-center">
              <Camera size={24} className="text-primary" />
            </div>
            <div className="text-center">
              <p className="text-[15px] text-text-secondary font-medium">
                Snap a photo of your sketch
              </p>
              <p className="text-[13px] text-text-muted mt-0.5">
                or drop an image here
              </p>
            </div>
          </>
        )}
      </div>

      {!geminiApiKey && (
        <div className="px-4 py-2.5 bg-warning-light border-t border-warning/20 text-[13px] text-warning">
          Add a{' '}
          <button
            onClick={(e) => {
              e.stopPropagation()
              setSettingsOpen(true)
            }}
            className="underline hover:text-primary-hover font-medium"
          >
            Gemini API key
          </button>{' '}
          in settings to enable photo extraction.
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
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
      const base64 = result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
