import { Camera, Plus } from 'lucide-react'

interface EmptyStateProps {
  onCamera: () => void
  onManual: () => void
}

export function EmptyState({ onCamera, onManual }: EmptyStateProps) {
  return (
    <div className="bg-surface rounded-[var(--radius-card)] border border-border p-6 text-center space-y-5">
      {/* Simple plywood illustration */}
      <svg width="80" height="60" viewBox="0 0 80 60" fill="none" className="mx-auto text-border-strong">
        <rect x="4" y="4" width="72" height="52" rx="3" stroke="currentColor" strokeWidth="2" />
        <line x1="28" y1="4" x2="28" y2="56" stroke="currentColor" strokeWidth="1.2" strokeDasharray="4 3" />
        <line x1="52" y1="4" x2="52" y2="56" stroke="currentColor" strokeWidth="1.2" strokeDasharray="4 3" />
        <line x1="4" y1="28" x2="76" y2="28" stroke="currentColor" strokeWidth="1.2" strokeDasharray="4 3" />
      </svg>

      <div>
        <h2 className="text-[18px] font-semibold text-text mb-1">What are you building?</h2>
        <p className="text-[13px] text-text-muted">
          Snap a photo of your sketch or add pieces manually.
        </p>
      </div>

      <div className="space-y-2">
        <button
          onClick={onCamera}
          className="w-full flex items-center justify-center gap-2 bg-primary text-white text-[15px] font-medium rounded-[var(--radius-button)] py-3 px-4 hover:bg-primary-hover transition-colors"
        >
          <Camera size={20} />
          Snap a Photo
        </button>
        <button
          onClick={onManual}
          className="w-full flex items-center justify-center gap-2 bg-transparent text-text-secondary text-[15px] font-medium rounded-[var(--radius-button)] py-3 px-4 border border-border hover:bg-surface-raised transition-colors"
        >
          <Plus size={20} />
          Add Pieces Manually
        </button>
      </div>
    </div>
  )
}
