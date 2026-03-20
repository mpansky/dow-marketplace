import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '@/context/AppContext'
import {
  DOMAIN_LABELS,
  BUDGET_LABELS,
  PIPELINE_STAGE_LABELS,
  type PipelineStage,
} from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate, daysFromNow, getInitials } from '@/lib/utils'
import {
  ArrowLeft,
  Edit3,
  Send,
  Clock,
  DollarSign,
  Shield,
  Target,
  Users,
  FileText,
  Layers,
  Zap,
  Globe,
  Server,
  Radio,
  Lock,
  GitBranch,
  CheckCircle2,
} from 'lucide-react'

const statusColors: Record<string, string> = {
  draft: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  published: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  submissions_open: 'bg-green-500/20 text-green-400 border-green-500/30',
  evaluation: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  shortlisted: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  awarded: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  closed: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
}

const statusLabels: Record<string, string> = {
  draft: 'DRAFT',
  published: 'PUBLISHED',
  submissions_open: 'SUBMISSIONS OPEN',
  evaluation: 'EVALUATION',
  shortlisted: 'SHORTLISTED',
  awarded: 'AWARDED',
  closed: 'CLOSED',
}

const classificationLabels: Record<string, string> = {
  unclassified: 'UNCLASSIFIED',
  cui: 'CUI',
  secret: 'SECRET',
}

const classificationColors: Record<string, string> = {
  unclassified: 'bg-green-500/20 text-green-400',
  cui: 'bg-yellow-500/20 text-yellow-400',
  secret: 'bg-red-500/20 text-red-400',
}

const evaluationLabels: Record<string, string> = {
  prototype_demo: 'Prototype Demo',
  technical_assessment: 'Technical Assessment',
  oral_presentation: 'Oral Presentation',
  combined: 'Combined Evaluation',
}

const competitionLabels: Record<string, string> = {
  open: 'Open Competition',
  directed: 'Directed',
  domain_limited: 'Domain Limited',
}

const pipelineStageOrder: PipelineStage[] = [
  'challenge_published',
  'market_scan',
  'submissions_open',
  'evaluation',
  'shortlist',
  'prototype_demo',
  'ot_award',
  'performance_period',
]

