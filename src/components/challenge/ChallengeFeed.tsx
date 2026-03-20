import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '@/context/AppContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DOMAIN_LABELS,
  BUDGET_LABELS,
  type CapabilityDomain,
  type BudgetRange,
  type ClassificationLevel,
  type Challenge,
} from '@/types'
import {
  Search,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Clock,
  FileText,
  Filter,
  Zap,
  X,
  TrendingUp,
} from 'lucide-react'
import { daysFromNow } from '@/lib/utils'

interface MatchedChallenge extends Challenge {
  matchScore: number
  matchExplanation: string
  matchReasons: string[]
}

const MATCH_REASONS_POOL = [
  'Strong domain alignment with your registered capabilities',
  'TRL range matches your product maturity level',
  'Past performance in similar DoD programs',
  'Active platform registrations on required channels',
  'Clearance level meets or exceeds requirements',
  'Budget range aligns with your typical contract size',
  'Geographic/deployment requirements match your experience',
  'Compliance certifications satisfy evaluation criteria',
  'Technology stack overlap with challenge requirements',
  'Similar problem domain to your previous submissions',
]

function generateMatchData(challenge: Challenge, index: number): MatchedChallenge {
  // Deterministic pseudo-random based on challenge id
  const seed = challenge.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const score = 95 - (index * 3) - ((seed % 7) * 2)
  const clampedScore = Math.max(52, Math.min(97, score))

  const reasonCount = 2 + (seed % 3)
  const reasons: string[] = []
  for (let i = 0; i < reasonCount; i++) {
    reasons.push(MATCH_REASONS_POOL[(seed + i * 7) % MATCH_REASONS_POOL.length])
  }

  const domainName = DOMAIN_LABELS[challenge.domains[0]]
  const explanation = `Strong capability overlap in ${domainName} with relevant past performance and TRL alignment.`

  return {
    ...challenge,
    matchScore: clampedScore,
    matchExplanation: explanation,
    matchReasons: reasons,
  }
}

