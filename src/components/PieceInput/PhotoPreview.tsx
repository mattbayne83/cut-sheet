import { Check, X, RefreshCw, Loader2, AlertCircle } from 'lucide-react'
import { useState } from 'react'
import { useAppStore } from '../../store/useAppStore'

export function PhotoPreview() {
  const uploadedPhotoUrl = useAppStore((s) => s.uploadedPhotoUrl)
  const extractionStatus = useAppStore((s) => s.extractionStatus)
  const extractionResult = useAppStore((s) => s.extractionResult)
  const extractionError = useAppStore((s) => s.extractionError)
  const setUploadedPhoto = useAppStore((s) => s.setUploadedPhoto)
  const setExtractionStatus = useAppStore((s) => s.setExtractionStatus)
  const setExtractionResult = useAppStore((s) => s.setExtractionResult)
  const setExtractionError = useAppStore((s) => s.setExtractionError)
  const importExtractedPieces = useAppStore((s) => s.importExtractedPieces)
  const geminiApiKey = useAppStore((s) => s.geminiApiKey)

  const [selected, setSelected] = useState<Set<number>>(() => {
    const all = new Set<number>()
    if (extractionResult) {
      extractionResult.pieces.forEach((_, i) => all.add(i))
    }
    return all
  })

  const clearPhoto = () => {
    if (uploadedPhotoUrl) URL.revokeObjectURL(uploadedPhotoUrl)
    setUploadedPhoto(null)
    setExtractionResult(null)
    setExtractionError(null)
    setExtractionStatus('idle')
  }

  const toggleSelection = (index: number) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  const handleImport = () => {
    if (!extractionResult) return
    const selectedPieces = extractionResult.pieces.filter((_, i) => selected.has(i))
    if (selectedPieces.length > 0) {
      importExtractedPieces(selectedPieces)
    }
    clearPhoto()
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          Sketch Photo
        </h2>
        <button
          onClick={clearPhoto}
          className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors"
        >
          <X size={12} />
          Remove
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:divide-x divide-gray-100">
        {/* Photo */}
        <div className="p-4">
          {uploadedPhotoUrl && (
            <img
              src={uploadedPhotoUrl}
              alt="Uploaded sketch"
              className="w-full rounded-lg border border-gray-200 object-contain max-h-64"
            />
          )}
        </div>

        {/* Extraction results */}
        <div className="p-4">
          {extractionStatus === 'extracting' && (
            <div className="flex flex-col items-center justify-center h-full gap-2 py-8">
              <Loader2 size={24} className="text-blue-500 animate-spin" />
              <p className="text-sm text-gray-500">Analyzing sketch...</p>
            </div>
          )}

          {extractionStatus === 'error' && (
            <div className="flex flex-col items-center gap-2 py-8">
              <AlertCircle size={24} className="text-red-400" />
              <p className="text-sm text-red-600">{extractionError}</p>
              {geminiApiKey && (
                <button
                  onClick={clearPhoto}
                  className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                >
                  <RefreshCw size={14} />
                  Try again
                </button>
              )}
            </div>
          )}

          {extractionStatus === 'idle' && !geminiApiKey && (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <p className="text-sm text-gray-500">
                Add a Gemini API key in settings to extract dimensions automatically.
              </p>
              <p className="text-xs text-gray-400">
                Or enter pieces manually in the table below.
              </p>
            </div>
          )}

          {extractionStatus === 'done' && extractionResult && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    extractionResult.confidence === 'high'
                      ? 'bg-green-100 text-green-700'
                      : extractionResult.confidence === 'medium'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-red-100 text-red-700'
                  }`}
                >
                  {extractionResult.confidence} confidence
                </span>
              </div>

              {extractionResult.notes && (
                <p className="text-xs text-gray-500 mb-3 italic">{extractionResult.notes}</p>
              )}

              <div className="space-y-1.5 mb-4 max-h-40 overflow-y-auto">
                {extractionResult.pieces.map((piece, i) => (
                  <label
                    key={i}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={selected.has(i)}
                      onChange={() => toggleSelection(i)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700 font-medium flex-1">{piece.label}</span>
                    <span className="text-gray-500 text-xs">
                      {piece.width}" × {piece.height}"
                    </span>
                    <span className="text-gray-400 text-xs">×{piece.quantity}</span>
                  </label>
                ))}
              </div>

              <button
                onClick={handleImport}
                disabled={selected.size === 0}
                className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                <Check size={16} />
                Import {selected.size} piece{selected.size !== 1 ? 's' : ''}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
