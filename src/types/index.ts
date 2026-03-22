export type UserRole = 'pae' | 'ndc' | 'admin'

export type StorefrontId = 'indopacom' | 'cybercom' | 'global'

export type CapabilityDomain = 'cuas' | 'cyber' | 'aiml' | 'autonomy'

export type ChallengeStatus = 'draft' | 'published' | 'submissions_open' | 'evaluation' | 'shortlisted' | 'awarded' | 'closed'

export type SubmissionStatus = 'submitted' | 'under_review' | 'evaluation' | 'shortlisted' | 'awarded' | 'not_selected'

export type PipelineStage =
  | 'challenge_published'
  | 'market_scan'
  | 'submissions_open'
  | 'evaluation'
  | 'shortlist'
  | 'prototype_demo'
  | 'ot_award'
  | 'performance_period'

export type ClearanceLevel = 'none' | 'pending' | 'secret' | 'ts_sci'

export type PlatformSource = 'vulcan' | 'tradewinds' | 'lynx' | 'eris' | 'ot_consortia'

export type BarrierCategory = 'policy' | 'process' | 'technical' | 'cultural' | 'financial'

export type BarrierSeverity = 'critical' | 'high' | 'medium' | 'low'

export type BarrierStatus = 'identified' | 'assigned' | 'in_progress' | 'resolved' | 'verified'

export type FundingStage = 'bootstrapped' | 'seed' | 'series_a' | 'series_b' | 'series_c' | 'series_d' | 'public'

export type EvaluationApproach = 'prototype_demo' | 'technical_assessment' | 'oral_presentation' | 'combined'

export type CompetitionType = 'open' | 'directed' | 'domain_limited'

export type BudgetRange = '100k_5m' | '5m_25m' | '25m_plus'

export type ClassificationLevel = 'unclassified' | 'cui' | 'secret'

export interface User {
  id: string
  name: string
  role: UserRole
  title: string
  organization: string
  email: string
  avatar?: string
  storefront?: StorefrontId
}

export interface StorefrontConfig {
  id: StorefrontId
  name: string
  command: string
  description: string
  tagline: string
  accentColor: string
  accentRgb: string
  priorityDomains: CapabilityDomain[]
  heroClass: string
  visionTagline?: string
  acquisitionBrand?: string
  cadreDescription?: string
}

export interface Vendor {
  id: string
  name: string
  tagline: string
  description: string
  hqLocation: string
  employeeCount: number
  foundingYear: number
  fundingStage: FundingStage
  investors: string[]
  website: string
  domains: CapabilityDomain[]
  techStack: string[]
  clearanceLevel: ClearanceLevel
  compliance: {
    fedramp?: string
    ilLevel?: number
    cato?: boolean
    cmmc?: number
    nist80071?: boolean
  }
  pastPerformance: PastPerformance[]
  contractVehicles: string[]
  platformRegistrations: PlatformSource[]
  products: Product[]
  healthScore: HealthScore
  matchScore?: number
  matchExplanation?: string
}

export interface Product {
  id: string
  vendorId: string
  name: string
  description: string
  trl: number
  domains: CapabilityDomain[]
  demoUrl?: string
  docsUrl?: string
}

export interface PastPerformance {
  program: string
  agency: string
  value: string
  year: number
  description: string
}

export interface HealthScore {
  overall: number
  profileCompleteness: number
  platformBreadth: number
  engagementRate: number
  pastPerformanceStrength: number
  complianceReadiness: number
}

export interface Challenge {
  id: string
  storefrontId: StorefrontId
  paeId: string
  title: string
  problemStatement: string
  domains: CapabilityDomain[]
  classification: ClassificationLevel
  trlMin: number
  trlMax: number
  budgetRange: BudgetRange
  timeline: string
  evaluationApproach: EvaluationApproach
  competitionType: CompetitionType
  ddilRequirements?: string
  coalitionRequirements?: string
  swapConstraints?: string
  deploymentEnvironment?: string
  targetEnvironment?: string
  classificationForDev?: string
  integrationRequirements?: string
  deploymentModel?: string
  status: ChallengeStatus
  createdAt: string
  closesAt: string
  submissionCount: number
  matchedVendorIds: string[]
}

