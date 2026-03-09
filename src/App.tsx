import { Header } from './components/Header'
import { PieceTable } from './components/PieceInput/PieceTable'
import { PhotoUpload } from './components/PieceInput/PhotoUpload'
import { SettingsPanel } from './components/Settings/SettingsPanel'
import { ResultsPanel } from './components/Results/ResultsPanel'
import { useAppStore } from './store/useAppStore'
import { Scissors } from 'lucide-react'
import { formatDimension } from './utils/units'
import type { OptimizationMode } from './types/cutSheet'

const MODES: Array<{ value: OptimizationMode; label: string; desc: string }> = [
  { value: 'minimize-waste', label: 'Less waste', desc: 'Best material usage' },
  { value: 'minimize-saw-changes', label: 'Fewer cuts', desc: 'Fewer fence changes' },
]

function App() {
  const pieces = useAppStore((s) => s.pieces)
  const runOptimizer = useAppStore((s) => s.runOptimizer)
  const sheetWidth = useAppStore((s) => s.sheetWidth)
  const sheetHeight = useAppStore((s) => s.sheetHeight)
  const kerfWidth = useAppStore((s) => s.kerfWidth)
  const unitSystem = useAppStore((s) => s.unitSystem)
  const optimizationMode = useAppStore((s) => s.optimizationMode)
  const setOptimizationMode = useAppStore((s) => s.setOptimizationMode)

  const validPieces = pieces.filter((p) => p.width > 0 && p.height > 0 && p.quantity > 0)
  const canOptimize = validPieces.length > 0

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />

      <main className="max-w-5xl mx-auto px-6 py-6 space-y-6">
        {/* Settings */}
        <SettingsPanel />

        {/* Piece Input */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PhotoUpload />
          <PieceTable />
        </div>

        {/* Optimize Bar */}
        <div className="bg-white rounded-xl border border-gray-200 px-5 py-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Sheet: {formatDimension(sheetWidth, unitSystem)} × {formatDimension(sheetHeight, unitSystem)}
              <span className="mx-2 text-gray-300">|</span>
              Kerf: {formatDimension(kerfWidth, unitSystem)}
              <span className="mx-2 text-gray-300">|</span>
              {validPieces.length} piece{validPieces.length !== 1 ? 's' : ''} ({validPieces.reduce((s, p) => s + p.quantity, 0)} total)
            </div>
            <button
              onClick={runOptimizer}
              disabled={!canOptimize}
              className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <Scissors size={16} />
              Optimize
            </button>
          </div>

          {/* Mode toggle */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">Priority:</span>
            {MODES.map((mode) => (
              <button
                key={mode.value}
                onClick={() => setOptimizationMode(mode.value)}
                className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                  optimizationMode === mode.value
                    ? 'bg-blue-50 border-blue-300 text-blue-700'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
                title={mode.desc}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <ResultsPanel />
      </main>
    </div>
  )
}

export default App
