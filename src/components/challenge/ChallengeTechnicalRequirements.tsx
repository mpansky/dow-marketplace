import { Cpu, Layers } from 'lucide-react'
import type { Challenge } from '@/types'
import { DOMAIN_LABELS, DOMAIN_COLORS } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Props {
  challenge: Challenge
}

function Requirement({ label, value }: { label: string; value?: string }) {
  if (!value) return null
  return (
    <div className="py-2.5 border-b border-gray-50 last:border-0">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</p>
      <p className="mt-0.5 text-sm text-gray-700">{value}</p>
    </div>
  )
}

export function ChallengeTechnicalRequirements({ challenge }: Props) {
  const hasAdditional =
    challenge.ddilRequirements ||
    challenge.coalitionRequirements ||
    challenge.swapConstraints ||
    challenge.deploymentEnvironment ||
    challenge.targetEnvironment ||
    challenge.classificationForDev ||
    challenge.integrationRequirements ||
    challenge.deploymentModel

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Cpu className="h-4 w-4 text-[color:var(--accent)]" />
          Technical Requirements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-0">
          <div className="py-2.5 border-b border-gray-50">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Capability Domains</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {challenge.domains.map((d) => (
                <Badge
                  key={d}
                  style={{ backgroundColor: DOMAIN_COLORS[d] + '20', color: DOMAIN_COLORS[d] }}
                  className="border-0"
                >
                  {DOMAIN_LABELS[d]}
                </Badge>
              ))}
            </div>
          </div>

          <div className="py-2.5 border-b border-gray-50">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">TRL Range</p>
            <div className="mt-1.5 flex items-center gap-2">
              <div className="flex items-center gap-1">
                {Array.from({ length: 9 }, (_, i) => i + 1).map((trl) => (
                  <div
                    key={trl}
                    className={`h-5 w-5 rounded text-xs flex items-center justify-center font-medium ${
                      trl >= challenge.trlMin && trl <= challenge.trlMax
                        ? 'bg-[color:var(--accent)]/15 text-[color:var(--accent)] ring-1 ring-[color:var(--accent)]/30'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {trl}
                  </div>
                ))}
              </div>
              <span className="text-xs text-gray-500">
                TRL {challenge.trlMin}-{challenge.trlMax}
              </span>
            </div>
          </div>

          {hasAdditional && (
            <>
              <Requirement label="DDIL Requirements" value={challenge.ddilRequirements} />
              <Requirement label="SWaP Constraints" value={challenge.swapConstraints} />
              <Requirement label="Coalition Requirements" value={challenge.coalitionRequirements} />
              <Requirement label="Deployment Environment" value={challenge.deploymentEnvironment} />
              <Requirement label="Target Environment" value={challenge.targetEnvironment} />
              <Requirement label="Classification for Development" value={challenge.classificationForDev} />
              <Requirement label="Integration Requirements" value={challenge.integrationRequirements} />
              <Requirement label="Deployment Model" value={challenge.deploymentModel} />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
