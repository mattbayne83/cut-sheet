# CutSheet

**Know how many sheets to buy before you get in the truck.**

Plywood cut sheet optimizer for woodworkers. Snap a photo of a hand-drawn sketch or manually enter piece dimensions → get an instant sheet count + optimized cut layout on standard plywood sheets.

## Tech Stack
- React 19, TypeScript 5.9, Vite 7
- Tailwind CSS 4 (design tokens via `@theme` in `index.css`)
- Zustand 5 (with persist middleware)
- Lucide React (icons)
- Inter font (Google Fonts)
- `@google/genai` — Gemini Vision API for photo extraction (optional)
- `html-to-image` — PNG export

## Architecture
- Phone-first single-page vertical flow: Settings → Empty State / Photo + Pieces → Results
- No router — stacked sections, conditional rendering
- Auto-optimize: `useAutoOptimize` hook watches pieces + settings, debounces 300ms, re-runs packer when `result` is null. No manual "Optimize" button.
- State-driven: Zustand store with `persist` (pieces, settings, API key, sheet price only)
- Algorithm: Two modes in `packer.ts`, dispatched by `OptimizationMode`:
  - **minimize-waste** — Best-area-fit guillotine (rotates freely, packs tightest)
  - **minimize-saw-changes** — Shelf packing (groups same-height pieces into horizontal strips, avoids rotation, fewer unique fence settings)
- Visualization: SVG with responsive viewBox
- Design tokens: CSS variables in `index.css` `@theme` block + JS mirror in `src/styles/tokens.ts`

## Design System
- **Palette**: Warm workshop aesthetic — cream bg (#FAF8F5), walnut text (#2C1810), burnt orange primary (#C2410C)
- **Typography**: Inter, 15px body (mobile legibility), 48px hero number
- **Touch targets**: Min 44px height on all interactive elements
- **Radii**: Card 16px, button 12px, input 8px
- **Tokens**: CSS vars in `@theme` → Tailwind classes (`bg-surface`, `text-text-muted`, `border-border`)
- **JS tokens**: `src/styles/tokens.ts` mirrors CSS for SVG fills and programmatic use

## Key Files

### Core
- `src/types/cutSheet.ts` — All type definitions (Piece, Placement, SheetResult, etc.)
- `src/store/useAppStore.ts` — Main Zustand store (persisted)
- `src/styles/tokens.ts` — JS-accessible design tokens + `PIECE_COLORS` array
- `src/hooks/useAutoOptimize.ts` — Debounced auto-optimize hook (consumed in App.tsx)

### Algorithm & Utils
- `src/utils/packer.ts` — Bin packing algorithms (guillotine + shelf)
- `src/utils/units.ts` — Fraction parsing ("3-1/2" → 3.5) and display formatting
- `src/utils/validation.ts` — Per-piece validation (zero dims, exceeds sheet, bad qty)
- `src/services/gemini.ts` — Gemini Vision API integration

### Components — Input
- `src/components/EmptyState.tsx` — "What are you building?" with camera + manual CTAs
- `src/components/PieceInput/PieceCard.tsx` — Card-based piece input (mobile-optimized)
- `src/components/PieceInput/PieceTable.tsx` — Piece list container (renders PieceCards)
- `src/components/PieceInput/PhotoUpload.tsx` — Photo upload with `capture="environment"` for mobile camera
- `src/components/PieceInput/PhotoPreview.tsx` — Extracted pieces review with inline dimension editing

### Components — Results
- `src/components/Results/HeroAnswer.tsx` — "2 sheets" hero display (48px bold)
- `src/components/Results/ShoppingSummary.tsx` — Cost summary with editable price
- `src/components/Results/UnplacedPieces.tsx` — Explains unplaced pieces with reasons
- `src/components/Results/ResultsPanel.tsx` — Results container: Hero → Shopping → Unplaced → Sheet tabs → Diagram
- `src/components/Results/SheetView.tsx` — SVG cut sheet visualization
- `src/components/Results/SawView.tsx` — Full-screen overlay with pinch-to-zoom
- `src/components/Results/ExportButton.tsx` — PNG export button

### Layout
- `src/components/Header.tsx` — App header with settings toggle
- `src/components/Settings/SettingsPanel.tsx` — Sheet size, kerf, units, price, optimization mode, API key

## Docs
- `docs/VISION.md` — Product vision, north star, "Two Moments" framework, competitive position
- `tasks/backlog.md` — Prioritized feature backlog (P0–P3 + Icebox + Algorithm)

## Gotchas
- **`@google/genai` not `@google/generative-ai`** — Use the newer SDK for Gemini 2.0+ features
- **Kerf is asymmetric** — Added to right + bottom of placed pieces only, not at sheet edges
- **Packer is pure** — `guillotinePack(pieces, config)` returns data, no store access. `config.mode` selects algorithm
- **Shelf packer normalizes orientation** — pieces are oriented so height <= width, reducing unique shelf heights
- **Fraction parsing handles multiple formats** — "3-1/2", "3 1/2", "3.5", "1/4"
- **Only persist user data** — Never persist results, photo data, or extraction state
- **Object URLs must be revoked** — `URL.revokeObjectURL()` on photo clear to prevent leaks
- **SVG export needs HTML wrapper** — `html-to-image` `toPng` targets the div containing the SVG, not the SVG directly
- **PIECE_COLORS in tokens.ts** — Store imports from `styles/tokens.ts`, not inline. Keep them in sync.
- **Auto-optimize invalidation** — Changing pieces/settings sets `result` to null → hook detects and re-runs. Don't call `runOptimizer` directly from UI.
- **SawView is a full-screen overlay** — z-50, fixed, renders outside main layout. Toggled via `sawViewOpen` store flag.
- **`capture="environment"` is inconsistent** — Gracefully falls back to file picker on unsupported browsers
- **ShoppingSummary inline edit** — Uses local component state for price editing, syncs to store on blur
