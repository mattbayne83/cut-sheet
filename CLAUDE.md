# Cut Sheet

Plywood cut sheet optimizer for woodworkers. Upload a photo of a hand-sketched drawing or manually enter piece dimensions, then generate an optimized cut layout on standard plywood sheets.

## Tech Stack
- React 19, TypeScript 5.9, Vite 7
- Tailwind CSS 4
- Zustand 5 (with persist middleware)
- Lucide React (icons)
- Inter font (Google Fonts)
- `@google/genai` — Gemini Vision API for photo extraction (optional)
- `html-to-image` — PNG export

## Architecture
- Single-page vertical flow: Piece Input → Settings → Optimize → Results
- No router — all sections visible on one page
- State-driven: Zustand store with `persist` (pieces, settings, API key only)
- Algorithm: Two modes in `packer.ts`, dispatched by `OptimizationMode`:
  - **minimize-waste** — Best-area-fit guillotine (rotates freely, packs tightest)
  - **minimize-saw-changes** — Shelf packing (groups same-height pieces into horizontal strips, avoids rotation, fewer unique fence settings)
- Visualization: SVG with responsive viewBox

## Key Files
- `src/types/cutSheet.ts` — All type definitions (Piece, Placement, SheetResult, etc.)
- `src/store/useAppStore.ts` — Main Zustand store (persisted)
- `src/utils/packer.ts` — Bin packing algorithms (guillotine + shelf)
- `src/utils/units.ts` — Fraction parsing ("3-1/2" → 3.5) and display formatting
- `src/services/gemini.ts` — Gemini Vision API integration
- `src/components/Results/SheetView.tsx` — SVG cut sheet visualization
- `src/components/Results/ResultsPanel.tsx` — Results container with stats, tabs, export
- `src/components/PieceInput/PieceTable.tsx` — Editable piece list
- `src/components/PieceInput/PhotoUpload.tsx` — Photo upload + extraction trigger
- `src/components/Settings/SettingsPanel.tsx` — Sheet size, kerf, units, API key

## Gotchas
- **`@google/genai` not `@google/generative-ai`** — Use the newer SDK for Gemini 2.0+ features
- **Kerf is asymmetric** — Added to right + bottom of placed pieces only, not at sheet edges
- **Packer is pure** — `guillotinePack(pieces, config)` returns data, no store access. `config.mode` selects algorithm
- **Shelf packer normalizes orientation** — pieces are oriented so height <= width, reducing unique shelf heights
- **Fraction parsing handles multiple formats** — "3-1/2", "3 1/2", "3.5", "1/4"
- **Only persist user data** — Never persist results, photo data, or extraction state
- **Object URLs must be revoked** — `URL.revokeObjectURL()` on photo clear to prevent leaks
- **SVG export needs HTML wrapper** — `html-to-image` `toPng` targets the div containing the SVG, not the SVG directly
