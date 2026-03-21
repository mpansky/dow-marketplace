import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface MetricCard {
  label: string
  value: string | number
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  icon?: React.ReactNode
}

export function MetricsStrip({ metrics }: { metrics: MetricCard[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      {metrics.map((metric) => (
        <Card key={metric.label} className="bg-card/50">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">{metric.label}</span>
              {metric.icon && (
                <span className="text-muted-foreground">{metric.icon}</span>
              )}
            </div>
            <div className="text-xl md:text-2xl font-bold font-mono">{metric.value}</div>
            {metric.change && (
              <div
                className={cn(
                  'text-xs mt-1',
                  metric.changeType === 'positive' && 'text-green-400',
                  metric.changeType === 'negative' && 'text-red-400',
                  metric.changeType === 'neutral' && 'text-muted-foreground'
                )}
              >
                {metric.change}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
