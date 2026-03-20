import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '@/context/AppContext'
import { ChallengeCard } from './ChallengeCard'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import {
  DOMAIN_LABELS,
  type CapabilityDomain,
  type ChallengeStatus,
} from '@/types'
import {
  Plus,
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  LayoutGrid,
  List,
  X,
} from 'lucide-react'

type SortOption = 'date' | 'submissions' | 'status'

const STATUS_OPTIONS: { value: ChallengeStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All Statuses' },
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'submissions_open', label: 'Submissions Open' },
  { value: 'evaluation', label: 'Evaluation' },
  { value: 'shortlisted', label: 'Shortlisted' },
  { value: 'awarded', label: 'Awarded' },
  { value: 'closed', label: 'Closed' },
]

const statusSortOrder: Record<string, number> = {
  submissions_open: 0,
  evaluation: 1,
  shortlisted: 2,
  published: 3,
  draft: 4,
  awarded: 5,
  closed: 6,
}

export function ChallengeList() {
  const { state } = useApp()
  const navigate = useNavigate()

  const [searchQuery, setSearchQuery] = useState('')
  const [domainFilter, setDomainFilter] = useState<CapabilityDomain | null>(null)
  const [statusFilter, setStatusFilter] = useState<ChallengeStatus | 'all'>('all')
  const [sortBy, setSortBy] = useState<SortOption>('date')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const isGlobal = state.currentStorefront === 'global'
  const isPae = state.currentRole === 'pae'
  const isAdmin = state.currentRole === 'admin'

  const filteredChallenges = useMemo(() => {
    let challenges = state.challenges

    // Filter by storefront
    if (!isGlobal) {
      challenges = challenges.filter((c) => c.storefrontId === state.currentStorefront)
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      challenges = challenges.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.problemStatement.toLowerCase().includes(q)
      )
    }

    // Domain filter
    if (domainFilter) {
      challenges = challenges.filter((c) => c.domains.includes(domainFilter))
    }

    // Status filter
    if (statusFilter !== 'all') {
      challenges = challenges.filter((c) => c.status === statusFilter)
    }

    // Sort
    const sorted = [...challenges]
    switch (sortBy) {
      case 'date':
        sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case 'submissions':
        sorted.sort((a, b) => b.submissionCount - a.submissionCount)
        break
      case 'status':
        sorted.sort(
          (a, b) => (statusSortOrder[a.status] ?? 99) - (statusSortOrder[b.status] ?? 99)
        )
        break
    }

    return sorted
  }, [state.challenges, state.currentStorefront, isGlobal, searchQuery, domainFilter, statusFilter, sortBy])

  const domainKeys = Object.keys(DOMAIN_LABELS) as CapabilityDomain[]

  const toggleDomain = (domain: CapabilityDomain) => {
    setDomainFilter((prev) => (prev === domain ? null : domain))
  }

  const cycleSortBy = () => {
    setSortBy((prev) => {
      if (prev === 'date') return 'submissions'
      if (prev === 'submissions') return 'status'
      return 'date'
    })
  }

  const sortLabel: Record<SortOption, string> = {
    date: 'Newest',
    submissions: 'Most Submissions',
    status: 'By Status',
  }

  const clearFilters = () => {
    setSearchQuery('')
    setDomainFilter(null)
    setStatusFilter('all')
  }

  const hasActiveFilters = searchQuery.trim() || domainFilter || statusFilter !== 'all'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Challenges</h1>
          <p className="text-sm text-muted-foreground">
            {isGlobal ? 'All challenges across storefronts' : `${state.currentStorefront.toUpperCase()} challenges`}
            {' '}&middot; {filteredChallenges.length} result{filteredChallenges.length !== 1 ? 's' : ''}
          </p>
        </div>
        {(isPae || isAdmin) && (
          <Button variant="accent" onClick={() => navigate('/challenges/new')}>
            <Plus className="w-4 h-4 mr-2" />
            New Challenge
          </Button>
        )}
      </div>

      {/* Filter Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4">
            {/* Search + Controls */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search challenges..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Status Dropdown */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as ChallengeStatus | 'all')}
                className="h-9 rounded-md border border-input bg-transparent px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              {/* Sort */}
              <Button variant="outline" size="sm" onClick={cycleSortBy} className="gap-1.5">
                <ArrowUpDown className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{sortLabel[sortBy]}</span>
              </Button>

              {/* View Mode */}
              <div className="flex border border-border rounded-md">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Domain Filters */}
            <div className="flex items-center gap-2 flex-wrap">
              <SlidersHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
              {domainKeys.map((domain) => (
                <button
                  key={domain}
                  onClick={() => toggleDomain(domain)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                    domainFilter === domain
                      ? 'border-[var(--storefront-accent)] bg-[var(--storefront-accent)]/15 text-[var(--storefront-accent)]'
                      : 'border-border text-muted-foreground hover:border-[var(--storefront-accent)]/50 hover:text-foreground'
                  }`}
                >
                  {DOMAIN_LABELS[domain]}
                </button>
              ))}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-3 py-1 rounded-full text-xs font-medium text-muted-foreground hover:text-foreground flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  Clear
                </button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {filteredChallenges.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-muted-foreground text-sm">No challenges found matching your filters.</div>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="mt-3">
              Clear all filters
            </Button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredChallenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              showStorefront={isGlobal}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredChallenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              showStorefront={isGlobal}
            />
          ))}
        </div>
      )}
    </div>
  )
}
