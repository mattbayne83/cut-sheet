import { useState } from 'react'
import { useAppStore } from '../../store/useAppStore'
import { formatDimension } from '../../utils/units'
import type { PackerResult } from '../../types/plyplan'

interface ShoppingSummaryProps {
  result: PackerResult
}

export function ShoppingSummary({ result }: ShoppingSummaryProps) {
  const sheetWidth = useAppStore((s) => s.sheetWidth)
  const sheetHeight = useAppStore((s) => s.sheetHeight)
  const unitSystem = useAppStore((s) => s.unitSystem)
  const sheetPrice = useAppStore((s) => s.sheetPricePerUnit)
  const setSheetPrice = useAppStore((s) => s.setSheetPrice)

  const [editingPrice, setEditingPrice] = useState(false)
  const [priceInput, setPriceInput] = useState(String(sheetPrice))

  const total = result.totalSheets * sheetPrice

  const commitPrice = () => {
    const val = parseFloat(priceInput)
    if (!isNaN(val) && val >= 0) {
      setSheetPrice(val)
    } else {
      setPriceInput(String(sheetPrice))
    }
    setEditingPrice(false)
  }

  const sheetDim = `${formatDimension(sheetWidth, unitSystem)} × ${formatDimension(sheetHeight, unitSystem)}`

  return (
    <div className="text-center text-[13px] text-text-secondary pb-3">
      <p>
        {result.totalSheets} sheet{result.totalSheets !== 1 ? 's' : ''} of {sheetDim} at{' '}
        {editingPrice ? (
          <span className="inline-flex items-center gap-0.5">
            $
            <input
              type="text"
              value={priceInput}
              onChange={(e) => setPriceInput(e.target.value)}
              onBlur={commitPrice}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commitPrice()
                if (e.key === 'Escape') {
                  setPriceInput(String(sheetPrice))
                  setEditingPrice(false)
                }
              }}
              autoFocus
              className="w-14 text-center bg-surface-raised border border-border rounded px-1 py-0.5 text-[13px] text-text outline-none focus:ring-1 focus:ring-primary/30"
            />
          </span>
        ) : (
          <button
            onClick={() => {
              setPriceInput(String(sheetPrice))
              setEditingPrice(true)
            }}
            className="underline decoration-dotted underline-offset-2 hover:text-text transition-colors"
            title="Tap to change price per sheet"
          >
            ~${sheetPrice}/sheet
          </button>
        )}{' '}
        = <span className="font-semibold text-text">~${total.toFixed(0)}</span>
      </p>
    </div>
  )
}
