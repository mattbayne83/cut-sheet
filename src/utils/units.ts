import type { UnitSystem } from '../types/plyplan'

const FRACTIONS: Record<number, string> = {
  0.0625: '1/16',
  0.125: '1/8',
  0.1875: '3/16',
  0.25: '1/4',
  0.3125: '5/16',
  0.375: '3/8',
  0.4375: '7/16',
  0.5: '1/2',
  0.5625: '9/16',
  0.625: '5/8',
  0.6875: '11/16',
  0.75: '3/4',
  0.8125: '13/16',
  0.875: '7/8',
  0.9375: '15/16',
}

/** Parse fractional input: "3-1/2" → 3.5, "1/4" → 0.25, "24" → 24 */
export function parseDimension(input: string): number | null {
  const trimmed = input.trim()
  if (!trimmed) return null

  // Try plain number first
  const plain = Number(trimmed)
  if (!isNaN(plain) && plain > 0) return plain

  // Try "whole-num/den" or "whole num/den" format
  const mixed = trimmed.match(/^(\d+)[\s-]+(\d+)\/(\d+)$/)
  if (mixed) {
    const whole = parseInt(mixed[1])
    const num = parseInt(mixed[2])
    const den = parseInt(mixed[3])
    if (den === 0) return null
    return whole + num / den
  }

  // Try bare fraction "num/den"
  const frac = trimmed.match(/^(\d+)\/(\d+)$/)
  if (frac) {
    const num = parseInt(frac[1])
    const den = parseInt(frac[2])
    if (den === 0) return null
    return num / den
  }

  return null
}

/** Format a decimal dimension for display with fractions */
export function formatDimension(value: number, unit: UnitSystem): string {
  if (unit === 'mm') return `${Math.round(value)}mm`

  const whole = Math.floor(value)
  const decimal = Math.round((value - whole) * 10000) / 10000

  if (decimal === 0) return `${whole}"`

  // Find closest fraction (within 1/32 tolerance)
  const closest = Object.entries(FRACTIONS).reduce<{ diff: number; frac: string }>(
    (best, [key, frac]) => {
      const diff = Math.abs(decimal - Number(key))
      return diff < best.diff ? { diff, frac } : best
    },
    { diff: Infinity, frac: '' }
  )

  if (closest.diff < 0.02) {
    return whole > 0 ? `${whole}-${closest.frac}"` : `${closest.frac}"`
  }

  // Fall back to decimal
  return `${value}"`
}

export function inchesToMm(inches: number): number {
  return inches * 25.4
}

export function mmToInches(mm: number): number {
  return mm / 25.4
}
