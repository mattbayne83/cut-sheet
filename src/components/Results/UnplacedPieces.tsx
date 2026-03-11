import { AlertTriangle } from 'lucide-react'
import type { PackerResult, Piece } from '../../types/cutSheet'
import { useAppStore } from '../../store/useAppStore'

interface UnplacedPiecesProps {
  result: PackerResult
}

export function UnplacedPieces({ result }: UnplacedPiecesProps) {
  const pieces = useAppStore((s) => s.pieces)
  const sheetWidth = useAppStore((s) => s.sheetWidth)
  const sheetHeight = useAppStore((s) => s.sheetHeight)

  if (result.unplacedPieces.length === 0) return null

  // Group unplaced by pieceId to show unique pieces
  const unplacedByPiece = new Map<string, { piece: Piece; count: number }>()
  for (const up of result.unplacedPieces) {
    const existing = unplacedByPiece.get(up.pieceId)
    if (existing) {
      existing.count++
    } else {
      const piece = pieces.find((p) => p.id === up.pieceId)
      if (piece) {
        unplacedByPiece.set(up.pieceId, { piece, count: 1 })
      }
    }
  }

  return (
    <div className="bg-error-light rounded-[var(--radius-input)] border border-error/20 p-3">
      <div className="flex items-start gap-2">
        <AlertTriangle size={16} className="text-error flex-shrink-0 mt-0.5" />
        <div className="text-[13px]">
          <p className="font-medium text-error mb-1">
            {result.unplacedPieces.length} piece{result.unplacedPieces.length !== 1 ? 's' : ''} won't fit
          </p>
          <div className="space-y-0.5 text-error/80">
            {Array.from(unplacedByPiece.values()).map(({ piece, count }) => {
              const tooBig = piece.width > sheetWidth || piece.height > sheetHeight
              return (
                <p key={piece.id}>
                  {piece.label || 'Piece'} ({piece.width}" × {piece.height}")
                  {count > 1 && ` ×${count}`}
                  {tooBig && ' — exceeds sheet size'}
                </p>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
