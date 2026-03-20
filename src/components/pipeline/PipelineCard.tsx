import type { PipelineEntry, Challenge } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import { Clock, DollarSign, Building2 } from 'lucide-react'

const HEALTH_COLORS: Record<PipelineEntry['healthStatus'], string> = {
  green: '#22c55e',
  yellow: '#eab308',
  red: '#ef4444',
}

const HEALTH_LABELS: Record<PipelineEntry['healthStatus'], string> = {
  green: 'On Track',
  yellow: 'At Risk',
  red: 'Blocked',
}

interface PipelineCardProps {
  entry: PipelineEntry
  challenge?: Challenge
  vendorName?: string
  onClick?: () => void
}

export function PipelineCard({ entry, challenge, vendorName, onClick }: PipelineCardProps) {
  const healthColor = HEALTH_COLORS[entry.healthStatus]

  return (
    <Card
      className={`cursor-pointer hover:border-[var(--storefront-accent)]/50 transition-colors group ${onClick ? '' : 'cursor-default'}`}
      onClick={onClick}
    >
      <CardContent className="p-3">
        {/* Health indicator + Title */}
        <div className="flex items-start gap-2 mb-2">
          <span
            className="mt-1.5 flex-shrink-0 h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: healthColor }}
            title={HEALTH_LABELS[entry.healthStatus]}
          />
          <h4 className="text-xs font-medium leading-tight line-clamp-2 group-hover:text-[var(--storefront-accent)] transition-colors">
            {challenge?.title ?? `Challenge ${entry.challengeId}`}
          </h4>
        </div>

        {/* Vendor */}
        {vendorName && (
          <div className="flex items-center gap-1 mb-2 text-[10px] text-muted-foreground">
            <Building2 className="w-3 h-3" />
            <span className="truncate">{vendorName}</span>
          </div>
        )}

        {/* Bottom row: Value + Days in stage */}
        <div className="flex items-center justify-between gap-2">
          {entry.awardValue ? (
            <Badge variant="accent" className="text-[10px] font-mono">
              <DollarSign className="w-3 h-3 mr-0.5" />
              {formatCurrency(entry.awardValue)}
            </Badge>
          ) : (
            <span className="text-[10px] text-muted-foreground italic">No value set</span>
          )}
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground whitespace-nowrap">
            <Clock className="w-3 h-3" />
            {entry.daysInStage}d
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
