import { Briefcase, MapPin, Shield, FileText, DollarSign, Users } from 'lucide-react'
import type { Challenge } from '@/types'
import {
  AGREEMENT_TYPE_LABELS,
  FUNDING_TYPE_LABELS,
  SET_ASIDE_LABELS,
  BUDGET_LABELS,
  CLASSIFICATION_LABELS,
  EVALUATION_LABELS,
  COMPETITION_LABELS,
} from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Props {
  challenge: Challenge
}

function DetailRow({ label, value, icon: Icon }: { label: string; value?: string | null; icon?: React.ComponentType<{ className?: string }> }) {
  if (!value) return null
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-gray-50 last:border-0">
      {Icon && <Icon className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />}
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</p>
        <p className="mt-0.5 text-sm text-gray-700">{value}</p>
      </div>
    </div>
  )
}

export function ChallengeOpportunityDetails({ challenge }: Props) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Briefcase className="h-4 w-4 text-[color:var(--accent)]" />
          Opportunity Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-0">
        <DetailRow
          label="Agreement Type"
          value={challenge.agreementType ? AGREEMENT_TYPE_LABELS[challenge.agreementType] : undefined}
          icon={FileText}
        />
        <DetailRow
          label="Funding Type"
          value={challenge.fundingType ? FUNDING_TYPE_LABELS[challenge.fundingType] : undefined}
          icon={DollarSign}
        />
        <DetailRow
          label="Budget Range"
          value={BUDGET_LABELS[challenge.budgetRange]}
          icon={DollarSign}
        />
        <DetailRow
          label="Timeline"
          value={challenge.timeline}
        />
        <DetailRow
          label="Place of Performance"
          value={challenge.placeOfPerformance}
          icon={MapPin}
        />
        <DetailRow
          label="Period of Performance"
          value={challenge.popDuration}
        />
        {challenge.optionPeriods && (
          <DetailRow label="Option Periods" value={challenge.optionPeriods} />
        )}
        <DetailRow
          label="Classification"
          value={CLASSIFICATION_LABELS[challenge.classification]}
          icon={Shield}
        />
        <DetailRow
          label="Evaluation Approach"
          value={EVALUATION_LABELS[challenge.evaluationApproach]}
        />
        <DetailRow
          label="Competition Type"
          value={COMPETITION_LABELS[challenge.competitionType]}
        />
        <DetailRow
          label="Set-Aside"
          value={challenge.setAsideType ? SET_ASIDE_LABELS[challenge.setAsideType] : undefined}
          icon={Users}
        />
        <DetailRow
          label="Data Rights"
          value={challenge.dataRights}
        />
        <DetailRow
          label="Citizenship Requirements"
          value={challenge.citizenshipRequirements}
        />

        {challenge.naicsCodes && challenge.naicsCodes.length > 0 && (
          <div className="flex items-start gap-3 py-2.5">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">NAICS Codes</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {challenge.naicsCodes.map((code) => (
                  <Badge key={code} variant="secondary" className="font-mono text-xs">
                    {code}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
