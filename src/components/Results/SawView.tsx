import { X, RotateCcw } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { SheetView } from './SheetView'

export function SawView() {
  const result = useAppStore((s) => s.result)
  const sawViewOpen = useAppStore((s) => s.sawViewOpen)
  const setSawViewOpen = useAppStore((s) => s.setSawViewOpen)
  const activeSheetIndex = useAppStore((s) => s.activeSheetIndex)
  const setActiveSheetIndex = useAppStore((s) => s.setActiveSheetIndex)

  if (!sawViewOpen || !result) return null

  const activeSheet = result.sheets[activeSheetIndex]

  return (
    <div className="fixed inset-0 z-50 bg-text/95 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 flex-shrink-0">
        {/* Sheet tabs */}
        <div className="flex gap-1 overflow-x-auto">
          {result.sheets.map((sheet, i) => (
            <button
              key={sheet.id}
              onClick={() => setActiveSheetIndex(i)}
              className={`px-4 py-2.5 text-[13px] font-medium rounded-[var(--radius-button)] transition-colors flex-shrink-0 ${
                i === activeSheetIndex
                  ? 'bg-white/20 text-white'
                  : 'text-white/50 hover:text-white/80'
              }`}
            >
              Sheet {i + 1}
            </button>
          ))}
        </div>
        <button
          onClick={() => setSawViewOpen(false)}
          className="p-3 text-white/70 hover:text-white transition-colors flex-shrink-0"
        >
          <X size={24} />
        </button>
      </div>

      {/* Diagram */}
      <div className="flex-1 overflow-auto px-4 pb-4 touch-manipulation">
        {activeSheet && (
          <div className="bg-white rounded-[var(--radius-card)] p-4 max-w-4xl mx-auto">
            <SheetView sheet={activeSheet} />
          </div>
        )}
      </div>

      {/* Landscape hint */}
      <div className="text-center pb-4 text-white/40 text-[11px] flex items-center justify-center gap-1.5 md:hidden">
        <RotateCcw size={12} />
        Rotate your phone for a better view
      </div>
    </div>
  )
}
