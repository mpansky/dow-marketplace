import { ArrowLeft, ExternalLink, Building2, Globe } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { Challenge } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  CHALLENGE_STATUS_LABELS,
  CHALLENGE_STATUS_COLORS,
  CLASSIFICATION_LABELS,
  OPPORTUNITY_TYPE_LABELS,
} from '@/types'

interface Props {
  challenge: Challenge
  role: string
}

export function ChallengeDetailHeader({ challenge, role }: Props) {
  const navigate = useNavigate()
  const statusColor = CHALLENGE_STATUS_COLORS[challenge.status]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-1.5">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Badge style={{ backgroundColor: statusColor, color: '#fff' }}>
          {CHALLENGE_STATUS_LABELS[challenge.status]}
        </Badge>
        <Badge variant="outline">{CLASSIFICATION_LABELS[challenge.classification]}</Badge>
        {challenge.opportunityType && (
          <Badge variant="outline" className="border-[color:var(--accent)]/40 text-[color:var(--accent)]">
            {OPPORTUNITY_TYPE_LABELS[challenge.opportunityType]}
          </Badge>
        )}
        {challenge.solicitationNumber && (
          <Badge variant="secondary" className="font-mono text-xs">
            {challenge.solicitationNumber}
          </Badge>
        )}
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{challenge.title}</h1>
        {challenge.subtitle && (
          <p className="mt-1 text-base text-gray-500">{challenge.subtitle}</p>
        )}
      </div>

      {challenge.orgName && (
        <div className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50/70 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[color:var(--accent)]/10">
            <Building2 className="h-5 w-5 text-[color:var(--accent)]" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-gray-900">{challenge.orgName}</p>
            {challenge.orgParentCommand && (
              <p className="text-sm text-gray-500">{challenge.orgParentCommand}</p>
            )}
            {challenge.orgOfficeSymbol && (
              <p className="mt-0.5 text-xs text-gray-400">Office Symbol: {challenge.orgOfficeSymbol}</p>
            )}
          </div>
          {challenge.orgWebsite && (
            <a href={challenge.orgWebsite} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[color:var(--accent)] transition-colors">
              <Globe className="h-4 w-4" />
            </a>
          )}
        </div>
      )}

      {(role === 'pae' || role === 'admin') && (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1.5">
            Edit Challenge
          </Button>
        </div>
      )}
      {role === 'ndc' && (challenge.status === 'submissions_open' || challenge.status === 'published') && (
        <div className="flex gap-2">
          <Button size="sm" className="gap-1.5 bg-[color:var(--accent)] hover:bg-[color:var(--accent)]/90 text-white">
            <ExternalLink className="h-3.5 w-3.5" />
            Submit Proposal
          </Button>
        </div>
      )}
    </div>
  )
}
