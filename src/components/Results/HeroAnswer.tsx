import type { PackerResult } from '../../types/plyplan'

interface HeroAnswerProps {
  result: PackerResult
}

export function HeroAnswer({ result }: HeroAnswerProps) {
  const utilization = (100 - result.totalWastePercent).toFixed(0)

  return (
    <div className="text-center py-5">
      <div className="flex items-baseline justify-center gap-2">
        <span className="text-[48px] font-bold text-text leading-none">
          {result.totalSheets}
        </span>
        <span className="text-[18px] font-semibold text-text-secondary">
          sheet{result.totalSheets !== 1 ? 's' : ''}
        </span>
      </div>
      <p className="text-[13px] text-text-muted mt-1">
        {utilization}% material used · {result.totalWastePercent.toFixed(1)}% waste
      </p>
    </div>
  )
}
