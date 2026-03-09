import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  Piece,
  PieceId,
  UnitSystem,
  OptimizationMode,
  PackerResult,
  ExtractionResult,
  ExtractedPiece,
} from '../types/cutSheet'
import { generateId } from '../utils/id'
import { guillotinePack } from '../utils/packer'

const PIECE_COLORS = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B',
  '#8B5CF6', '#EC4899', '#06B6D4', '#F97316',
  '#6366F1', '#14B8A6', '#E11D48', '#84CC16',
]

interface AppState {
  // Pieces
  pieces: Piece[]
  colorIndex: number

  // Settings
  sheetWidth: number
  sheetHeight: number
  kerfWidth: number
  unitSystem: UnitSystem
  optimizationMode: OptimizationMode
  geminiApiKey: string

  // Photo extraction (transient)
  uploadedPhotoUrl: string | null
  extractionStatus: 'idle' | 'extracting' | 'done' | 'error'
  extractionResult: ExtractionResult | null
  extractionError: string | null

  // Results (transient)
  result: PackerResult | null

  // UI
  activeSheetIndex: number
  settingsOpen: boolean

  // Piece actions
  addPiece: () => void
  updatePiece: (id: PieceId, updates: Partial<Piece>) => void
  removePiece: (id: PieceId) => void
  clearPieces: () => void
  importExtractedPieces: (pieces: ExtractedPiece[]) => void

  // Photo actions
  setUploadedPhoto: (url: string | null) => void
  setExtractionStatus: (status: AppState['extractionStatus']) => void
  setExtractionResult: (result: ExtractionResult | null) => void
  setExtractionError: (error: string | null) => void

  // Settings actions
  setSheetWidth: (w: number) => void
  setSheetHeight: (h: number) => void
  setKerfWidth: (k: number) => void
  setUnitSystem: (u: UnitSystem) => void
  setOptimizationMode: (m: OptimizationMode) => void
  setGeminiApiKey: (key: string) => void
  setSettingsOpen: (open: boolean) => void

  // Results actions
  runOptimizer: () => void
  setActiveSheetIndex: (i: number) => void
  clearResults: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      pieces: [],
      colorIndex: 0,
      sheetWidth: 96,
      sheetHeight: 48,
      kerfWidth: 0.125,
      unitSystem: 'inches' as UnitSystem,
      optimizationMode: 'minimize-waste' as OptimizationMode,
      geminiApiKey: '',
      uploadedPhotoUrl: null,
      extractionStatus: 'idle' as const,
      extractionResult: null,
      extractionError: null,
      result: null,
      activeSheetIndex: 0,
      settingsOpen: false,

      addPiece: () =>
        set((s) => {
          const color = PIECE_COLORS[s.colorIndex % PIECE_COLORS.length]
          return {
            pieces: [
              ...s.pieces,
              {
                id: generateId(),
                label: '',
                width: 0,
                height: 0,
                quantity: 1,
                color,
              },
            ],
            colorIndex: s.colorIndex + 1,
            result: null,
          }
        }),

      updatePiece: (id, updates) =>
        set((s) => ({
          pieces: s.pieces.map((p) => (p.id === id ? { ...p, ...updates } : p)),
          result: null,
        })),

      removePiece: (id) =>
        set((s) => ({
          pieces: s.pieces.filter((p) => p.id !== id),
          result: null,
        })),

      clearPieces: () => set({ pieces: [], colorIndex: 0, result: null }),

      importExtractedPieces: (extracted) =>
        set((s) => {
          let idx = s.colorIndex
          const newPieces: Piece[] = extracted.map((ep) => {
            const color = PIECE_COLORS[idx % PIECE_COLORS.length]
            idx++
            return {
              id: generateId(),
              label: ep.label,
              width: ep.width,
              height: ep.height,
              quantity: ep.quantity,
              color,
            }
          })
          return {
            pieces: [...s.pieces, ...newPieces],
            colorIndex: idx,
            result: null,
          }
        }),

      setUploadedPhoto: (url) => set({ uploadedPhotoUrl: url }),
      setExtractionStatus: (status) => set({ extractionStatus: status }),
      setExtractionResult: (result) => set({ extractionResult: result }),
      setExtractionError: (error) => set({ extractionError: error }),

      setSheetWidth: (w) => set({ sheetWidth: w, result: null }),
      setSheetHeight: (h) => set({ sheetHeight: h, result: null }),
      setKerfWidth: (k) => set({ kerfWidth: k, result: null }),
      setUnitSystem: (u) => set({ unitSystem: u }),
      setOptimizationMode: (m) => set({ optimizationMode: m, result: null }),
      setGeminiApiKey: (key) => set({ geminiApiKey: key }),
      setSettingsOpen: (open) => set({ settingsOpen: open }),

      runOptimizer: () => {
        const { pieces, sheetWidth, sheetHeight, kerfWidth, optimizationMode } = get()
        const validPieces = pieces.filter((p) => p.width > 0 && p.height > 0 && p.quantity > 0)
        if (validPieces.length === 0) return
        const result = guillotinePack(validPieces, { sheetWidth, sheetHeight, kerfWidth, mode: optimizationMode })
        set({ result, activeSheetIndex: 0 })
      },

      setActiveSheetIndex: (i) => set({ activeSheetIndex: i }),
      clearResults: () => set({ result: null }),
    }),
    {
      name: 'cut-sheet-storage',
      partialize: (state) => ({
        pieces: state.pieces,
        colorIndex: state.colorIndex,
        sheetWidth: state.sheetWidth,
        sheetHeight: state.sheetHeight,
        kerfWidth: state.kerfWidth,
        unitSystem: state.unitSystem,
        optimizationMode: state.optimizationMode,
        geminiApiKey: state.geminiApiKey,
      }),
    }
  )
)
