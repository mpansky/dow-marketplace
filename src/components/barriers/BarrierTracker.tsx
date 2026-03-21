import { useState, useMemo } from 'react'
import { useApp } from '@/context/AppContext'
import type { Barrier, BarrierStatus } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { BarrierCard } from './BarrierCard'
import { daysAgo, formatDate } from '@/lib/utils'
import {
  CheckCircle2, Clock, Eye, Flag, ShieldAlert, Users,
} from 'lucide-react'

const COLUMNS: { id: BarrierStatus; label: string; icon: React.ReactNode }[] = [
  { id: 'identified', label: 'Identified', icon: <Flag className="w-3.5 h-3.5" /> },
  { id: 'assigned', label: 'Assigned', icon: <Users className="w-3.5 h-3.5" /> },
  { id: 'in_progress', label: 'In Progress', icon: <Clock className="w-3.5 h-3.5" /> },
  { id: 'resolved', label: 'Resolved', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  { id: 'verified', label: 'Verified', icon: <Eye className="w-3.5 h-3.5" /> },
]

const severityColors: Record<Barrier['severity'], string> = {
  critical: 'bg-red-500/20 text-red-400 border-red-500/30',
  high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  low: 'bg-green-500/20 text-green-400 border-green-500/30',
}

const categoryColors: Record<Barrier['category'], string> = {
  policy: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  process: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  technical: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  cultural: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  financial: 'bg-green-500/20 text-green-400 border-green-500/30',
}

export function BarrierTracker() {
  const { state, dispatch } = useApp()
  const [selectedBarrier, setSelectedBarrier] = useState<Barrier | null>(null)
  const [activeColumn, setActiveColumn] = useState<BarrierStatus>('identified')

  const barriersByStatus = useMemo(() => {
    const map: Record<BarrierStatus, Barrier[]> = {
      identified: [],
      assigned: [],
      in_progress: [],
      resolved: [],
      verified: [],
    }
    state.barriers.forEach((b) => {
      map[b.status].push(b)
    })
    return map
  }, [state.barriers])

  const totalBarriers = state.barriers.length
  const resolvedCount = state.barriers.filter(
    (b) => b.status === 'resolved' || b.status === 'verified'
  ).length
  const resolutionRate = totalBarriers > 0 ? Math.round((resolvedCount / totalBarriers) * 100) : 0

  const categoryMetrics = useMemo(() => {
    const counts: Record<string, number> = {}
    state.barriers.forEach((b) => {
      counts[b.category] = (counts[b.category] || 0) + 1
    })
    return counts
  }, [state.barriers])

  function handleStatusChange(barrier: Barrier, newStatus: BarrierStatus) {
    const updated: Barrier = {
      ...barrier,
      status: newStatus,
      resolvedAt:
        newStatus === 'resolved' || newStatus === 'verified'
          ? new Date().toISOString()
          : barrier.resolvedAt,
    }
    dispatch({ type: 'UPDATE_BARRIER', payload: updated })
    setSelectedBarrier(updated)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ShieldAlert className="w-6 h-6" />
          Barrier-to-Entry Tracker
        </h1>
        <p className="text-sm text-muted-foreground">
          Track and resolve systemic barriers across the acquisition pipeline
        </p>
      </div>

      {/* Metrics Panel */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <Card>
          <CardContent className="p-3 text-center">
            <div className="text-lg font-bold font-mono">{totalBarriers}</div>
            <div className="text-[10px] text-muted-foreground">Total Barriers</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <div className="text-lg font-bold font-mono text-green-400">{resolutionRate}%</div>
            <div className="text-[10px] text-muted-foreground">Resolution Rate</div>
          </CardContent>
        </Card>
        {Object.entries(categoryMetrics).map(([cat, count]) => (
          <Card key={cat}>
            <CardContent className="p-3 text-center">
              <div className="text-lg font-bold font-mono">{count}</div>
              <div className="text-[10px] text-muted-foreground capitalize">{cat}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Desktop Kanban Board */}
      <div className="hidden md:grid grid-cols-5 gap-3 min-h-[600px]">
        {COLUMNS.map((col) => (
          <div key={col.id} className="flex flex-col">
            <div className="flex items-center gap-2 mb-3 px-1">
              {col.icon}
              <span className="text-xs font-medium">{col.label}</span>
              <Badge variant="secondary" className="text-[10px] ml-auto">
                {barriersByStatus[col.id].length}
              </Badge>
            </div>
            <ScrollArea className="flex-1 bg-secondary/30 rounded-lg p-2">
              <div className="space-y-2">
                {barriersByStatus[col.id].map((barrier) => (
                  <BarrierCard
                    key={barrier.id}
                    barrier={barrier}
                    onClick={setSelectedBarrier}
                  />
                ))}
                {barriersByStatus[col.id].length === 0 && (
                  <div className="text-center text-[11px] text-muted-foreground py-8">
                    No barriers
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        ))}
      </div>

      {/* Mobile Tabbed View */}
      <div className="md:hidden space-y-3">
        {/* Tab pills */}
        <div className="overflow-x-auto no-scrollbar flex gap-2">
          {COLUMNS.map((col) => (
            <button
              key={col.id}
              onClick={() => setActiveColumn(col.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                activeColumn === col.id
                  ? 'bg-[var(--storefront-accent-dim)] text-[var(--storefront-accent)]'
                  : 'bg-secondary text-muted-foreground'
              }`}
            >
              {col.icon}
              {col.label}
              <Badge variant="secondary" className="text-[10px] ml-1">
                {barriersByStatus[col.id].length}
              </Badge>
            </button>
          ))}
        </div>

        {/* Active column cards */}
        <div className="space-y-2">
          {barriersByStatus[activeColumn].map((barrier) => (
            <BarrierCard
              key={barrier.id}
              barrier={barrier}
              onClick={setSelectedBarrier}
            />
          ))}
          {barriersByStatus[activeColumn].length === 0 && (
            <div className="text-center text-[11px] text-muted-foreground py-8 bg-secondary/30 rounded-lg">
              No barriers
            </div>
          )}
        </div>
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selectedBarrier} onOpenChange={() => setSelectedBarrier(null)}>
        <DialogContent className="max-w-[calc(100vw-1.5rem)] sm:max-w-xl">
          {selectedBarrier && (
            <>
              <DialogHeader>
                <DialogTitle className="text-base pr-6">{selectedBarrier.title}</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                {/* Badges */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className={`${categoryColors[selectedBarrier.category]} text-[10px] border`}>
                    {selectedBarrier.category}
                  </Badge>
                  <Badge className={`${severityColors[selectedBarrier.severity]} text-[10px] border`}>
                    {selectedBarrier.severity}
                  </Badge>
                  <span className="text-xs text-muted-foreground ml-auto flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {daysAgo(selectedBarrier.identifiedAt)} days open
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {selectedBarrier.description}
                </p>

                {/* Details grid */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-[10px] text-muted-foreground block mb-1">Reported By</span>
                    <span>{selectedBarrier.reportedBy}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block mb-1">Assigned To</span>
                    <span>{selectedBarrier.assignedTo || 'Unassigned'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block mb-1">Identified</span>
                    <span>{formatDate(selectedBarrier.identifiedAt)}</span>
                  </div>
                  {selectedBarrier.resolvedAt && (
                    <div>
                      <span className="text-[10px] text-muted-foreground block mb-1">Resolved</span>
                      <span>{formatDate(selectedBarrier.resolvedAt)}</span>
                    </div>
                  )}
                  {selectedBarrier.sprintId && (
                    <div>
                      <span className="text-[10px] text-muted-foreground block mb-1">Sprint</span>
                      <span className="font-mono text-xs">{selectedBarrier.sprintId}</span>
                    </div>
                  )}
                </div>

                {/* Affected Stakeholders */}
                <div>
                  <span className="text-[10px] text-muted-foreground block mb-1.5">
                    Affected Stakeholders
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {selectedBarrier.affectedStakeholders.map((s) => (
                      <Badge key={s} variant="secondary" className="text-[10px]">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Status Change */}
                <div className="flex items-center gap-3 pt-2 border-t border-border">
                  <span className="text-xs text-muted-foreground">Change Status:</span>
                  <Select
                    value={selectedBarrier.status}
                    onValueChange={(val) =>
                      handleStatusChange(selectedBarrier, val as BarrierStatus)
                    }
                  >
                    <SelectTrigger className="w-48 h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {COLUMNS.map((col) => (
                        <SelectItem key={col.id} value={col.id} className="text-xs">
                          {col.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
