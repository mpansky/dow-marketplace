import type { Submission, SubmissionStatus, Challenge } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import { Calendar, DollarSign, BarChart3 } from 'lucide-react'

const STATUS_STYLES: Record<SubmissionStatus, string> = {
  submitted: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  under_review: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  evaluation: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  shortlisted: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  awarded: 'bg-green-500/20 text-green-400 border-green-500/30',
  not_selected: 'bg-red-500/20 text-red-400 border-red-500/30',
}

const STATUS_LABELS: Record<SubmissionStatus, string> = {
  submitted: 'SUBMITTED',
  under_review: 'UNDER REVIEW',
  evaluation: 'EVALUATION',
  shortlisted: 'SHORTLISTED',
  awarded: 'AWARDED',
  not_selected: 'NOT SELECTED',
}

interface SubmissionCardProps {
  submission: Submission
  challenge?: Challenge
  onClick?: () => void
}

export function SubmissionCard({ submission, challenge, onClick }: SubmissionCardProps) {
  return (
    <Card
      className={`transition-colors group ${onClick ? 'cursor-pointer hover:border-[var(--storefront-accent)]/50' : ''}`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        {/* Status badge row */}
        <div className="flex items-center justify-between mb-2">
          <Badge className={`${STATUS_STYLES[submission.status]} text-[10px] border`}>
            {STATUS_LABELS[submission.status]}
          </Badge>
          <div className="flex items-center gap-1 text-xs font-mono" style={{ color: 'var(--storefront-accent)' }}>
            <BarChart3 className="w-3.5 h-3.5" />
            {submission.matchScore}% match
          </div>
        </div>

        {/* Challenge title */}
        <h3 className="text-sm font-medium mb-2 line-clamp-2 group-hover:text-[var(--storefront-accent)] transition-colors">
          {challenge?.title ?? `Challenge ${submission.challengeId}`}
        </h3>

        {/* Solution overview excerpt */}
        <p className="text-[11px] text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
          {submission.solutionOverview}
        </p>

        {/* Bottom row: Submitted date + Pricing ROM */}
        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(submission.submittedAt)}
          </span>
          <span className="flex items-center gap-1 font-medium font-mono">
            <DollarSign className="w-3 h-3" />
            {submission.pricingRom}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
