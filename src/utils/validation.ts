import type { Piece, PieceId } from '../types/plyplan'

export interface ValidationError {
  pieceId: PieceId
  field: 'width' | 'height' | 'quantity' | 'general'
  message: string
}

export function validatePieces(
  pieces: Piece[],
  sheetWidth: number,
  sheetHeight: number,
): ValidationError[] {
  const errors: ValidationError[] = []

  for (const piece of pieces) {
    if (piece.width < 0) {
      errors.push({ pieceId: piece.id, field: 'width', message: 'Width cannot be negative' })
    }
    if (piece.height < 0) {
      errors.push({ pieceId: piece.id, field: 'height', message: 'Height cannot be negative' })
    }
    if (piece.quantity > 100) {
      errors.push({ pieceId: piece.id, field: 'quantity', message: 'Max quantity is 100' })
    }

    // Check if piece fits the sheet in any orientation
    if (piece.width > 0 && piece.height > 0) {
      const fitsNormal = piece.width <= sheetWidth && piece.height <= sheetHeight
      const fitsRotated = piece.height <= sheetWidth && piece.width <= sheetHeight
      if (!fitsNormal && !fitsRotated) {
        errors.push({
          pieceId: piece.id,
          field: 'general',
          message: `${piece.width}" × ${piece.height}" won't fit on a ${sheetWidth}" × ${sheetHeight}" sheet`,
        })
      }
    }
  }

  return errors
}

export function getErrorsForPiece(errors: ValidationError[], pieceId: PieceId): ValidationError[] {
  return errors.filter((e) => e.pieceId === pieceId)
}
