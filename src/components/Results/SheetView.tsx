import { useState } from 'react'
import type { SheetResult } from '../../types/cutSheet'
import { useAppStore } from '../../store/useAppStore'
import { formatDimension } from '../../utils/units'

interface SheetViewProps {
  sheet: SheetResult
}

const PADDING = 20 // SVG padding around the sheet
const LABEL_FONT_SIZE = 3
const DIM_FONT_SIZE = 2.5

export function SheetView({ sheet }: SheetViewProps) {
  const sheetWidth = useAppStore((s) => s.sheetWidth)
  const sheetHeight = useAppStore((s) => s.sheetHeight)
  const unitSystem = useAppStore((s) => s.unitSystem)
  const [hoveredPieceIdx, setHoveredPieceIdx] = useState<number | null>(null)

  const viewW = sheetWidth + PADDING * 2
  const viewH = sheetHeight + PADDING * 2

  return (
    <svg
      viewBox={`0 0 ${viewW} ${viewH}`}
      className="w-full border border-gray-200 rounded-lg bg-white"
      style={{ maxHeight: '500px' }}
    >
      <defs>
        {/* Waste hatching pattern */}
        <pattern id={`hatch-${sheet.id}`} patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" stroke="#d1d5db" strokeWidth="0.5" />
        </pattern>
      </defs>

      <g transform={`translate(${PADDING}, ${PADDING})`}>
        {/* Sheet background (waste) */}
        <rect
          x={0}
          y={0}
          width={sheetWidth}
          height={sheetHeight}
          fill={`url(#hatch-${sheet.id})`}
          stroke="#9ca3af"
          strokeWidth="0.5"
        />

        {/* 12" grid lines */}
        {Array.from({ length: Math.floor(sheetWidth / 12) }, (_, i) => (i + 1) * 12).map(
          (x) =>
            x < sheetWidth && (
              <line
                key={`gv-${x}`}
                x1={x}
                y1={0}
                x2={x}
                y2={sheetHeight}
                stroke="#e5e7eb"
                strokeWidth="0.3"
                strokeDasharray="2 2"
              />
            )
        )}
        {Array.from({ length: Math.floor(sheetHeight / 12) }, (_, i) => (i + 1) * 12).map(
          (y) =>
            y < sheetHeight && (
              <line
                key={`gh-${y}`}
                x1={0}
                y1={y}
                x2={sheetWidth}
                y2={y}
                stroke="#e5e7eb"
                strokeWidth="0.3"
                strokeDasharray="2 2"
              />
            )
        )}

        {/* Placed pieces */}
        {sheet.placements.map((p, i) => {
          const isHovered = hoveredPieceIdx === i
          const labelText = p.label || `Piece`
          const dimText = `${formatDimension(p.rotated ? p.height : p.width, unitSystem)} × ${formatDimension(p.rotated ? p.width : p.height, unitSystem)}`
          const centerX = p.x + p.width / 2
          const centerY = p.y + p.height / 2

          // Determine if piece is large enough for text
          const hasRoomForLabel = p.width > 10 && p.height > 8
          const hasRoomForDim = p.width > 10 && p.height > 12

          return (
            <g
              key={`${p.pieceId}-${p.instanceIndex}`}
              onMouseEnter={() => setHoveredPieceIdx(i)}
              onMouseLeave={() => setHoveredPieceIdx(null)}
              className="cursor-pointer"
            >
              <rect
                x={p.x}
                y={p.y}
                width={p.width}
                height={p.height}
                fill={p.color}
                fillOpacity={isHovered ? 0.7 : 0.5}
                stroke={isHovered ? '#1e293b' : p.color}
                strokeWidth={isHovered ? 0.8 : 0.5}
                rx={0.5}
              />
              {hasRoomForLabel && (
                <text
                  x={centerX}
                  y={centerY - (hasRoomForDim ? 1.5 : 0)}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={LABEL_FONT_SIZE}
                  fontWeight={600}
                  fill="#1e293b"
                  className="pointer-events-none select-none"
                >
                  {labelText}
                </text>
              )}
              {hasRoomForDim && (
                <text
                  x={centerX}
                  y={centerY + LABEL_FONT_SIZE}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={DIM_FONT_SIZE}
                  fill="#475569"
                  className="pointer-events-none select-none"
                >
                  {dimText}
                </text>
              )}
            </g>
          )
        })}

        {/* Sheet border (on top) */}
        <rect
          x={0}
          y={0}
          width={sheetWidth}
          height={sheetHeight}
          fill="none"
          stroke="#374151"
          strokeWidth="0.8"
        />

        {/* Sheet dimensions */}
        {/* Width along top */}
        <line x1={0} y1={-5} x2={sheetWidth} y2={-5} stroke="#6b7280" strokeWidth="0.4" />
        <line x1={0} y1={-7} x2={0} y2={-3} stroke="#6b7280" strokeWidth="0.4" />
        <line x1={sheetWidth} y1={-7} x2={sheetWidth} y2={-3} stroke="#6b7280" strokeWidth="0.4" />
        <text
          x={sheetWidth / 2}
          y={-8}
          textAnchor="middle"
          fontSize={DIM_FONT_SIZE}
          fill="#6b7280"
          className="select-none"
        >
          {formatDimension(sheetWidth, unitSystem)}
        </text>

        {/* Height along left */}
        <line x1={-5} y1={0} x2={-5} y2={sheetHeight} stroke="#6b7280" strokeWidth="0.4" />
        <line x1={-7} y1={0} x2={-3} y2={0} stroke="#6b7280" strokeWidth="0.4" />
        <line x1={-7} y1={sheetHeight} x2={-3} y2={sheetHeight} stroke="#6b7280" strokeWidth="0.4" />
        <text
          x={-8}
          y={sheetHeight / 2}
          textAnchor="middle"
          fontSize={DIM_FONT_SIZE}
          fill="#6b7280"
          transform={`rotate(-90, -8, ${sheetHeight / 2})`}
          className="select-none"
        >
          {formatDimension(sheetHeight, unitSystem)}
        </text>


      </g>
    </svg>
  )
}
