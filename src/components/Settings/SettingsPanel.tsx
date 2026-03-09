import { useAppStore } from '../../store/useAppStore'
import { parseDimension, formatDimension } from '../../utils/units'
import { useState } from 'react'

const SHEET_PRESETS = [
  { label: '4×8 ft', width: 96, height: 48 },
  { label: '4×4 ft', width: 48, height: 48 },
  { label: '2×4 ft', width: 48, height: 24 },
]

const KERF_PRESETS = [
  { label: '1/8"', value: 0.125 },
  { label: '3/32"', value: 0.09375 },
  { label: '1/16"', value: 0.0625 },
]

export function SettingsPanel() {
  const settingsOpen = useAppStore((s) => s.settingsOpen)
  const sheetWidth = useAppStore((s) => s.sheetWidth)
  const sheetHeight = useAppStore((s) => s.sheetHeight)
  const kerfWidth = useAppStore((s) => s.kerfWidth)
  const unitSystem = useAppStore((s) => s.unitSystem)
  const geminiApiKey = useAppStore((s) => s.geminiApiKey)
  const setSheetWidth = useAppStore((s) => s.setSheetWidth)
  const setSheetHeight = useAppStore((s) => s.setSheetHeight)
  const setKerfWidth = useAppStore((s) => s.setKerfWidth)
  const setUnitSystem = useAppStore((s) => s.setUnitSystem)
  const setGeminiApiKey = useAppStore((s) => s.setGeminiApiKey)

  const [showApiKey, setShowApiKey] = useState(false)

  if (!settingsOpen) return null

  const matchedPreset = SHEET_PRESETS.find(
    (p) => p.width === sheetWidth && p.height === sheetHeight
  )

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-5">
      <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Settings</h2>

      {/* Sheet Size */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">Sheet Size</label>
        <div className="flex gap-2 mb-2">
          {SHEET_PRESETS.map((preset) => (
            <button
              key={preset.label}
              onClick={() => {
                setSheetWidth(preset.width)
                setSheetHeight(preset.height)
              }}
              className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                matchedPreset === preset
                  ? 'bg-blue-50 border-blue-300 text-blue-700'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <input
            type="text"
            value={formatDimension(sheetWidth, unitSystem)}
            onChange={(e) => {
              const v = parseDimension(e.target.value.replace(/["']/g, ''))
              if (v !== null) setSheetWidth(v)
            }}
            className="w-20 border border-gray-200 rounded px-2 py-1 text-center text-gray-900"
          />
          <span>×</span>
          <input
            type="text"
            value={formatDimension(sheetHeight, unitSystem)}
            onChange={(e) => {
              const v = parseDimension(e.target.value.replace(/["']/g, ''))
              if (v !== null) setSheetHeight(v)
            }}
            className="w-20 border border-gray-200 rounded px-2 py-1 text-center text-gray-900"
          />
        </div>
      </div>

      {/* Kerf Width */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">Kerf Width</label>
        <div className="flex gap-2">
          {KERF_PRESETS.map((preset) => (
            <button
              key={preset.label}
              onClick={() => setKerfWidth(preset.value)}
              className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                kerfWidth === preset.value
                  ? 'bg-blue-50 border-blue-300 text-blue-700'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Units */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">Units</label>
        <div className="flex gap-2">
          {(['inches', 'mm'] as const).map((u) => (
            <button
              key={u}
              onClick={() => setUnitSystem(u)}
              className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                unitSystem === u
                  ? 'bg-blue-50 border-blue-300 text-blue-700'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {u === 'inches' ? 'Inches' : 'Millimeters'}
            </button>
          ))}
        </div>
      </div>

      {/* Gemini API Key */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Gemini API Key
          <span className="text-gray-400 font-normal"> (optional, for photo extraction)</span>
        </label>
        <p className="text-xs text-gray-400 mb-2">
          Free at{' '}
          <a
            href="https://aistudio.google.com/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            aistudio.google.com
          </a>
          {' '}— no credit card required.
        </p>
        <div className="flex gap-2">
          <input
            type={showApiKey ? 'text' : 'password'}
            value={geminiApiKey}
            onChange={(e) => setGeminiApiKey(e.target.value)}
            placeholder="AIza..."
            className="flex-1 border border-gray-200 rounded px-2 py-1 text-sm text-gray-900"
          />
          <button
            onClick={() => setShowApiKey(!showApiKey)}
            className="px-3 py-1 text-xs border border-gray-200 rounded hover:bg-gray-50 text-gray-500"
          >
            {showApiKey ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>
    </div>
  )
}
