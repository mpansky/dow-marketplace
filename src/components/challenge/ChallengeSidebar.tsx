import { Users, GitBranch, FileText, Hash, Clock } from 'lucide-react'
import type { Challenge, Submission, PipelineEntry, Vendor } from '@/types'
import { SUBMISSION_STATUS_LABELS, PIPELINE_STAGE_LABELS } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { getInitials } from '@/lib/utils'

interface Props {
  challenge: Challenge
  submissions: Submission[]
  pipelineEntries: PipelineEntry[]
  vendors: Vendor[]
}

function formatDate(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const PIPELINE_ORDER = [
  'challenge_published',
  'market_scan',
  'submissions_open',
  'evaluation',
  'shortlist',
  'prototype_demo',
  'ot_award',
  'performance_period',
] as const

export function ChallengeSidebar({ challenge, submissions, pipelineEntries, vendors }: Props) {
  const challengeSubs = submissions.filter((s) => s.challengeId === challenge.id)
  const challengePipeline = pipelineEntries.filter((p) => p.challengeId === challenge.id)
  const matchedVendors = vendors.filter((v) => challenge.matchedVendorIds.includes(v.id))

  const furthestStage = challengePipeline.reduce((max, entry) => {
    const idx = PIPELINE_ORDER.indexOf(entry.stage as (typeof PIPELINE_ORDER)[number])
    return idx > max ? idx : max
  }, 0)

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="h-4 w-4 text-[color:var(--accent)]" />
            Submissions ({challenge.submissionCount})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {challengeSubs.length === 0 ? (
            <p className="text-sm text-gray-500">No submissions yet.</p>
          ) : (
            <div className="space-y-2">
              {challengeSubs.slice(0, 5).map((sub) => {
                const vendor = vendors.find((v) => v.id === sub.vendorId)
                return (
                  <div key={sub.id} className="flex items-center justify-between rounded-lg border border-gray-100 p-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <Avatar className="h-6 w-6 text-[10px]">
                        <AvatarFallback className="bg-gray-100 text-gray-600">
                          {vendor ? getInitials(vendor.name) : '?'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-medium text-gray-700 truncate">
                        {vendor?.name || sub.vendorId}
                      </span>
                    </div>
                    <Badge variant="secondary" className="text-[10px] shrink-0">
                      {SUBMISSION_STATUS_LABELS[sub.status]}
                    </Badge>
                  </div>
                )
              })}
              {challengeSubs.length > 5 && (
                <p className="text-xs text-gray-400 text-center pt-1">
                  + {challengeSubs.length - 5} more
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="h-4 w-4 text-[color:var(--accent)]" />
            Matched Vendors ({matchedVendors.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {matchedVendors.length === 0 ? (
            <p className="text-sm text-gray-500">No matched vendors.</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {matchedVendors.map((v) => (
                <div
                  key={v.id}
                  className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5"
                >
                  <Avatar className="h-4 w-4 text-[8px]">
                    <AvatarFallback className="bg-[color:var(--accent)]/10 text-[color:var(--accent)]">
                      {getInitials(v.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-gray-700">{v.name}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {challengePipeline.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <GitBranch className="h-4 w-4 text-[color:var(--accent)]" />
              Pipeline Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {PIPELINE_ORDER.map((stage, idx) => {
                const isReached = idx <= furthestStage
                const isCurrent = idx === furthestStage
                return (
                  <div
                    key={stage}
                    className={`flex items-center gap-2 rounded px-2 py-1 text-xs ${
                      isCurrent
                        ? 'bg-[color:var(--accent)]/10 font-medium text-[color:var(--accent)]'
                        : isReached
                          ? 'text-gray-500'
                          : 'text-gray-300'
                    }`}
                  >
                    <div
                      className={`h-1.5 w-1.5 rounded-full ${
                        isCurrent
                          ? 'bg-[color:var(--accent)]'
                          : isReached
                            ? 'bg-gray-400'
                            : 'bg-gray-200'
                      }`}
                    />
                    {PIPELINE_STAGE_LABELS[stage]}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Hash className="h-4 w-4 text-[color:var(--accent)]" />
            Metadata
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">Challenge ID</span>
            <span className="font-mono text-gray-600">{challenge.id}</span>
          </div>
          {challenge.solicitationNumber && (
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Solicitation #</span>
              <span className="font-mono text-gray-600">{challenge.solicitationNumber}</span>
            </div>
          )}
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">Created</span>
            <span className="text-gray-600">{formatDate(challenge.createdAt)}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">Closes</span>
            <span className="text-gray-600">{formatDate(challenge.closesAt)}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">PAE ID</span>
            <span className="font-mono text-gray-600">{challenge.paeId}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
