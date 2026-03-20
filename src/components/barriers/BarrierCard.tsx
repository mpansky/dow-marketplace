import type { Barrier } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn, daysAgo } from '@/lib/utils'
import { Clock, User } from 'lucide-react'

const severityColors: Record<Barrier['severity'], string> = {
  critical: 'bg-red-500/20 text-red-400 border-red-500/30',
  high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  low: 'bg-green-500/20 text-green-400 border-green-500/30',
}

const categoryColors: Record<Barrier['category'], string> = {
  policy: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  process: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  technical: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  cultural: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  financial: 'bg-green-500/20 text-green-400 border-green-500/30',
}

const statusLabels: Record<Barrier['status'], string> = {
  identified: 'Identified',
  assigned: 'Assigned',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  verified: 'Verified',
}

interface BarrierCardProps {
  barrier: Barrier
  onClick?: (barrier: Barrier) => void
  className?: string
}

export function BarrierCard({ barrier, onClick, className }: BarrierCardProps) {
  const openDays = daysAgo(barrier.identifiedAt)

  return (
    <Card
      className={cn(
        'cursor-pointer hover:border-[var(--storefront-accent)]/50 transition-colors group',
        className
      )}
      onClick={() => onClick?.(barrier)}
    >
      <CardContent className="p-3">
        {/* Badges row */}
        <div className="flex items-center gap-1.5 mb-2 flex-wrap">
          <Badge className={`${categoryColors[barrier.category]} text-[10px] border`}>
            {barrier.category}
          </Badge>
          <Badge className={`${severityColors[barrier.severity]} text-[10px] border`}>
            {barrier.severity}
          </Badge>
          <span className="text-[10px] text-muted-foreground ml-auto">
            {statusLabels[barrier.status]}
          </span>
        </div>

        {/* Title */}
        <h4 className="text-xs font-medium mb-2 line-clamp-2 group-hover:text-[var(--storefront-accent)] transition-colors">
          {barrier.title}
        </h4>

        {/* Footer */}
        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
          {barrier.assignedTo ? (
            <span className="flex items-center gap-1">
              <User className="w-3 h-3" />
              {barrier.assignedTo}
            </span>
          ) : (
            <span className="text-yellow-400">Unassigned</span>
          )}
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {openDays}d open
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
