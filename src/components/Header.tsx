import { Settings } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'

export function Header() {
  const settingsOpen = useAppStore((s) => s.settingsOpen)
  const setSettingsOpen = useAppStore((s) => s.setSettingsOpen)

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="text-blue-600">
          <rect x="2" y="2" width="24" height="24" rx="3" stroke="currentColor" strokeWidth="2" />
          <line x1="10" y1="2" x2="10" y2="26" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" />
          <line x1="2" y1="14" x2="26" y2="14" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" />
        </svg>
        <h1 className="text-xl font-semibold text-gray-900">Cut Sheet</h1>
      </div>
      <button
        onClick={() => setSettingsOpen(!settingsOpen)}
        className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
        title="Settings"
      >
        <Settings size={20} />
      </button>
    </header>
  )
}
