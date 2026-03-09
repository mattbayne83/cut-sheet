import { Plus, Trash2 } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { PieceRow } from './PieceRow'

export function PieceTable() {
  const pieces = useAppStore((s) => s.pieces)
  const addPiece = useAppStore((s) => s.addPiece)
  const clearPieces = useAppStore((s) => s.clearPieces)

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Pieces</h2>
        {pieces.length > 0 && (
          <button
            onClick={clearPieces}
            className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors"
          >
            <Trash2 size={12} />
            Clear all
          </button>
        )}
      </div>

      {pieces.length > 0 ? (
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider">
              <th className="py-2 px-3 w-8"></th>
              <th className="py-2 px-3 text-left font-medium">Label</th>
              <th className="py-2 px-3 text-right font-medium">Width</th>
              <th className="py-2 px-3 text-right font-medium">Height</th>
              <th className="py-2 px-3 text-center font-medium">Qty</th>
              <th className="py-2 px-3 w-8"></th>
            </tr>
          </thead>
          <tbody>
            {pieces.map((piece, i) => (
              <PieceRow
                key={piece.id}
                piece={piece}
                index={i}
                onEnterOnLastRow={addPiece}
              />
            ))}
          </tbody>
        </table>
      ) : (
        <div className="px-4 py-8 text-center text-sm text-gray-400">
          No pieces yet. Add pieces manually or upload a sketch photo.
        </div>
      )}

      <div className="px-4 py-3 border-t border-gray-100">
        <button
          onClick={addPiece}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1.5 transition-colors"
        >
          <Plus size={16} />
          Add piece
        </button>
      </div>
    </div>
  )
}
