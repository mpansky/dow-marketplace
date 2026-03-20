import { useNavigate } from 'react-router-dom'
import type { Challenge } from '@/types'
import { DOMAIN_LABELS, BUDGET_LABELS } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, FileText, Users } from 'lucide-react'
import { formatDate, daysFromNow } from '@/lib/utils'

const statusColors: Record<string, string> = {
  draft: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  published: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  submissions_open: 'bg-green-500/20 text-green-400 border-green-500/30',
  evaluation: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  shortlisted: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  awarded: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  closed: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
}

const statusLabels: Record<string, string> = {
  draft: 'DRAFT',
  published: 'PUBLISHED',
  submissions_open: 'SUBMISSIONS OPEN',
  evaluation: 'EVALUATION',
  shortlisted: 'SHORTLISTED',
  awarded: 'AWARDED',
  closed: 'CLOSED',
}

interface ChallengeCardProps {
  challenge: Challenge
  showStorefront?: boolean
  matchScore?: number
  matchExplanation?: string
  showMatchScore?: boolean
}

export function ChallengeCard({
  challenge,
  showStorefront = false,
  matchScore,
  matchExplanation,
  showMatchScore = false,
}: ChallengeCardProps) {
  const navigate = useNavigate()
  const closingDays = daysFromNow(challenge.closesAt)

  return (
    <Card
      className="cursor-pointer hover:border-[var(--storefront-accent)]/50 transition-colors group"
      onClick={() => navigate(`/challenges/${challenge.id}`)}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Match Score (optional) */}
          {showMatchScore && matchScore !== undefined && (
            <div
              className="flex-shrink-0 w-14 h-14 rounded-lg flex flex-col items-center justify-center"
              style={{ background: 'var(--storefront-accent-dim, rgba(59,130,246,0.1))' }}
            >
              <span
                className="text-lg font-bold font-mono"
                style={{ color: 'var(--storefront-accent)' }}
              >
                {matchScore}
              </span>
              <span className="text-[9px] text-muted-foreground">match</span>
            </div>
          )}

          <div className="flex-1 min-w-0">
            {/* Status + Storefront + Submissions */}
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Badge className={`${statusColors[challenge.status]} text-[10px] border`}>
                {statusLabels[challenge.status]}
              </Badge>
              {showStorefront && (
                <Badge variant="accent" className="text-[10px]">
                  {challenge.storefrontId.toUpperCase()}
                </Badge>
              )}
              <span className="text-[10px] text-muted-foreground ml-auto flex items-center gap-1">
                <FileText className="w-3 h-3" />
                {challenge.submissionCount} submissions
              </span>
            </div>

            {/* Title */}
            <h3 className="text-sm font-medium mb-2 line-clamp-2 group-hover:text-[var(--storefront-accent)] transition-colors">
              {challenge.title}
            </h3>

            {/* Domains */}
            <div className="flex flex-wrap gap-1 mb-2">
              {challenge.domains.map((d) => (
                <Badge key={d} variant="secondary" className="text-[10px]">
                  {DOMAIN_LABELS[d]}
                </Badge>
              ))}
            </div>

            {/* Bottom row: Budget, Timeline, Closing */}
            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
              <span className="font-medium">{BUDGET_LABELS[challenge.budgetRange]}</span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {challenge.timeline}
                </span>
                {closingDays > 0 && (
                  <span className={closingDays <= 14 ? 'text-yellow-400' : ''}>
                    {closingDays}d left
                  </span>
                )}
              </div>
            </div>

            {/* Match explanation (optional) */}
            {showMatchScore && matchExplanation && (
              <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed">
                {matchExplanation}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
