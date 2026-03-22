import { useApp } from '@/context/AppContext'
import { storefronts } from '@/lib/themes'
import { HeroIndopacom } from './HeroIndopacom'
import { HeroCybercom } from './HeroCybercom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DOMAIN_LABELS, PLATFORM_LABELS } from '@/types'
import type { CapabilityDomain, PlatformSource } from '@/types'
import { Target, Building2, GitBranch, TrendingUp, ArrowRight, ArrowUpRight, Rocket, Shield } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const PLATFORMS: PlatformSource[] = ['vulcan', 'tradewinds', 'lynx', 'eris', 'ot_consortia']

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
    <div>
      {/* Hero */}
      {isIndo ? <HeroIndopacom stats={stats} /> : <HeroCybercom stats={stats} />}

      {/* ===== Content Sections ===== */}
      <div className="bg-[#0a0a0f]">

        {/* Trusted Platforms Band */}
        <section className="border-y border-white/[0.04] bg-white/[0.01]">
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-6 md:py-8">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium whitespace-nowrap">
                Integrated Platforms
              </span>
              <div className="section-divider w-px h-4 hidden sm:block" style={{ width: '1px', background: 'rgba(var(--storefront-accent-rgb), 0.2)' }} />
              <div className="flex flex-wrap justify-center sm:justify-start gap-x-8 gap-y-2">
                {PLATFORMS.map((p) => (
                  <span
                    key={p}
                    className="text-xs font-semibold tracking-wider text-muted-foreground/50 uppercase hover:text-muted-foreground transition-colors cursor-default"
                  >
                    {PLATFORM_LABELS[p]}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Priority Capability Domains */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-16 md:py-24">
          <div className="flex items-center gap-3 mb-8 md:mb-12">
            <div className="w-1 h-8 rounded-full" style={{ backgroundColor: sf.accentColor }} />
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Priority Capability Domains</h2>
              <p className="text-sm text-muted-foreground mt-1">Mission-critical technology areas driving acquisition priorities</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {sf.priorityDomains.map((domain: CapabilityDomain, i: number) => {
              const vendorCount = state.vendors.filter((v) => v.domains.includes(domain)).length
              return (
                <div
                  key={domain}
                  className="glass-card group relative cursor-pointer p-6 overflow-hidden hover:-translate-y-1"
                  onClick={() => navigate(`/vendors?domain=${domain}`)}
                >
                  {/* Rank number — faded background */}
                  <span
                    className="absolute -top-2 -right-1 text-7xl font-bold leading-none pointer-events-none select-none"
                    style={{ color: sf.accentColor, opacity: 0.06 }}
                  >
                    0{i + 1}
                  </span>

                  <div className="relative">
                    <div className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-3 font-medium">
                      #{i + 1} Priority
                    </div>
                    <div className="text-base font-semibold mb-2">{DOMAIN_LABELS[domain]}</div>
                    <div className="text-xs text-muted-foreground">
                      {vendorCount} qualified vendors
                    </div>
                    <ArrowUpRight
                      className="absolute top-0 right-0 w-4 h-4 text-muted-foreground/0 group-hover:text-muted-foreground transition-all"
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Section divider */}
        <div className="section-divider max-w-7xl mx-auto" />

        {/* Featured Challenges */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-16 md:py-24">
          <div className="flex items-center justify-between mb-8 md:mb-12">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 rounded-full" style={{ backgroundColor: sf.accentColor }} />
              <div>
                <h2 className="text-2xl md:text-3xl font-bold">Featured Challenges</h2>
                <p className="text-sm text-muted-foreground mt-1">Active opportunities seeking innovative solutions</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/challenges')}
              className="text-sm font-medium flex items-center gap-1.5 hover:gap-2 transition-all"
              style={{ color: sf.accentColor }}
            >
              View all <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {activeChallenges.slice(0, 6).map((challenge) => (
              <div
                key={challenge.id}
                className="glass-card group cursor-pointer p-5 hover:-translate-y-1"
                onClick={() => navigate(`/challenges/${challenge.id}`)}
              >
                {/* Header: status + submissions */}
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="accent" className="text-[10px]">
                    {challenge.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground">
                    {challenge.submissionCount} submissions
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-semibold leading-snug mb-3 group-hover:text-white transition-colors">
                  {challenge.title}
                </h3>

                {/* Domain badges */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {challenge.domains.map((d) => (
                    <Badge key={d} variant="secondary" className="text-[10px]">
                      {DOMAIN_LABELS[d]}
                    </Badge>
                  ))}
                </div>

                {/* Problem statement */}
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  {challenge.problemStatement}
                </p>

                {/* Bottom accent line */}
                <div
                  className="mt-4 h-px opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: `linear-gradient(90deg, ${sf.accentColor}, transparent)` }}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Section divider */}
        <div className="section-divider max-w-7xl mx-auto" />

        {/* Top Vendors */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-16 md:py-24">
          <div className="flex items-center justify-between mb-8 md:mb-12">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 rounded-full" style={{ backgroundColor: sf.accentColor }} />
              <div>
                <h2 className="text-2xl md:text-3xl font-bold">Top Vendors</h2>
                <p className="text-sm text-muted-foreground mt-1">Vetted technology providers matched to mission needs</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/vendors')}
              className="text-sm font-medium flex items-center gap-1.5 hover:gap-2 transition-all"
              style={{ color: sf.accentColor }}
            >
              View directory <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-4">
            {storefrontVendors.slice(0, 12).map((vendor) => (
              <div
                key={vendor.id}
                className="glass-card group cursor-pointer p-4 text-center hover:-translate-y-1"
                onClick={() => navigate(`/vendors/${vendor.id}`)}
              >
                <div
                  className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center text-sm font-bold"
                  style={{ background: `${sf.accentColor}15`, color: sf.accentColor }}
                >
                  {vendor.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                </div>
                <div className="text-xs font-medium truncate mb-0.5">{vendor.name}</div>
                <div className="text-[10px] text-muted-foreground truncate">{vendor.tagline}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Footer Section */}
        <section className="border-t border-white/[0.04]">
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-20 md:py-28">
            <div className="glass-card max-w-3xl mx-auto text-center p-8 md:p-12 relative overflow-hidden">
              {/* Background glow */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse at 50% 50%, rgba(var(--storefront-accent-rgb), 0.06), transparent 70%)`,
                }}
              />

              <div className="relative">
                <div className="flex justify-center mb-4">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{ background: `rgba(var(--storefront-accent-rgb), 0.1)` }}
                  >
                    <Rocket className="w-6 h-6" style={{ color: sf.accentColor }} />
                  </div>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold mb-3">
                  Ready to Innovate for the Warfighter?
                </h2>
                <p className="text-sm text-muted-foreground max-w-lg mx-auto mb-8 leading-relaxed">
                  Whether you're defining the next capability gap or bringing a breakthrough solution,
                  the DoW Marketplace connects you to mission impact.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-3">
                  <Button
                    size="lg"
                    className="text-sm font-semibold px-6"
                    style={{ backgroundColor: sf.accentColor, color: isIndo ? 'white' : 'black' }}
                    onClick={() => navigate('/challenges')}
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Submit a Challenge
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-sm font-semibold px-6 border-white/15 bg-white/5 hover:bg-white/10"
                    onClick={() => navigate('/vendors')}
                  >
                    <Building2 className="w-4 h-4 mr-2" />
                    Register as a Vendor
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
