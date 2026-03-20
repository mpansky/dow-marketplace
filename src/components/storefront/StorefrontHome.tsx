import { useApp } from '@/context/AppContext'
import { storefronts } from '@/lib/themes'
import { HeroIndopacom } from './HeroIndopacom'
import { HeroCybercom } from './HeroCybercom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DOMAIN_LABELS } from '@/types'
import type { CapabilityDomain } from '@/types'
import { Target, Building2, GitBranch, TrendingUp, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function StorefrontHome() {
  const { state } = useApp()
  const navigate = useNavigate()
  const sf = storefronts[state.currentStorefront]
  const isIndo = state.currentStorefront === 'indopacom'

  const storefrontChallenges = state.challenges.filter(
    (c) => c.storefrontId === state.currentStorefront
  )
  const activeChallenges = storefrontChallenges.filter(
    (c) => c.status !== 'draft' && c.status !== 'closed'
  )
  const awardedChallenges = storefrontChallenges.filter((c) => c.status === 'awarded')
  const storefrontVendors = state.vendors.filter((v) =>
    v.domains.some((d) => sf.priorityDomains.includes(d))
  )

  const stats = [
    { label: 'Active Challenges', value: activeChallenges.length, icon: <Target className="w-4 h-4" /> },
    { label: 'Vendors Matched', value: storefrontVendors.length, icon: <Building2 className="w-4 h-4" /> },
    { label: 'Awards This Quarter', value: awardedChallenges.length, icon: <GitBranch className="w-4 h-4" /> },
    { label: 'Avg Days to Award', value: 11, icon: <TrendingUp className="w-4 h-4" /> },
  ]

  return (
    <div className="-m-6">
      {/* Hero */}
      {isIndo ? <HeroIndopacom stats={stats} /> : <HeroCybercom stats={stats} />}

      <div className="p-6 space-y-8">
        {/* Priority Domains */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Priority Capability Domains</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {sf.priorityDomains.map((domain: CapabilityDomain, i: number) => (
              <Card
                key={domain}
                className="cursor-pointer hover:border-[var(--storefront-accent)]/50 transition-colors"
                onClick={() => navigate(`/vendors?domain=${domain}`)}
              >
                <CardContent className="p-4">
                  <div className="text-xs text-muted-foreground mb-1">#{i + 1} Priority</div>
                  <div className="font-medium text-sm">{DOMAIN_LABELS[domain]}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {state.vendors.filter((v) => v.domains.includes(domain)).length} vendors
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Featured Challenges */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Featured Challenges</h2>
            <button
              onClick={() => navigate('/challenges')}
              className="text-sm text-[var(--storefront-accent)] flex items-center gap-1 hover:underline"
            >
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {activeChallenges.slice(0, 6).map((challenge) => (
              <Card
                key={challenge.id}
                className="cursor-pointer hover:border-[var(--storefront-accent)]/50 transition-colors"
                onClick={() => navigate(`/challenges/${challenge.id}`)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="accent" className="text-[10px]">
                      {challenge.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground">
                      {challenge.submissionCount} submissions
                    </span>
                  </div>
                  <CardTitle className="text-sm leading-snug">{challenge.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {challenge.domains.map((d) => (
                      <Badge key={d} variant="secondary" className="text-[10px]">
                        {DOMAIN_LABELS[d]}
                      </Badge>
                    ))}
                  </div>
                  <div className="text-xs text-muted-foreground line-clamp-2">
                    {challenge.problemStatement}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Top Matched Vendors */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Top Vendors</h2>
            <button
              onClick={() => navigate('/vendors')}
              className="text-sm text-[var(--storefront-accent)] flex items-center gap-1 hover:underline"
            >
              View directory <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {storefrontVendors.slice(0, 12).map((vendor) => (
              <Card
                key={vendor.id}
                className="cursor-pointer hover:border-[var(--storefront-accent)]/50 transition-colors"
                onClick={() => navigate(`/vendors/${vendor.id}`)}
              >
                <CardContent className="p-3 text-center">
                  <div
                    className="w-10 h-10 rounded-lg mx-auto mb-2 flex items-center justify-center text-xs font-bold"
                    style={{ background: `${sf.accentColor}20`, color: sf.accentColor }}
                  >
                    {vendor.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                  </div>
                  <div className="text-xs font-medium truncate">{vendor.name}</div>
                  <div className="text-[10px] text-muted-foreground truncate">{vendor.tagline}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
