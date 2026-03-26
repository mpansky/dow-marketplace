import { Scale } from 'lucide-react'
import type { ChallengeEvaluationCriterion } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Props {
  criteria: ChallengeEvaluationCriterion[]
}

export function ChallengeEvaluationCriteria({ criteria }: Props) {
  if (!criteria || criteria.length === 0) return null

  const sorted = [...criteria].sort((a, b) => a.sortOrder - b.sortOrder)

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Scale className="h-4 w-4 text-[color:var(--accent)]" />
          Evaluation Criteria
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sorted.map((criterion, idx) => (
            <div key={idx} className="rounded-lg border border-gray-100 p-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-gray-900">{criterion.name}</p>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-16 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-[color:var(--accent)]"
                      style={{ width: `${criterion.weight}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold tabular-nums text-[color:var(--accent)]">
                    {criterion.weight}%
                  </span>
                </div>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-gray-500">{criterion.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
