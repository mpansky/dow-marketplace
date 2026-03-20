import { useState, useMemo } from 'react'
import { useApp } from '@/context/AppContext'
import type { Vendor, CapabilityDomain, ClearanceLevel, PlatformSource } from '@/types'
import { DOMAIN_LABELS, CLEARANCE_LABELS, PLATFORM_LABELS } from '@/types'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, SlidersHorizontal, X, Building2 } from 'lucide-react'
import { VendorCard } from './VendorCard'
import { VendorDetail } from './VendorDetail'

const ALL_DOMAINS: CapabilityDomain[] = ['cuas', 'cyber', 'aiml', 'autonomy']
const ALL_CLEARANCES: ClearanceLevel[] = ['none', 'pending', 'secret', 'ts_sci']
const ALL_PLATFORMS: PlatformSource[] = ['vulcan', 'tradewinds', 'lynx', 'eris', 'ot_consortia']

export function VendorDirectory() {
  const { state } = useApp()

  const [search, setSearch] = useState('')
  const [selectedDomains, setSelectedDomains] = useState<CapabilityDomain[]>([])
  const [selectedClearance, setSelectedClearance] = useState<ClearanceLevel | ''>('')
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformSource[]>([])
  const [trlRange, setTrlRange] = useState<[number, number]>([1, 9])
  const [showFilters, setShowFilters] = useState(false)
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null)

  const toggleDomain = (domain: CapabilityDomain) => {
    setSelectedDomains((prev) =>
      prev.includes(domain) ? prev.filter((d) => d !== domain) : [...prev, domain]
    )
  }

  const togglePlatform = (platform: PlatformSource) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]
    )
  }

  const clearFilters = () => {
    setSearch('')
    setSelectedDomains([])
    setSelectedClearance('')
    setSelectedPlatforms([])
    setTrlRange([1, 9])
  }

  const hasActiveFilters =
    search !== '' ||
    selectedDomains.length > 0 ||
    selectedClearance !== '' ||
    selectedPlatforms.length > 0 ||
    trlRange[0] !== 1 ||
    trlRange[1] !== 9

  const filtered = useMemo(() => {
    return state.vendors.filter((v: Vendor) => {
      // Search
      if (search) {
        const q = search.toLowerCase()
        const matchesSearch =
          v.name.toLowerCase().includes(q) ||
          v.tagline.toLowerCase().includes(q) ||
          v.description.toLowerCase().includes(q) ||
          v.techStack.some((t) => t.toLowerCase().includes(q))
        if (!matchesSearch) return false
      }

      // Domain filter
      if (selectedDomains.length > 0) {
        if (!selectedDomains.some((d) => v.domains.includes(d))) return false
      }

      // Clearance filter
      if (selectedClearance && v.clearanceLevel !== selectedClearance) return false

      // Platform filter
      if (selectedPlatforms.length > 0) {
        if (!selectedPlatforms.some((p) => v.platformRegistrations.includes(p))) return false
      }

      // TRL range
      const maxTrl = Math.max(...v.products.map((p) => p.trl), 0)
      if (maxTrl < trlRange[0] || maxTrl > trlRange[1]) return false

      return true
    })
  }, [state.vendors, search, selectedDomains, selectedClearance, selectedPlatforms, trlRange])

  const selectedVendor = selectedVendorId
    ? state.vendors.find((v) => v.id === selectedVendorId) ?? null
    : null

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Vendor Directory</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Browse and filter across all registered defense technology vendors
        </p>
      </div>

      {/* Search + filter toggle */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search vendors, tech, capabilities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button
          variant={showFilters ? 'accent' : 'outline'}
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal className="w-4 h-4 mr-1.5" />
          Filters
          {hasActiveFilters && (
            <span className="ml-1.5 w-4 h-4 rounded-full bg-[var(--storefront-accent)] text-white text-[10px] flex items-center justify-center">
              !
            </span>
          )}
        </Button>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="w-3.5 h-3.5 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Expandable filter panel */}
      {showFilters && (
        <div className="rounded-xl border border-border bg-card p-4 space-y-4">
          {/* Domain filters */}
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
              Capability Domains
            </label>
            <div className="flex flex-wrap gap-2">
              {ALL_DOMAINS.map((domain) => (
                <Button
                  key={domain}
                  variant={selectedDomains.includes(domain) ? 'accent' : 'outline'}
                  size="sm"
                  onClick={() => toggleDomain(domain)}
                  className="text-xs"
                >
                  {DOMAIN_LABELS[domain]}
                </Button>
              ))}
            </div>
          </div>

          {/* Clearance dropdown */}
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
              Clearance Level
            </label>
            <select
              value={selectedClearance}
              onChange={(e) => setSelectedClearance(e.target.value as ClearanceLevel | '')}
              className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="">Any clearance</option>
              {ALL_CLEARANCES.map((cl) => (
                <option key={cl} value={cl}>
                  {CLEARANCE_LABELS[cl]}
                </option>
              ))}
            </select>
          </div>

          {/* Platform checkboxes */}
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
              Platform Registrations
            </label>
            <div className="flex flex-wrap gap-3">
              {ALL_PLATFORMS.map((platform) => (
                <label
                  key={platform}
                  className="flex items-center gap-1.5 text-xs cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    checked={selectedPlatforms.includes(platform)}
                    onChange={() => togglePlatform(platform)}
                    className="rounded border-border accent-[var(--storefront-accent)]"
                  />
                  {PLATFORM_LABELS[platform]}
                </label>
              ))}
            </div>
          </div>

          {/* TRL range */}
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
              TRL Range: {trlRange[0]} &ndash; {trlRange[1]}
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={1}
                max={9}
                value={trlRange[0]}
                onChange={(e) => {
                  const val = Number(e.target.value)
                  setTrlRange([Math.min(val, trlRange[1]), trlRange[1]])
                }}
                className="flex-1 accent-[var(--storefront-accent)]"
              />
              <input
                type="range"
                min={1}
                max={9}
                value={trlRange[1]}
                onChange={(e) => {
                  const val = Number(e.target.value)
                  setTrlRange([trlRange[0], Math.max(val, trlRange[0])])
                }}
                className="flex-1 accent-[var(--storefront-accent)]"
              />
            </div>
          </div>
        </div>
      )}

      {/* Results count */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Building2 className="w-4 h-4" />
        <span>
          <span className="font-medium text-foreground">{filtered.length}</span>{' '}
          {filtered.length === 1 ? 'vendor' : 'vendors'} found
        </span>
      </div>

      {/* Vendor grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((vendor) => (
            <VendorCard
              key={vendor.id}
              vendor={vendor}
              onClick={(v) => setSelectedVendorId(v.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-muted-foreground">
          <Building2 className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm font-medium">No vendors match your filters</p>
          <p className="text-xs mt-1">Try adjusting your search criteria</p>
        </div>
      )}

      {/* Vendor detail sheet */}
      <VendorDetail
        vendor={selectedVendor}
        open={!!selectedVendor}
        onClose={() => setSelectedVendorId(null)}
      />
    </div>
  )
}
