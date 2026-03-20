import { useState, useMemo } from 'react'
import { useApp } from '@/context/AppContext'
import type { SubmissionStatus } from '@/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SubmissionCard } from './SubmissionCard'
import { FileText, Filter, LayoutGrid, List } from 'lucide-react'

const ALL_STATUSES: SubmissionStatus[] = [
  'submitted',
  'under_review',
  'evaluation',
  'shortlisted',
  'awarded',
  'not_selected',
]

const STATUS_LABELS: Record<SubmissionStatus, string> = {
  submitted: 'Submitted',
  under_review: 'Under Review',
  evaluation: 'Evaluation',
  shortlisted: 'Shortlisted',
  awarded: 'Awarded',
  not_selected: 'Not Selected',
}

const STATUS_COLORS: Record<SubmissionStatus, string> = {
  submitted: '#3b82f6',
  under_review: '#eab308',
  evaluation: '#a855f7',
  shortlisted: '#10b981',
  awarded: '#22c55e',
  not_selected: '#ef4444',
}

export function SubmissionTracker() {
  const { state } = useApp()
  const [statusFilter, setStatusFilter] = useState<SubmissionStatus | 'all'>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Build challenge lookup
  const challengeMap = useMemo(
    () => new Map(state.challenges.map((c) => [c.id, c])),
    [state.challenges]
  )

  // Get submissions (in a real app, filter by current user's vendorId)
  const allSubmissions = state.submissions

  // Count by status for the pipeline visual
  const statusCounts = useMemo(() => {
    const counts: Record<SubmissionStatus, number> = {
      submitted: 0,
      under_review: 0,
      evaluation: 0,
      shortlisted: 0,
      awarded: 0,
      not_selected: 0,
    }
    for (const sub of allSubmissions) {
      counts[sub.status]++
    }
    return counts
  }, [allSubmissions])

  // Filter submissions
  const filteredSubmissions = useMemo(() => {
    if (statusFilter === 'all') return allSubmissions
    return allSubmissions.filter((s) => s.status === statusFilter)
  }, [allSubmissions, statusFilter])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="w-6 h-6" style={{ color: 'var(--storefront-accent)' }} />
          <div>
            <h1 className="text-xl font-bold">My Submissions</h1>
            <p className="text-sm text-muted-foreground">
              {allSubmissions.length} total submissions across {state.challenges.length > 0 ? new Set(allSubmissions.map((s) => s.challengeId)).size : 0} challenges
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <LayoutGrid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Status Pipeline Visual */}
      <div className="rounded-xl border border-border bg-card/50 p-4">
        <div className="flex items-center gap-1">
          {ALL_STATUSES.map((status, idx) => {
            const count = statusCounts[status]
            const isActive = statusFilter === status
            return (
              <button
                key={status}
                onClick={() => setStatusFilter(isActive ? 'all' : status)}
                className={`flex-1 relative group transition-all rounded-lg p-3 border ${
                  isActive
                    ? 'border-[var(--storefront-accent)]/50 bg-[var(--storefront-accent)]/10'
                    : 'border-transparent hover:bg-secondary/50'
                }`}
              >
                {/* Connector line */}
                {idx < ALL_STATUSES.length - 1 && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-px bg-border translate-x-1" />
                )}
                <div
                  className="text-lg font-bold font-mono mb-0.5"
                  style={{ color: STATUS_COLORS[status] }}
                >
                  {count}
                </div>
                <div className="text-[10px] text-muted-foreground leading-tight">
                  {STATUS_LABELS[status]}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Filter indicator */}
      {statusFilter !== 'all' && (
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Filtered by:</span>
          <Badge variant="accent" className="text-xs">
            {STATUS_LABELS[statusFilter]}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs h-6 px-2"
            onClick={() => setStatusFilter('all')}
          >
            Clear
          </Button>
        </div>
      )}

      {/* Submissions Grid / List */}
      {filteredSubmissions.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <FileText className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No submissions found</p>
          {statusFilter !== 'all' && (
            <p className="text-xs mt-1">Try clearing the status filter</p>
          )}
        </div>
      ) : (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
              : 'space-y-3'
          }
        >
          {filteredSubmissions.map((sub) => (
            <SubmissionCard
              key={sub.id}
              submission={sub}
              challenge={challengeMap.get(sub.challengeId)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
