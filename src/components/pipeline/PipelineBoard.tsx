import { useState, useMemo } from 'react'
import { useApp } from '@/context/AppContext'
import type { PipelineStage, PipelineEntry, StorefrontId } from '@/types'
import { PIPELINE_STAGE_LABELS } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PipelineCard } from './PipelineCard'
import { PipelineMetrics } from './PipelineMetrics'
import { ChevronRight, Filter, Kanban } from 'lucide-react'

const STAGES: PipelineStage[] = [
  'challenge_published',
  'market_scan',
  'submissions_open',
  'evaluation',
  'shortlist',
  'prototype_demo',
  'ot_award',
  'performance_period',
]

function getNextStage(current: PipelineStage): PipelineStage | null {
  const idx = STAGES.indexOf(current)
  return idx < STAGES.length - 1 ? STAGES[idx + 1] : null
}

export function PipelineBoard() {
  const { state, dispatch } = useApp()
  const [storefrontFilter, setStorefrontFilter] = useState<StorefrontId | 'all'>('all')

  const isAdmin = state.currentRole === 'admin'

  // Build a lookup map for challenges
  const challengeMap = useMemo(
    () => new Map(state.challenges.map((c) => [c.id, c])),
    [state.challenges]
  )

  // Build a lookup map for vendor names
  const vendorMap = useMemo(
    () => new Map(state.vendors.map((v) => [v.id, v.name])),
    [state.vendors]
  )

  // Filter entries by storefront (via their challenge's storefrontId)
  const filteredEntries = useMemo(() => {
    if (storefrontFilter === 'all') return state.pipelineEntries
    return state.pipelineEntries.filter((entry) => {
      const challenge = challengeMap.get(entry.challengeId)
      return challenge?.storefrontId === storefrontFilter
    })
  }, [state.pipelineEntries, storefrontFilter, challengeMap])

  // Group entries by stage
  const entriesByStage = useMemo(() => {
    const grouped: Record<PipelineStage, PipelineEntry[]> = {
      challenge_published: [],
      market_scan: [],
      submissions_open: [],
      evaluation: [],
      shortlist: [],
      prototype_demo: [],
      ot_award: [],
      performance_period: [],
    }
    for (const entry of filteredEntries) {
      grouped[entry.stage].push(entry)
    }
    return grouped
  }, [filteredEntries])

  function handleAdvanceStage(entry: PipelineEntry) {
    const nextStage = getNextStage(entry.stage)
    if (!nextStage) return
    dispatch({
      type: 'UPDATE_PIPELINE_ENTRY',
      payload: {
        ...entry,
        stage: nextStage,
        enteredStageAt: new Date().toISOString(),
        daysInStage: 0,
      },
    })
  }

  const storefrontOptions: { value: StorefrontId | 'all'; label: string }[] = [
    { value: 'all', label: 'All Storefronts' },
    { value: 'indopacom', label: 'INDOPACOM' },
    { value: 'cybercom', label: 'CYBERCOM' },
    { value: 'global', label: 'Global' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <Kanban className="w-6 h-6" style={{ color: 'var(--storefront-accent)' }} />
          <div>
            <h1 className="text-xl font-bold">Acquisition Pipeline</h1>
            <p className="text-sm text-muted-foreground">
              {filteredEntries.length} active entries across {STAGES.length} stages
            </p>
          </div>
        </div>

        {/* Storefront Filter */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <div className="flex gap-1">
            {storefrontOptions.map((opt) => (
              <Button
                key={opt.value}
                variant={storefrontFilter === opt.value ? 'accent' : 'ghost'}
                size="sm"
                onClick={() => setStorefrontFilter(opt.value)}
                className="text-xs whitespace-nowrap"
              >
                {opt.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Metrics */}
      <PipelineMetrics entries={filteredEntries} />

      {/* Kanban Board */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-3 min-w-max">
          {STAGES.map((stage) => {
            const stageEntries = entriesByStage[stage]
            return (
              <div
                key={stage}
                className="w-[180px] sm:w-[220px] flex-shrink-0 rounded-xl border border-border bg-card/30 flex flex-col"
              >
                {/* Column Header */}
                <div className="p-3 border-b border-border">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-xs font-semibold text-foreground truncate pr-2">
                      {PIPELINE_STAGE_LABELS[stage]}
                    </h3>
                    <Badge variant="secondary" className="text-[10px] font-mono flex-shrink-0">
                      {stageEntries.length}
                    </Badge>
                  </div>
                  {/* Stage progress bar */}
                  <div className="h-1 rounded-full bg-border overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${Math.min((stageEntries.length / Math.max(filteredEntries.length, 1)) * 100 * 3, 100)}%`,
                        backgroundColor: 'var(--storefront-accent)',
                        opacity: 0.6,
                      }}
                    />
                  </div>
                </div>

                {/* Column Body */}
                <div className="p-2 space-y-2 flex-1 overflow-y-auto max-h-[calc(100vh-340px)]">
                  {stageEntries.length === 0 && (
                    <p className="text-[10px] text-muted-foreground text-center py-4 italic">
                      No entries
                    </p>
                  )}
                  {stageEntries.map((entry) => {
                    const challenge = challengeMap.get(entry.challengeId)
                    const vendorName = entry.vendorId ? vendorMap.get(entry.vendorId) : undefined
                    const nextStage = getNextStage(entry.stage)

                    return (
                      <div key={entry.id} className="space-y-1">
                        <PipelineCard
                          entry={entry}
                          challenge={challenge}
                          vendorName={vendorName}
                          onClick={isAdmin && nextStage ? () => handleAdvanceStage(entry) : undefined}
                        />
                        {isAdmin && nextStage && (
                          <button
                            onClick={() => handleAdvanceStage(entry)}
                            className="w-full flex items-center justify-center gap-1 text-[10px] text-muted-foreground hover:text-[var(--storefront-accent)] transition-colors py-1 rounded hover:bg-secondary/50"
                            title={`Advance to ${PIPELINE_STAGE_LABELS[nextStage]}`}
                          >
                            <ChevronRight className="w-3 h-3" />
                            Advance
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
