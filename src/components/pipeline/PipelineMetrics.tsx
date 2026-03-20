import type { PipelineEntry } from '@/types'
import { MetricsStrip } from '@/components/dashboard/MetricsStrip'
import { formatCurrency } from '@/lib/utils'
import { DollarSign, Clock, Trophy, Activity } from 'lucide-react'

interface PipelineMetricsProps {
  entries: PipelineEntry[]
}

export function PipelineMetrics({ entries }: PipelineMetricsProps) {
  const totalValue = entries.reduce((sum, e) => sum + (e.awardValue ?? 0), 0)

  const avgDaysInStage =
    entries.length > 0
      ? Math.round(entries.reduce((sum, e) => sum + e.daysInStage, 0) / entries.length)
      : 0

  const awardsThisQuarter = entries.filter(
    (e) => e.stage === 'ot_award' || e.stage === 'performance_period'
  ).length

  const greenCount = entries.filter((e) => e.healthStatus === 'green').length
  const yellowCount = entries.filter((e) => e.healthStatus === 'yellow').length
  const redCount = entries.filter((e) => e.healthStatus === 'red').length

  const metrics = [
    {
      label: 'Total Pipeline Value',
      value: formatCurrency(totalValue),
      icon: <DollarSign className="w-4 h-4" />,
    },
    {
      label: 'Avg Days / Stage',
      value: avgDaysInStage,
      icon: <Clock className="w-4 h-4" />,
    },
    {
      label: 'Awards This Quarter',
      value: awardsThisQuarter,
      icon: <Trophy className="w-4 h-4" />,
    },
    {
      label: 'Health Status',
      value: `${greenCount} / ${yellowCount} / ${redCount}`,
      icon: <Activity className="w-4 h-4" />,
      change: `${greenCount} on track · ${yellowCount} at risk · ${redCount} blocked`,
      changeType: redCount > 0 ? 'negative' as const : yellowCount > 0 ? 'neutral' as const : 'positive' as const,
    },
  ]

  return <MetricsStrip metrics={metrics} />
}
