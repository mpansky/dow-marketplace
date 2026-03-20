import { useNavigate } from 'react-router-dom'
import { useApp } from '@/context/AppContext'
import { MetricsStrip } from './MetricsStrip'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DOMAIN_LABELS, BUDGET_LABELS, PIPELINE_STAGE_LABELS } from '@/types'
import { Target, Users, TrendingUp, DollarSign, Clock, Plus, ArrowRight, Sparkles } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

const statusColors: Record<string, string> = {
  draft: 'bg-gray-500/20 text-gray-400',
  published: 'bg-blue-500/20 text-blue-400',
  submissions_open: 'bg-green-500/20 text-green-400',
  evaluation: 'bg-yellow-500/20 text-yellow-400',
  shortlisted: 'bg-purple-500/20 text-purple-400',
  awarded: 'bg-emerald-500/20 text-emerald-400',
}

export function PAEDashboard() {
  const { state } = useApp()
  const navigate = useNavigate()

  const myChallenges = state.challenges.filter(
    (c) => c.storefrontId === state.currentStorefront
  )
  const activeChallenges = myChallenges.filter((c) => c.status !== 'draft' && c.status !== 'closed')
  const totalSubmissions = myChallenges.reduce((sum, c) => sum + c.submissionCount, 0)
  const pipelineValue = state.pipelineEntries
    .filter((p) => p.awardValue)
    .reduce((sum, p) => sum + (p.awardValue || 0), 0)

  const pipelineStageCounts = state.pipelineEntries.reduce(
    (acc, p) => {
      acc[p.stage] = (acc[p.stage] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  const aiInsights = [
    '3 new vendors on VULCAN match your cUAS challenge with TRL 7+ solutions',
    'Tradewinds shows 12 companies with edge AI + IL5 certification relevant to maritime ISR',
    'Average time-to-award this quarter: 11 days — 30% faster than last quarter',
    'Counter-swarm capability gap detected: only 4 vendors offer multi-target engagement',
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">PAE Dashboard</h1>
          <p className="text-sm text-muted-foreground">Your acquisition command center</p>
        </div>
        <Button variant="accent" onClick={() => navigate('/challenges/new')}>
          <Plus className="w-4 h-4 mr-2" />
          New Challenge
        </Button>
      </div>

      {/* Metrics Strip */}
      <MetricsStrip
        metrics={[
          { label: 'Active Challenges', value: activeChallenges.length, icon: <Target className="w-4 h-4" />, change: '+2 this month', changeType: 'positive' },
          { label: 'Total Submissions', value: totalSubmissions, icon: <Users className="w-4 h-4" />, change: '+8 this week', changeType: 'positive' },
          { label: 'Avg Match Score', value: '78%', icon: <TrendingUp className="w-4 h-4" />, change: '+5% vs last quarter', changeType: 'positive' },
          { label: 'Pipeline Value', value: formatCurrency(pipelineValue), icon: <DollarSign className="w-4 h-4" /> },
          { label: 'Avg Days to Award', value: 11, icon: <Clock className="w-4 h-4" />, change: 'Target: <14 days', changeType: 'neutral' },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Challenges */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Active Challenges</h2>
            <button onClick={() => navigate('/challenges')} className="text-sm text-[var(--storefront-accent)] flex items-center gap-1 hover:underline">
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {myChallenges.slice(0, 6).map((challenge) => (
              <Card
                key={challenge.id}
                className="cursor-pointer hover:border-[var(--storefront-accent)]/50 transition-colors"
                onClick={() => navigate(`/challenges/${challenge.id}`)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={statusColors[challenge.status] + ' text-[10px] border-0'}>
                      {challenge.status.replace(/_/g, ' ').toUpperCase()}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground ml-auto">
                      {challenge.submissionCount} submissions
                    </span>
                  </div>
                  <h3 className="text-sm font-medium mb-2 line-clamp-2">{challenge.title}</h3>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {challenge.domains.map((d) => (
                      <Badge key={d} variant="secondary" className="text-[10px]">
                        {DOMAIN_LABELS[d]}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>{BUDGET_LABELS[challenge.budgetRange]}</span>
                    <span>{challenge.timeline}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Pipeline Mini View */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">OT Pipeline Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(PIPELINE_STAGE_LABELS).slice(0, 6).map(([stage, label]) => (
                  <div key={stage} className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground truncate mr-2">{label}</span>
                    <span className="font-mono font-medium">{pipelineStageCounts[stage] || 0}</span>
                  </div>
                ))}
              </div>
              <Button variant="ghost" size="sm" className="w-full mt-3 text-xs" onClick={() => navigate('/pipeline')}>
                View Pipeline →
              </Button>
            </CardContent>
          </Card>

          {/* AI Insights */}
          <Card className="border-[var(--storefront-accent)]/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[var(--storefront-accent)]" />
                AI Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {aiInsights.map((insight, i) => (
                  <div key={i} className="text-xs text-muted-foreground leading-relaxed pl-3 border-l-2 border-[var(--storefront-accent)]/30">
                    {insight}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
