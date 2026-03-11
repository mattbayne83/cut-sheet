// Design tokens for JS use (SVG fills, programmatic color access)
// Keep in sync with @theme in index.css

export const colors = {
  bg: '#FAF8F5',
  surface: '#FFFFFF',
  surfaceRaised: '#F5F0EB',
  border: '#E8DDD4',
  borderStrong: '#D4C4B5',
  text: '#2C1810',
  textSecondary: '#8B6F5E',
  textMuted: '#A89888',
  primary: '#C2410C',
  primaryHover: '#9A3412',
  primaryLight: '#FFF7ED',
  success: '#15803D',
  successLight: '#F0FDF4',
  warning: '#D97706',
  warningLight: '#FFFBEB',
  error: '#DC2626',
  errorLight: '#FEF2F2',
} as const

// Piece colors for the cut diagram — warm-toned to match the palette
export const PIECE_COLORS = [
  '#3B82F6', // blue
  '#EF4444', // red
  '#10B981', // emerald
  '#F59E0B', // amber
  '#8B5CF6', // violet
  '#EC4899', // pink
  '#06B6D4', // cyan
  '#F97316', // orange
  '#6366F1', // indigo
  '#14B8A6', // teal
  '#E11D48', // rose
  '#84CC16', // lime
] as const
