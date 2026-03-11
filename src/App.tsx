import { useRef } from 'react'
import { Header } from './components/Header'
import { PieceTable } from './components/PieceInput/PieceTable'
import { PhotoUpload } from './components/PieceInput/PhotoUpload'
import { SettingsPanel } from './components/Settings/SettingsPanel'
import { ResultsPanel } from './components/Results/ResultsPanel'
import { SawView } from './components/Results/SawView'
import { EmptyState } from './components/EmptyState'
import { useAppStore } from './store/useAppStore'
import { useAutoOptimize } from './hooks/useAutoOptimize'

function App() {
  const pieces = useAppStore((s) => s.pieces)
  const uploadedPhotoUrl = useAppStore((s) => s.uploadedPhotoUrl)
  const addPiece = useAppStore((s) => s.addPiece)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useAutoOptimize()

  const showEmptyState = pieces.length === 0 && !uploadedPhotoUrl

  const handleCameraClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="min-h-screen bg-bg font-sans">
      <Header />

      <main className="max-w-lg mx-auto px-4 py-4 space-y-4 md:max-w-2xl">
        {/* Settings (collapsible) */}
        <SettingsPanel />

        {/* Empty state or input */}
        {showEmptyState ? (
          <EmptyState
            onCamera={handleCameraClick}
            onManual={addPiece}
          />
        ) : (
          <>
            <PhotoUpload />
            <PieceTable />
          </>
        )}

        {/* Results */}
        <ResultsPanel />
      </main>

      {/* Full-screen saw view overlay */}
      <SawView />

      {/* Hidden file input for EmptyState camera button */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) {
            // Trigger the photo upload flow through the store
            const objectUrl = URL.createObjectURL(file)
            useAppStore.getState().setUploadedPhoto(objectUrl)
          }
        }}
        className="hidden"
      />
    </div>
  )
}

export default App
