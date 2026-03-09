import { X } from 'lucide-react'
import { useState } from 'react'
import type { Piece } from '../../types/cutSheet'
import { useAppStore } from '../../store/useAppStore'
import { parseDimension, formatDimension } from '../../utils/units'

interface PieceRowProps {
  piece: Piece
  index: number
  onEnterOnLastRow: () => void
}

export function PieceRow({ piece, index, onEnterOnLastRow }: PieceRowProps) {
  const updatePiece = useAppStore((s) => s.updatePiece)
  const removePiece = useAppStore((s) => s.removePiece)
  const unitSystem = useAppStore((s) => s.unitSystem)
  const pieces = useAppStore((s) => s.pieces)

  const [widthInput, setWidthInput] = useState(
    piece.width > 0 ? formatDimension(piece.width, unitSystem) : ''
  )
  const [heightInput, setHeightInput] = useState(
    piece.height > 0 ? formatDimension(piece.height, unitSystem) : ''
  )

  const commitDimension = (field: 'width' | 'height', value: string) => {
    const parsed = parseDimension(value.replace(/["']/g, ''))
    if (parsed !== null) {
      updatePiece(piece.id, { [field]: parsed })
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const isLast = index === pieces.length - 1
      if (isLast) onEnterOnLastRow()
    }
  }

  return (
    <tr className="group border-b border-gray-100 hover:bg-gray-50/50">
      <td className="py-2 px-3">
        <div
          className="w-5 h-5 rounded"
          style={{ backgroundColor: piece.color }}
        />
      </td>
      <td className="py-2 px-3">
        <input
          type="text"
          value={piece.label}
          onChange={(e) => updatePiece(piece.id, { label: e.target.value })}
          onKeyDown={handleKeyDown}
          placeholder={`Piece ${index + 1}`}
          className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:bg-white focus:ring-1 focus:ring-blue-300 rounded px-1.5 py-0.5 -mx-1.5"
        />
      </td>
      <td className="py-2 px-3">
        <input
          type="text"
          value={widthInput}
          onChange={(e) => setWidthInput(e.target.value)}
          onBlur={() => commitDimension('width', widthInput)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commitDimension('width', widthInput)
            handleKeyDown(e)
          }}
          placeholder="0"
          className="w-20 bg-transparent text-sm text-gray-900 text-right outline-none placeholder:text-gray-400 focus:bg-white focus:ring-1 focus:ring-blue-300 rounded px-1.5 py-0.5"
        />
      </td>
      <td className="py-2 px-3">
        <input
          type="text"
          value={heightInput}
          onChange={(e) => setHeightInput(e.target.value)}
          onBlur={() => commitDimension('height', heightInput)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commitDimension('height', heightInput)
            handleKeyDown(e)
          }}
          placeholder="0"
          className="w-20 bg-transparent text-sm text-gray-900 text-right outline-none placeholder:text-gray-400 focus:bg-white focus:ring-1 focus:ring-blue-300 rounded px-1.5 py-0.5"
        />
      </td>
      <td className="py-2 px-3">
        <input
          type="number"
          min={1}
          value={piece.quantity}
          onChange={(e) =>
            updatePiece(piece.id, { quantity: Math.max(1, parseInt(e.target.value) || 1) })
          }
          onKeyDown={handleKeyDown}
          className="w-14 bg-transparent text-sm text-gray-900 text-center outline-none placeholder:text-gray-400 focus:bg-white focus:ring-1 focus:ring-blue-300 rounded px-1.5 py-0.5"
        />
      </td>
      <td className="py-2 px-3">
        <button
          onClick={() => removePiece(piece.id)}
          className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
          title="Remove piece"
        >
          <X size={14} />
        </button>
      </td>
    </tr>
  )
}