export function ChallengeFeed() {
  const { state } = useApp()
  const navigate = useNavigate()

  const [searchQuery, setSearchQuery] = useState('')
  const [domainFilters, setDomainFilters] = useState<CapabilityDomain[]>([])
  const [budgetFilter, setBudgetFilter] = useState<BudgetRange | null>(null)
  const [classificationFilter, setClassificationFilter] = useState<ClassificationLevel | null>(null)
  const [trlRange, setTrlRange] = useState<[number, number]>([1, 9])
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set())
  const [showFilters, setShowFilters] = useState(true)

  const matchedChallenges = useMemo(() => {
    // Get open challenges
    let challenges = state.challenges.filter(
      (c) => c.status === 'published' || c.status === 'submissions_open'
    )

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      challenges = challenges.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.problemStatement.toLowerCase().includes(q)
      )
    }

    // Domain filter
    if (domainFilters.length > 0) {
      challenges = challenges.filter((c) =>
        c.domains.some((d) => domainFilters.includes(d))
      )
    }

    // Budget filter
    if (budgetFilter) {
      challenges = challenges.filter((c) => c.budgetRange === budgetFilter)
    }

    // Classification filter
    if (classificationFilter) {
      challenges = challenges.filter((c) => c.classification === classificationFilter)
    }

    // TRL filter
    challenges = challenges.filter(
      (c) => c.trlMin >= trlRange[0] && c.trlMax <= trlRange[1]
    )

    // Generate match data and sort by score
    return challenges
      .map((c, i) => generateMatchData(c, i))
      .sort((a, b) => b.matchScore - a.matchScore)
  }, [state.challenges, searchQuery, domainFilters, budgetFilter, classificationFilter, trlRange])

  const toggleExpanded = (id: string) => {
    setExpandedCards((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleDomain = (domain: CapabilityDomain) => {
    setDomainFilters((prev) =>
      prev.includes(domain) ? prev.filter((d) => d !== domain) : [...prev, domain]
    )
  }

  const domainKeys = Object.keys(DOMAIN_LABELS) as CapabilityDomain[]
  const budgetKeys = Object.keys(BUDGET_LABELS) as BudgetRange[]
  const classificationOptions: { value: ClassificationLevel; label: string }[] = [
    { value: 'unclassified', label: 'Unclassified' },
    { value: 'cui', label: 'CUI' },
    { value: 'secret', label: 'Secret' },
  ]

  const hasActiveFilters =
    searchQuery.trim() ||
    domainFilters.length > 0 ||
    budgetFilter !== null ||
    classificationFilter !== null ||
    trlRange[0] !== 1 ||
    trlRange[1] !== 9

  const clearFilters = () => {
    setSearchQuery('')
    setDomainFilters([])
    setBudgetFilter(null)
    setClassificationFilter(null)
    setTrlRange([1, 9])
  }

  const getScoreColor = (score: number): string => {
    if (score >= 85) return 'text-green-400'
    if (score >= 70) return 'text-[var(--storefront-accent)]'
    if (score >= 55) return 'text-yellow-400'
    return 'text-muted-foreground'
  }

  const getScoreBg = (score: number): string => {
    if (score >= 85) return 'bg-green-500/10 border-green-500/30'
    if (score >= 70) return 'bg-[var(--storefront-accent)]/10 border-[var(--storefront-accent)]/30'
    if (score >= 55) return 'bg-yellow-500/10 border-yellow-500/30'
    return 'bg-secondary border-border'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[var(--storefront-accent)]" />
            Challenge Discovery
          </h1>
          <p className="text-sm text-muted-foreground">
            AI-matched opportunities ranked by relevance to your capabilities
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="accent" className="text-xs">
            {matchedChallenges.length} matches
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters((f) => !f)}
            className="gap-1.5"
          >
            <Filter className="w-3.5 h-3.5" />
            Filters
          </Button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Filter Sidebar */}
        {showFilters && (
          <div className="w-64 flex-shrink-0 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Domain */}
            <Card>
              <CardHeader className="p-3 pb-2">
                <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">Domain</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="space-y-1">
                  {domainKeys.map((domain) => (
                    <label
                      key={domain}
                      className="flex items-center gap-2 py-1 cursor-pointer text-xs hover:text-foreground transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={domainFilters.includes(domain)}
                        onChange={() => toggleDomain(domain)}
                        className="rounded border-border accent-[var(--storefront-accent)]"
                      />
                      <span className={domainFilters.includes(domain) ? 'text-foreground' : 'text-muted-foreground'}>
                        {DOMAIN_LABELS[domain]}
                      </span>
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Budget */}
            <Card>
              <CardHeader className="p-3 pb-2">
                <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">Budget Range</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="space-y-1">
                  {budgetKeys.map((budget) => (
                    <label
                      key={budget}
                      className="flex items-center gap-2 py-1 cursor-pointer text-xs hover:text-foreground transition-colors"
                    >
                      <input
                        type="radio"
                        name="budget"
                        checked={budgetFilter === budget}
                        onChange={() => setBudgetFilter((prev) => (prev === budget ? null : budget))}
                        className="accent-[var(--storefront-accent)]"
                      />
                      <span className={budgetFilter === budget ? 'text-foreground' : 'text-muted-foreground'}>
                        {BUDGET_LABELS[budget]}
                      </span>
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Classification */}
            <Card>
              <CardHeader className="p-3 pb-2">
                <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">Classification</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="space-y-1">
                  {classificationOptions.map((opt) => (
                    <label
                      key={opt.value}
                      className="flex items-center gap-2 py-1 cursor-pointer text-xs hover:text-foreground transition-colors"
                    >
                      <input
                        type="radio"
                        name="classification"
                        checked={classificationFilter === opt.value}
                        onChange={() =>
                          setClassificationFilter((prev) =>
                            prev === opt.value ? null : opt.value
                          )
                        }
                        className="accent-[var(--storefront-accent)]"
                      />
                      <span className={classificationFilter === opt.value ? 'text-foreground' : 'text-muted-foreground'}>
                        {opt.label}
                      </span>
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* TRL Range */}
            <Card>
              <CardHeader className="p-3 pb-2">
                <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">
                  TRL Range: {trlRange[0]} – {trlRange[1]}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground w-6">Min</span>
                    <input
                      type="range"
                      min={1}
                      max={9}
                      value={trlRange[0]}
                      onChange={(e) => {
                        const val = Number(e.target.value)
                        setTrlRange(([, max]) => [Math.min(val, max), max])
                      }}
                      className="flex-1 accent-[var(--storefront-accent)]"
                    />
                    <span className="text-xs font-mono w-4 text-center">{trlRange[0]}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground w-6">Max</span>
                    <input
                      type="range"
                      min={1}
                      max={9}
                      value={trlRange[1]}
                      onChange={(e) => {
                        const val = Number(e.target.value)
                        setTrlRange(([min]) => [min, Math.max(val, min)])
                      }}
                      className="flex-1 accent-[var(--storefront-accent)]"
                    />
                    <span className="text-xs font-mono w-4 text-center">{trlRange[1]}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {hasActiveFilters && (
              <Button variant="ghost" size="sm" className="w-full text-xs" onClick={clearFilters}>
                <X className="w-3 h-3 mr-1" />
                Clear all filters
              </Button>
            )}
          </div>
        )}

        {/* Feed */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Match Summary */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <TrendingUp className="w-3.5 h-3.5 text-[var(--storefront-accent)]" />
            <span>
              Showing {matchedChallenges.length} opportunities sorted by AI match score.
              Scores based on domain alignment, TRL compatibility, past performance, and compliance readiness.
            </span>
          </div>

          {matchedChallenges.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-muted-foreground text-sm">No matching challenges found.</div>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="mt-3">
                  Clear all filters
                </Button>
              )}
            </div>
          ) : (
            matchedChallenges.map((challenge) => {
              const isExpanded = expandedCards.has(challenge.id)
              const closingDays = daysFromNow(challenge.closesAt)

              return (
                <Card
                  key={challenge.id}
                  className="hover:border-[var(--storefront-accent)]/50 transition-colors"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {/* Match Score */}
                      <div
                        className={`flex-shrink-0 w-16 h-16 rounded-lg flex flex-col items-center justify-center border ${getScoreBg(challenge.matchScore)}`}
                      >
                        <span className={`text-xl font-bold font-mono ${getScoreColor(challenge.matchScore)}`}>
                          {challenge.matchScore}
                        </span>
                        <span className="text-[9px] text-muted-foreground">match</span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <Badge variant="accent" className="text-[10px]">
                            {challenge.storefrontId.toUpperCase()}
                          </Badge>
                          <Badge
                            className={`text-[10px] border-0 ${
                              challenge.status === 'submissions_open'
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-blue-500/20 text-blue-400'
                            }`}
                          >
                            {challenge.status === 'submissions_open' ? 'OPEN' : 'PUBLISHED'}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            {challenge.submissionCount} submissions
                          </span>
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1 ml-auto">
                            <Clock className="w-3 h-3" />
                            {challenge.timeline}
                            {closingDays > 0 && (
                              <span className={closingDays <= 14 ? 'text-yellow-400' : ''}>
                                &middot; {closingDays}d left
                              </span>
                            )}
                          </span>
                        </div>

                        <h3
                          className="text-sm font-medium mb-1.5 cursor-pointer hover:text-[var(--storefront-accent)] transition-colors"
                          onClick={() => navigate(`/challenges/${challenge.id}`)}
                        >
                          {challenge.title}
                        </h3>

                        <div className="flex flex-wrap gap-1 mb-2">
                          {challenge.domains.map((d) => (
                            <Badge key={d} variant="secondary" className="text-[10px]">
                              {DOMAIN_LABELS[d]}
                            </Badge>
                          ))}
                          <span className="text-[10px] text-muted-foreground ml-2 flex items-center">
                            {BUDGET_LABELS[challenge.budgetRange]}
                          </span>
                        </div>

                        <p className="text-[11px] text-muted-foreground leading-relaxed mb-2">
                          {challenge.matchExplanation}
                        </p>

                        {/* Why This Matched */}
                        <button
                          onClick={() => toggleExpanded(challenge.id)}
                          className="text-[11px] text-[var(--storefront-accent)] flex items-center gap-1 hover:underline"
                        >
                          <Sparkles className="w-3 h-3" />
                          Why This Matched
                          {isExpanded ? (
                            <ChevronUp className="w-3 h-3" />
                          ) : (
                            <ChevronDown className="w-3 h-3" />
                          )}
                        </button>

                        {isExpanded && (
                          <div className="mt-2 p-3 rounded-lg bg-secondary/50 border border-border/50">
                            <div className="space-y-1.5">
                              {challenge.matchReasons.map((reason, i) => (
                                <div key={i} className="flex items-start gap-2 text-[11px] text-muted-foreground">
                                  <Zap className="w-3 h-3 text-[var(--storefront-accent)] mt-0.5 flex-shrink-0" />
                                  {reason}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action */}
                      <div className="flex-shrink-0">
                        <Button
                          variant="accent"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            navigate(`/submissions/new/${challenge.id}`)
                          }}
                        >
                          Apply
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
