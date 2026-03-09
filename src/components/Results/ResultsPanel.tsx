import { useRef } from 'react'
import { useAppStore } from '../../store/useAppStore'
import { SheetView } from './SheetView'
import { ExportButton } from './ExportButton'

export function ResultsPanel() {
  const result = useAppStore((s) => s.result)
  const activeSheetIndex = useAppStore((s) => s.activeSheetIndex)
  const setActiveSheetIndex = useAppStore((s) => s.setActiveSheetIndex)
  const sheetRef = useRef<HTMLDivElement>(null)

  if (!result) return null

  const activeSheet = result.sheets[activeSheetIndex]

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Summary stats */}
      <div className="px-5 py-4 border-b border-gray-100">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-blue-700">{result.totalSheets}</div>
            <div className="text-blue-600 text-xs">Sheet{result.totalSheets !== 1 ? 's' : ''} needed</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-green-700">
              {(100 - result.totalWastePercent).toFixed(1)}%
            </div>
            <div className="text-green-600 text-xs">Material used</div>
          </div>
          <div className="bg-amber-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-amber-700">
              {result.totalWastePercent.toFixed(1)}%
            </div>
            <div className="text-amber-600 text-xs">Waste</div>
          </div>
        </div>

        {result.unplacedPieces.length > 0 && (
          <div className="mt-3 p-3 bg-red-50 rounded-lg text-sm text-red-700">
            {result.unplacedPieces.length} piece(s) could not fit on any sheet (too large).
          </div>
        )}
      </div>

      {/* Sheet tabs + export */}
      <div className="px-5 pt-3 flex items-end justify-between border-b border-gray-100">
        <div className="flex gap-1">
          {result.sheets.length > 1 &&
            result.sheets.map((sheet, i) => (
              <button
                key={sheet.id}
                onClick={() => setActiveSheetIndex(i)}
                className={`px-4 py-2 text-sm rounded-t-lg font-medium transition-colors ${
                  i === activeSheetIndex
                    ? 'bg-white border border-b-white border-gray-200 text-gray-900 -mb-px'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                Sheet {i + 1}
                <span className="ml-1.5 text-xs text-gray-400">
                  ({sheet.placements.length} pc{sheet.placements.length !== 1 ? 's' : ''})
                </span>
              </button>
            ))}
        </div>
        <div className="pb-2">
          <ExportButton targetRef={sheetRef} sheetIndex={activeSheetIndex} />
        </div>
      </div>

      {/* Sheet view + Cut order */}
      {activeSheet && (
        <div className="p-5">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2" ref={sheetRef}>
              <SheetView sheet={activeSheet} />
            </div>
            <div>
              {/* Piece legend */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                  Pieces on this sheet
                </h3>
                <div className="space-y-1.5">
                  {activeSheet.placements.map((p) => (
                    <div key={`${p.pieceId}-${p.instanceIndex}`} className="flex items-center gap-2 text-sm">
                      <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: p.color }} />
                      <span className="text-gray-700">{p.label || 'Piece'}</span>
                      {p.rotated && (
                        <span className="text-xs text-gray-400 italic">rotated</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