export function ChallengeDetail() {
  const { id } = useParams<{ id: string }>()
  const { state } = useApp()
  const navigate = useNavigate()

  const challenge = state.challenges.find((c) => c.id === id)

  if (!challenge) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-muted-foreground text-sm mb-4">Challenge not found</div>
        <Button variant="outline" onClick={() => navigate('/challenges')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Challenges
        </Button>
      </div>
    )
  }

  const closingDays = daysFromNow(challenge.closesAt)
  const isPae = state.currentRole === 'pae'
  const isNdc = state.currentRole === 'ndc'
  const isAdmin = state.currentRole === 'admin'

  // Pipeline progress based on challenge status
  const statusToPipelineIndex: Record<string, number> = {
    draft: -1,
    published: 0,
    submissions_open: 2,
    evaluation: 3,
    shortlisted: 4,
    awarded: 6,
    closed: 7,
  }
  const currentPipelineIndex = statusToPipelineIndex[challenge.status] ?? 0

  // Get submissions for this challenge
  const challengeSubmissions = state.submissions.filter(
    (s) => s.challengeId === challenge.id
  )

  // Find matching vendors from state
  const matchedVendors = challenge.matchedVendorIds.map((vid) => {
    const vendor = state.vendors.find((v) => v.id === vid)
    return {
      id: vid,
      name: vendor?.name ?? vid.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      initials: vendor ? getInitials(vendor.name) : vid.slice(0, 2).toUpperCase(),
    }
  })

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate('/challenges')}
        className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Challenges
      </button>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <Badge className={`${statusColors[challenge.status]} text-xs border`}>
              {statusLabels[challenge.status]}
            </Badge>
            <Badge variant="accent" className="text-xs">
              {challenge.storefrontId.toUpperCase()}
            </Badge>
            <Badge className={`${classificationColors[challenge.classification]} text-xs border-0`}>
              {classificationLabels[challenge.classification]}
            </Badge>
          </div>
          <h1 className="text-2xl font-bold mb-2">{challenge.title}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {challenge.timeline}
            </span>
            <span className="flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5" />
              {BUDGET_LABELS[challenge.budgetRange]}
            </span>
            {closingDays > 0 ? (
              <span className={`flex items-center gap-1 ${closingDays <= 14 ? 'text-yellow-400' : ''}`}>
                Closes {formatDate(challenge.closesAt)} ({closingDays}d left)
              </span>
            ) : (
              <span className="text-muted-foreground">Closed {formatDate(challenge.closesAt)}</span>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {challenge.domains.map((d) => (
              <Badge key={d} variant="secondary" className="text-xs">
                {DOMAIN_LABELS[d]}
              </Badge>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {(isPae || isAdmin) && (
            <Button variant="outline" onClick={() => navigate(`/challenges/${challenge.id}/edit`)}>
              <Edit3 className="w-4 h-4 mr-2" />
              Edit
            </Button>
          )}
          {isNdc && (challenge.status === 'published' || challenge.status === 'submissions_open') && (
            <Button variant="accent" onClick={() => navigate(`/submissions/new/${challenge.id}`)}>
              <Send className="w-4 h-4 mr-2" />
              Submit Proposal
            </Button>
          )}
        </div>
      </div>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Problem Statement */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Target className="w-4 h-4 text-[var(--storefront-accent)]" />
                Problem Statement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {challenge.problemStatement}
              </p>
            </CardContent>
          </Card>

          {/* Parameters */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Layers className="w-4 h-4 text-[var(--storefront-accent)]" />
                Challenge Parameters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <ParameterItem
                  icon={<Shield className="w-3.5 h-3.5" />}
                  label="Classification"
                  value={classificationLabels[challenge.classification]}
                />
                <ParameterItem
                  icon={<Zap className="w-3.5 h-3.5" />}
                  label="TRL Range"
                  value={`TRL ${challenge.trlMin} – ${challenge.trlMax}`}
                />
                <ParameterItem
                  icon={<DollarSign className="w-3.5 h-3.5" />}
                  label="Budget Range"
                  value={BUDGET_LABELS[challenge.budgetRange]}
                />
                <ParameterItem
                  icon={<Clock className="w-3.5 h-3.5" />}
                  label="Timeline"
                  value={challenge.timeline}
                />
                <ParameterItem
                  icon={<FileText className="w-3.5 h-3.5" />}
                  label="Evaluation Approach"
                  value={evaluationLabels[challenge.evaluationApproach]}
                />
                <ParameterItem
                  icon={<Users className="w-3.5 h-3.5" />}
                  label="Competition Type"
                  value={competitionLabels[challenge.competitionType]}
                />
              </div>
            </CardContent>
          </Card>

          {/* Additional Requirements */}
          {(challenge.ddilRequirements ||
            challenge.coalitionRequirements ||
            challenge.swapConstraints ||
            challenge.deploymentEnvironment ||
            challenge.targetEnvironment ||
            challenge.classificationForDev ||
            challenge.integrationRequirements ||
            challenge.deploymentModel) && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Server className="w-4 h-4 text-[var(--storefront-accent)]" />
                  Additional Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {challenge.ddilRequirements && (
                    <RequirementItem
                      icon={<Radio className="w-3.5 h-3.5 text-yellow-400" />}
                      label="DDIL Requirements"
                      value={challenge.ddilRequirements}
                    />
                  )}
                  {challenge.coalitionRequirements && (
                    <RequirementItem
                      icon={<Globe className="w-3.5 h-3.5 text-blue-400" />}
                      label="Coalition Requirements"
                      value={challenge.coalitionRequirements}
                    />
                  )}
                  {challenge.swapConstraints && (
                    <RequirementItem
                      icon={<Zap className="w-3.5 h-3.5 text-orange-400" />}
                      label="SWaP Constraints"
                      value={challenge.swapConstraints}
                    />
                  )}
                  {challenge.deploymentEnvironment && (
                    <RequirementItem
                      icon={<Server className="w-3.5 h-3.5 text-green-400" />}
                      label="Deployment Environment"
                      value={challenge.deploymentEnvironment}
                    />
                  )}
                  {challenge.targetEnvironment && (
                    <RequirementItem
                      icon={<Target className="w-3.5 h-3.5 text-purple-400" />}
                      label="Target Environment"
                      value={challenge.targetEnvironment}
                    />
                  )}
                  {challenge.classificationForDev && (
                    <RequirementItem
                      icon={<Lock className="w-3.5 h-3.5 text-red-400" />}
                      label="Classification for Development"
                      value={challenge.classificationForDev}
                    />
                  )}
                  {challenge.integrationRequirements && (
                    <RequirementItem
                      icon={<GitBranch className="w-3.5 h-3.5 text-cyan-400" />}
                      label="Integration Requirements"
                      value={challenge.integrationRequirements}
                    />
                  )}
                  {challenge.deploymentModel && (
                    <RequirementItem
                      icon={<Server className="w-3.5 h-3.5 text-emerald-400" />}
                      label="Deployment Model"
                      value={challenge.deploymentModel}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column (1/3) */}
        <div className="space-y-6">
          {/* Submissions */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-[var(--storefront-accent)]" />
                Submissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2 mb-3">
                <span
                  className="text-3xl font-bold font-mono"
                  style={{ color: 'var(--storefront-accent)' }}
                >
                  {challenge.submissionCount}
                </span>
                <span className="text-sm text-muted-foreground">total submissions</span>
              </div>
              {challengeSubmissions.length > 0 && (
                <div className="space-y-2">
                  {challengeSubmissions.slice(0, 5).map((sub) => (
                    <div
                      key={sub.id}
                      className="flex items-center justify-between text-xs py-1.5 border-b border-border/50 last:border-0"
                    >
                      <span className="text-muted-foreground truncate mr-2">
                        {sub.id}
                      </span>
                      <span className="font-mono">{sub.matchScore}%</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Matched Vendors */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-[var(--storefront-accent)]" />
                Matched Vendors ({matchedVendors.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {matchedVendors.map((vendor) => (
                  <div
                    key={vendor.id}
                    className="flex items-center gap-3 py-1.5 cursor-pointer hover:bg-secondary/50 -mx-2 px-2 rounded transition-colors"
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(`/vendors/${vendor.id}`)
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                      style={{
                        background: 'var(--storefront-accent-dim, rgba(59,130,246,0.1))',
                        color: 'var(--storefront-accent)',
                      }}
                    >
                      {vendor.initials}
                    </div>
                    <span className="text-xs font-medium truncate">{vendor.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pipeline Status */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-[var(--storefront-accent)]" />
                Pipeline Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-0">
                {pipelineStageOrder.map((stage, index) => {
                  const isCompleted = index <= currentPipelineIndex
                  const isCurrent = index === currentPipelineIndex
                  return (
                    <div key={stage} className="flex items-start gap-3 relative">
                      {/* Vertical Line */}
                      {index < pipelineStageOrder.length - 1 && (
                        <div
                          className={`absolute left-[11px] top-6 w-0.5 h-5 ${
                            isCompleted ? 'bg-[var(--storefront-accent)]' : 'bg-border'
                          }`}
                        />
                      )}
                      {/* Circle */}
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isCurrent
                            ? 'bg-[var(--storefront-accent)] text-white'
                            : isCompleted
                              ? 'bg-[var(--storefront-accent)]/20 text-[var(--storefront-accent)]'
                              : 'bg-secondary text-muted-foreground'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <span className="text-[9px] font-mono">{index + 1}</span>
                        )}
                      </div>
                      {/* Label */}
                      <span
                        className={`text-xs pt-1 ${
                          isCurrent
                            ? 'text-foreground font-medium'
                            : isCompleted
                              ? 'text-muted-foreground'
                              : 'text-muted-foreground/50'
                        }`}
                      >
                        {PIPELINE_STAGE_LABELS[stage]}
                      </span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardContent className="p-4">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span>{formatDate(challenge.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Closes</span>
                  <span>{formatDate(challenge.closesAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">PAE ID</span>
                  <span className="font-mono">{challenge.paeId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Challenge ID</span>
                  <span className="font-mono">{challenge.id}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function ParameterItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-2">
      <div className="mt-0.5 text-muted-foreground">{icon}</div>
      <div>
        <div className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</div>
        <div className="text-sm font-medium">{value}</div>
      </div>
    </div>
  )
}

function RequirementItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="pl-3 border-l-2 border-border">
      <div className="flex items-center gap-1.5 mb-1">
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">{value}</p>
    </div>
  )
}
