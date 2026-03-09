import { Download } from 'lucide-react'
import { toPng } from 'html-to-image'
import { useCallback, useState } from 'react'

interface ExportButtonProps {
  targetRef: React.RefObject<HTMLDivElement | null>
  sheetIndex: number
}

export function ExportButton({ targetRef, sheetIndex }: ExportButtonProps) {
  const [exporting, setExporting] = useState(false)

  const handleExport = useCallback(async () => {
    if (!targetRef.current) return
    setExporting(true)
    try {
      const dataUrl = await toPng(targetRef.current, {
        backgroundColor: '#ffffff',
        pixelRatio: 2,
      })
      const link = document.createElement('a')
      link.download = `cut-sheet-${sheetIndex + 1}.png`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error('Export failed:', err)
    } finally {
      setExporting(false)
    }
  }, [targetRef, sheetIndex])

  return (
    <button
      onClick={handleExport}
      disabled={exporting}
      className="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors flex items-center gap-2 disabled:opacity-50"
    >
      <Download size={16} />
      {exporting ? 'Exporting...' : 'Export PNG'}
    </button>
  )
}
