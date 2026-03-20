import { useState, useMemo } from 'react'
import { useApp } from '@/context/AppContext'
import type { Match, PlatformSource } from '@/types'
import { PLATFORM_LABELS, PLATFORM_COLORS } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  CheckCircle2, XCircle, Flag, Inbox, Filter, ChevronDown, ChevronUp,
} from 'lucide-react'
import { cn, generateId } from '@/lib/utils'

type FilterTab = 'all' | 'pending' | 'approved' | 'rejected'

const statusColors: Record<Match['curatedStatus'], string> = {
  pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  approved: 'bg-green-500/20 text-green-400 border-green-500/30',
  rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
  flagged: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
}

export function CurationQueue() {
  const { state, dispatch } = useApp()
  const [activeTab, setActiveTab] = useState<FilterTab>('all')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [expandedId, setExpandedId] = useState<string | null>(null)

  // Generate mock matches from submissions + challenges data
  const mockMatches: Match[] = useMemo(() => {
    return state.submissions.map((sub) => ({
      id: `match-${sub.id}`,
      challengeId: sub.challengeId,
      vendorId: sub.vendorId,
      score: sub.matchScore,
      explanation:
        sub.aiReview ||
        'AI-generated match based on capability overlap and past performance alignment.',
      platformSource: ['vulcan', 'tradewinds', 'lynx'][
        Math.floor(
          // Deterministic based on id for consistent renders
          parseInt(sub.id.replace(/\D/g, ''), 10) % 3
        )
      ] as PlatformSource,
      curatedStatus: ['pending', 'pending', 'pending', 'approved', 'approved', 'rejected'][
        parseInt(sub.id.replace(/\D/g, ''), 10) % 6
      ] as Match['curatedStatus'],
    }))
  }, [state.submissions])

  // Merge with actual state matches (state matches override mocks with same id)
  const allMatches = useMemo(() => {
    const stateMatchIds = new Set(state.matches.map((m) => m.id))
    const fromMock = mockMatches.filter((m) => !stateMatchIds.has(m.id))
    return [...state.matches, ...fromMock]
  }, [state.matches, mockMatches])

  const filteredMatches = useMemo(() => {
    if (activeTab === 'all') return allMatches
    return allMatches.filter((m) => m.curatedStatus === activeTab)
  }, [allMatches, activeTab])

  const counts = useMemo(() => ({
    all: allMatches.length,
    pending: allMatches.filter((m) => m.curatedStatus === 'pending').length,
    approved: allMatches.filter((m) => m.curatedStatus === 'approved').length,
    rejected: allMatches.filter((m) => m.curatedStatus === 'rejected').length,
  }), [allMatches])

  function getChallengeTitle(challengeId: string): string {
    const ch = state.challenges.find((c) => c.id === challengeId)
    return ch?.title || challengeId
  }

  function getVendorName(vendorId: string): string {
    const vendor = state.vendors.find((v) => v.id === vendorId)
    return vendor?.name || vendorId.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  }

  function handleAction(match: Match, action: 'approved' | 'rejected' | 'flagged') {
    const updated: Match = {
      ...match,
      curatedStatus: action,
      curatedBy: state.currentUser?.id,
      curatedAt: new Date().toISOString(),
    }
    // If already in state, update; otherwise add
    if (state.matches.find((m) => m.id === match.id)) {
      dispatch({ type: 'UPDATE_MATCH', payload: updated })
    } else {
      dispatch({ type: 'ADD_MATCH', payload: updated })
    }
  }

  function handleBulkAction(action: 'approved' | 'rejected' | 'flagged') {
    const targetMatches = filteredMatches.filter((m) => selectedIds.has(m.id))
    targetMatches.forEach((match) => handleAction(match, action))
    setSelectedIds(new Set())
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleSelectAll() {
    if (selectedIds.size === filteredMatches.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredMatches.map((m) => m.id)))
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Inbox className="w-6 h-6" />
          AI Match Curation Queue
        </h1>
        <p className="text-sm text-muted-foreground">
          Review and curate AI-generated vendor-challenge matches
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as FilterTab)}>
          <TabsList>
            <TabsTrigger value="all" className="text-xs">
              All <Badge variant="secondary" className="ml-1.5 text-[10px]">{counts.all}</Badge>
            </TabsTrigger>
            <TabsTrigger value="pending" className="text-xs">
              Pending <Badge variant="secondary" className="ml-1.5 text-[10px]">{counts.pending}</Badge>
            </TabsTrigger>
            <TabsTrigger value="approved" className="text-xs">
              Approved <Badge variant="secondary" className="ml-1.5 text-[10px]">{counts.approved}</Badge>
            </TabsTrigger>
            <TabsTrigger value="rejected" className="text-xs">
              Rejected <Badge variant="secondary" className="ml-1.5 text-[10px]">{counts.rejected}</Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Bulk Actions */}
        {selectedIds.size > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{selectedIds.size} selected</span>
            <Button
              size="sm"
              variant="ghost"
              className="text-xs text-green-400 hover:text-green-300 hover:bg-green-500/10"
              onClick={() => handleBulkAction('approved')}
            >
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
              Approve
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10"
              onClick={() => handleBulkAction('rejected')}
            >
              <XCircle className="w-3.5 h-3.5 mr-1" />
              Reject
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-xs text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10"
              onClick={() => handleBulkAction('flagged')}
            >
              <Flag className="w-3.5 h-3.5 mr-1" />
              Flag
            </Button>
          </div>
        )}
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <ScrollArea className="max-h-[calc(100vh-320px)]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground">
                  <th className="p-3 text-left w-10">
                    <input
                      type="checkbox"
                      checked={selectedIds.size === filteredMatches.length && filteredMatches.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded border-border bg-secondary"
                    />
                  </th>
                  <th className="p-3 text-left">Challenge</th>
                  <th className="p-3 text-left">Vendor</th>
                  <th className="p-3 text-center w-20">Score</th>
                  <th className="p-3 text-left">AI Explanation</th>
                  <th className="p-3 text-center w-28">Platform</th>
                  <th className="p-3 text-center w-24">Status</th>
                  <th className="p-3 text-center w-36">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMatches.map((match) => {
                  const isExpanded = expandedId === match.id
                  return (
                    <tr
                      key={match.id}
                      className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
                    >
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(match.id)}
                          onChange={() => toggleSelect(match.id)}
                          className="rounded border-border bg-secondary"
                        />
                      </td>
                      <td className="p-3">
                        <span className="text-xs font-medium line-clamp-1 max-w-[200px] block">
                          {getChallengeTitle(match.challengeId)}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {match.challengeId}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="text-xs font-medium">
                          {getVendorName(match.vendorId)}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <span
                          className={cn(
                            'font-mono font-bold text-sm',
                            match.score >= 90
                              ? 'text-green-400'
                              : match.score >= 75
                                ? 'text-yellow-400'
                                : 'text-muted-foreground'
                          )}
                        >
                          {match.score}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-start gap-1">
                          <p
                            className={cn(
                              'text-[11px] text-muted-foreground leading-relaxed',
                              !isExpanded && 'line-clamp-2'
                            )}
                          >
                            {match.explanation}
                          </p>
                          {match.explanation.length > 80 && (
                            <button
                              onClick={() => setExpandedId(isExpanded ? null : match.id)}
                              className="flex-shrink-0 text-muted-foreground hover:text-foreground"
                            >
                              {isExpanded ? (
                                <ChevronUp className="w-3.5 h-3.5" />
                              ) : (
                                <ChevronDown className="w-3.5 h-3.5" />
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <Badge
                          className={`${PLATFORM_COLORS[match.platformSource]} text-[10px] border`}
                        >
                          {PLATFORM_LABELS[match.platformSource]}
                        </Badge>
                      </td>
                      <td className="p-3 text-center">
                        <Badge
                          className={`${statusColors[match.curatedStatus]} text-[10px] border`}
                        >
                          {match.curatedStatus}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 text-green-400 hover:text-green-300 hover:bg-green-500/10"
                            onClick={() => handleAction(match, 'approved')}
                            title="Approve"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            onClick={() => handleAction(match, 'rejected')}
                            title="Reject"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10"
                            onClick={() => handleAction(match, 'flagged')}
                            title="Flag for Review"
                          >
                            <Flag className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {filteredMatches.length === 0 && (
              <div className="text-center py-12 text-sm text-muted-foreground">
                No matches found for this filter.
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
