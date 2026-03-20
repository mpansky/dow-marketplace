import { useNavigate } from 'react-router-dom'
import { useApp } from '@/context/AppContext'
import { MetricsStrip } from './MetricsStrip'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DOMAIN_LABELS, BUDGET_LABELS } from '@/types'
import { Target, Inbox, TrendingUp, Eye, BarChart3, ArrowRight, Lightbulb } from 'lucide-react'
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
} from 'recharts'

const submissionStatusColors: Record<string, string> = {
  submitted: 'bg-blue-500/20 text-blue-400',
  under_review: 'bg-yellow-500/20 text-yellow-400',
  evaluation: 'bg-purple-500/20 text-purple-400',
  shortlisted: 'bg-emerald-500/20 text-emerald-400',
  awarded: 'bg-green-500/20 text-green-400',
  not_selected: 'bg-red-500/20 text-red-400',
}

export function NDCDashboard() {
  const { state } = useApp()
  const navigate = useNavigate()

  const matchedChallenges = state.challenges
    .filter((c) => c.status === 'published' || c.status === 'submissions_open')
    .map((c) => ({
      ...c,
      matchScore: Math.floor(Math.random() * 30 + 65),
      matchExplanation: `Strong capability overlap in ${DOMAIN_LABELS[c.domains[0]]} with relevant past performance and TRL alignment.`,
    }))
    .sort((a, b) => b.matchScore - a.matchScore)

  const mySubmissions = state.submissions.slice(0, 8)

  const healthData = [
    { subject: 'Profile', value: 85 },
    { subject: 'Platforms', value: 70 },
    { subject: 'Engagement', value: 65 },
    { subject: 'Performance', value: 80 },
    { subject: 'Compliance', value: 75 },
  ]

  const recommendations = [
    'Add FedRAMP certification to increase match score by ~15%',
    'Register on Tradewinds to expand visibility to CYBERCOM buyers',
    'Update product TRL levels — 2 products may qualify for higher TRL',
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Company Dashboard</h1>
          <p className="text-sm text-muted-foreground">Your marketplace command center</p>
        </div>
        <Button variant="accent" onClick={() => navigate('/profile')}>
          Edit Profile
        </Button>
      </div>

      <MetricsStrip
        metrics={[
          { label: 'Challenges Matched', value: matchedChallenges.length, icon: <Target className="w-4 h-4" /> },
          { label: 'Submissions Active', value: mySubmissions.filter((s) => s.status !== 'not_selected' && s.status !== 'awarded').length, icon: <Inbox className="w-4 h-4" /> },
          { label: 'Win Rate', value: '28%', icon: <TrendingUp className="w-4 h-4" />, change: '+8% vs avg', changeType: 'positive' },
          { label: 'Avg Match Score', value: '76%', icon: <BarChart3 className="w-4 h-4" /> },
          { label: 'Profile Views', value: 142, icon: <Eye className="w-4 h-4" />, change: '+23 this week', changeType: 'positive' },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Match Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Top Challenge Matches</h2>
            <button onClick={() => navigate('/challenges')} className="text-sm text-[var(--storefront-accent)] flex items-center gap-1 hover:underline">
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {matchedChallenges.slice(0, 5).map((challenge) => (
              <Card
                key={challenge.id}
                className="cursor-pointer hover:border-[var(--storefront-accent)]/50 transition-colors"
                onClick={() => navigate(`/challenges/${challenge.id}`)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Match Score */}
                    <div className="flex-shrink-0 w-14 h-14 rounded-lg flex flex-col items-center justify-center"
                      style={{ background: 'var(--storefront-accent-dim)' }}>
                      <span className="text-lg font-bold font-mono" style={{ color: 'var(--storefront-accent)' }}>
                        {challenge.matchScore}
                      </span>
                      <span className="text-[9px] text-muted-foreground">match</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="accent" className="text-[10px]">
                          {challenge.storefrontId.toUpperCase()}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">
                          {challenge.submissionCount} submissions · {challenge.timeline}
                        </span>
                      </div>
                      <h3 className="text-sm font-medium mb-1">{challenge.title}</h3>
                      <div className="flex flex-wrap gap-1 mb-1.5">
                        {challenge.domains.map((d) => (
                          <Badge key={d} variant="secondary" className="text-[10px]">{DOMAIN_LABELS[d]}</Badge>
                        ))}
                      </div>
                      <p className="text-[11px] text-muted-foreground">{challenge.matchExplanation}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-xs font-medium">{BUDGET_LABELS[challenge.budgetRange]}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Active Submissions */}
          <h2 className="text-lg font-semibold mt-6">Active Submissions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {mySubmissions.slice(0, 4).map((sub) => {
              const challenge = state.challenges.find((c) => c.id === sub.challengeId)
              return (
                <Card key={sub.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={`${submissionStatusColors[sub.status]} text-[10px] border-0`}>
                        {sub.status.replace(/_/g, ' ').toUpperCase()}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        Score: {sub.matchScore}%
                      </span>
                    </div>
                    <h3 className="text-sm font-medium line-clamp-2">
                      {challenge?.title || 'Challenge'}
                    </h3>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      Submitted {sub.submittedAt}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Health Score */}
          <Card>
            <CardHeader className="pb-0">
              <CardTitle className="text-sm">Company Health Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={healthData}>
                    <PolarGrid stroke="#1e293b" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <Radar
                      dataKey="value"
                      stroke="var(--storefront-accent)"
                      fill="var(--storefront-accent)"
                      fillOpacity={0.15}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="text-center">
                <span className="text-3xl font-bold font-mono" style={{ color: 'var(--storefront-accent)' }}>75</span>
                <span className="text-sm text-muted-foreground">/100</span>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card className="border-[var(--storefront-accent)]/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-[var(--storefront-accent)]" />
                Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recommendations.map((rec, i) => (
                  <div key={i} className="text-xs text-muted-foreground leading-relaxed pl-3 border-l-2 border-[var(--storefront-accent)]/30">
                    {rec}
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