export interface Submission {
  id: string
  challengeId: string
  vendorId: string
  solutionOverview: string
  technicalApproach: string
  pastPerformanceRefs: string[]
  prototypePlan: string
  pricingRom: string
  evidenceLinks: string[]
  status: SubmissionStatus
  matchScore: number
  aiReview?: string
  submittedAt: string
}

export interface Match {
  id: string
  challengeId: string
  vendorId: string
  score: number
  explanation: string
  platformSource: PlatformSource
  curatedStatus: 'pending' | 'approved' | 'rejected' | 'flagged'
  curatedBy?: string
  curatedAt?: string
}

export interface PipelineEntry {
  id: string
  challengeId: string
  vendorId?: string
  stage: PipelineStage
  enteredStageAt: string
  daysInStage: number
  awardValue?: number
  healthStatus: 'green' | 'yellow' | 'red'
}

export interface Barrier {
  id: string
  title: string
  description: string
  category: BarrierCategory
  severity: BarrierSeverity
  affectedStakeholders: string[]
  reportedBy: string
  status: BarrierStatus
  assignedTo?: string
  sprintId?: string
  identifiedAt: string
  resolvedAt?: string
}

export interface Notification {
  id: string
  title: string
  message: string
  type: 'match' | 'submission' | 'pipeline' | 'barrier' | 'system'
  role: UserRole
  read: boolean
  createdAt: string
  linkTo?: string
}

export interface DomainInfo {
  id: CapabilityDomain
  name: string
  description: string
  icon: string
  subcategories: string[]
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  citations?: Citation[]
}

export interface Citation {
  type: 'vendor' | 'challenge' | 'pipeline'
  id: string
  label: string
}

export const DOMAIN_LABELS: Record<CapabilityDomain, string> = {
  cuas: 'cUAS / Counter-Drone',
  cyber: 'Cyber / Zero Trust',
  aiml: 'AI/ML Solutions',
  autonomy: 'Autonomy & Robotics',
}

export const PLATFORM_LABELS: Record<PlatformSource, string> = {
  vulcan: 'VULCAN',
  tradewinds: 'Tradewinds',
  lynx: 'LYNX',
  eris: 'DARPA ERIS',
  ot_consortia: 'OT Consortia',
}

export const PLATFORM_COLORS: Record<PlatformSource, string> = {
  vulcan: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  tradewinds: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  lynx: 'bg-green-500/20 text-green-400 border-green-500/30',
  eris: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  ot_consortia: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
}

export const BUDGET_LABELS: Record<BudgetRange, string> = {
  '100k_5m': '$100K – $5M',
  '5m_25m': '$5M – $25M',
  '25m_plus': '$25M+',
}

export const CLEARANCE_LABELS: Record<ClearanceLevel, string> = {
  none: 'None',
  pending: 'Pending',
  secret: 'SECRET',
  ts_sci: 'TS/SCI',
}

export const PIPELINE_STAGE_LABELS: Record<PipelineStage, string> = {
  challenge_published: 'Challenge Published',
  market_scan: 'Market Scan Complete',
  submissions_open: 'Submissions Open',
  evaluation: 'Evaluation In Progress',
  shortlist: 'Shortlist / Selection',
  prototype_demo: 'Prototype Demo',
  ot_award: 'OT Award',
  performance_period: 'Performance Period',
}

export const BARRIER_CATEGORY_LABELS: Record<BarrierCategory, string> = {
  policy: 'Policy',
  process: 'Process',
  technical: 'Technical',
  cultural: 'Cultural',
  financial: 'Financial',
}
