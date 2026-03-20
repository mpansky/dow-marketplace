import { useApp } from '@/context/AppContext'
import { MetricsStrip } from './MetricsStrip'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import {
  Store, Target, Building2, Inbox, Clock, AlertTriangle, ArrowRight, CheckCircle2,
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line,
} from 'recharts'

const COLORS = ['#0077B6', '#39FF14', '#a855f7', '#f97316', '#ef4444']

export function AdminDashboard() {
  const { state } = useApp()
  const navigate = useNavigate()

  const activeChallenges = state.challenges.filter((c) => c.status !== 'draft' && c.status !== 'closed')
  const pendingMatches = state.matches.filter((m) => m.curatedStatus === 'pending')
  const openBarriers = state.barriers.filter((b) => b.status !== 'resolved' && b.status !== 'verified')
  const resolvedBarriers = state.barriers.filter((b) => b.status === 'resolved' || b.status === 'verified')

  const pipelineVelocity = [
    { stage: 'Published', avg: 2 },
    { stage: 'Market Scan', avg: 1 },
    { stage: 'Submissions', avg: 5 },
    { stage: 'Evaluation', avg: 4 },
    { stage: 'Shortlist', avg: 2 },
    { stage: 'Demo', avg: 3 },
    { stage: 'Award', avg: 1 },
  ]

  const platformDistribution = [
    { name: 'VULCAN', value: 28 },
    { name: 'Tradewinds', value: 18 },
    { name: 'LYNX', value: 12 },
    { name: 'ERIS', value: 8 },
    { name: 'OT Consortia', value: 10 },
  ]

  const submissionTrend = [
    { week: 'W1', count: 8 },
    { week: 'W2', count: 12 },
    { week: 'W3', count: 10 },
    { week: 'W4', count: 18 },
    { week: 'W5', count: 15 },
    { week: 'W6', count: 22 },
    { week: 'W7', count: 20 },
    { week: 'W8', count: 28 },
  ]

  const platformStatuses = [
    { name: 'VULCAN', status: 'Synced', color: 'text-green-400' },
    { name: 'Tradewinds', status: 'Synced', color: 'text-green-400' },
    { name: 'LYNX', status: 'Partial', color: 'text-yellow-400' },
    { name: 'DARPA ERIS', status: 'Pending', color: 'text-orange-400' },
    { name: 'OT Consortia', status: 'Synced', color: 'text-green-400' },
  ]

  const barriersByCategory = [
    { category: 'Policy', count: state.barriers.filter((b) => b.category === 'policy').length },
    { category: 'Process', count: state.barriers.filter((b) => b.category === 'process').length },
    { category: 'Technical', count: state.barriers.filter((b) => b.category === 'technical').length },
    { category: 'Cultural', count: state.barriers.filter((b) => b.category === 'cultural').length },
    { category: 'Financial', count: state.barriers.filter((b) => b.category === 'financial').length },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Cadre Operations Dashboard</h1>
        <p className="text-sm text-muted-foreground">Platform-wide operational view</p>
      </div>

      <MetricsStrip
        metrics={[
          { label: 'Active Storefronts', value: 2, icon: <Store className="w-4 h-4" /> },
          { label: 'Active Challenges', value: activeChallenges.length, icon: <Target className="w-4 h-4" /> },
          { label: 'Total Vendors', value: state.vendors.length, icon: <Building2 className="w-4 h-4" /> },
          { label: 'Pending Curation', value: pendingMatches.length, icon: <Inbox className="w-4 h-4" />, change: 'Action needed', changeType: 'negative' },
          { label: 'Open Barriers', value: openBarriers.length, icon: <AlertTriangle className="w-4 h-4" />, change: `${resolvedBarriers.length} resolved`, changeType: 'positive' },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline Velocity */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Pipeline Velocity (Avg Days per Stage)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pipelineVelocity}>
                  <XAxis dataKey="stage" tick={{ fill: '#94a3b8', fontSize: 9 }} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ background: '#111118', border: '1px solid #1e293b', borderRadius: 8, fontSize: 12 }}
                  />
                  <Bar dataKey="avg" fill="var(--storefront-accent)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center text-xs text-muted-foreground mt-2">
              Total avg: <span className="font-mono font-medium text-foreground">18 days</span> challenge-to-award
            </div>
          </CardContent>
        </Card>

        {/* Submission Trend */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Inbox className="w-4 h-4" />
              Submission Volume Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={submissionTrend}>
                  <XAxis dataKey="week" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ background: '#111118', border: '1px solid #1e293b', borderRadius: 8, fontSize: 12 }}
                  />
                  <Line type="monotone" dataKey="count" stroke="var(--storefront-accent)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Platform Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Vendor Distribution by Platform</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="h-40 w-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={platformDistribution} dataKey="value" cx="50%" cy="50%" outerRadius={60} innerRadius={35}>
                      {platformDistribution.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                {platformDistribution.map((p, i) => (
                  <div key={p.name} className="flex items-center gap-2 text-xs">
                    <div className="w-2 h-2 rounded-full" style={{ background: COLORS[i] }} />
                    <span className="text-muted-foreground">{p.name}</span>
                    <span className="font-mono ml-auto">{p.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Platform Integration Status */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Platform Integration Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {platformStatuses.map((p) => (
                <div key={p.name} className="flex items-center justify-between">
                  <span className="text-sm">{p.name}</span>
                  <Badge variant="outline" className={`${p.color} text-[10px]`}>
                    {p.status === 'Synced' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                    {p.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Barriers Summary */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Barrier-to-Entry Summary
            </CardTitle>
            <button onClick={() => navigate('/admin/barriers')} className="text-xs text-[var(--storefront-accent)] flex items-center gap-1 hover:underline">
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-3">
            {barriersByCategory.map((b) => (
              <div key={b.category} className="text-center p-3 bg-secondary rounded-lg">
                <div className="text-lg font-bold font-mono">{b.count}</div>
                <div className="text-[10px] text-muted-foreground">{b.category}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
