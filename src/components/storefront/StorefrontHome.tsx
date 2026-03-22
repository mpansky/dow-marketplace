import { useApp } from '@/context/AppContext'
import { storefronts } from '@/lib/themes'
import { HeroIndopacom } from './HeroIndopacom'
import { HeroCybercom } from './HeroCybercom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DOMAIN_LABELS, PLATFORM_LABELS, BARRIER_CATEGORY_LABELS } from '@/types'
import type { CapabilityDomain, PlatformSource } from '@/types'
import {
  Target, Building2, GitBranch, TrendingUp, ArrowRight, ArrowUpRight,
  Rocket, Shield, Zap, Clock, Timer, CheckCircle2, AlertTriangle,
  Users, Route, Globe, Sprout,
} from 'lucide-react'
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

  // Barrier metrics
  const resolvedBarriers = state.barriers.filter((b) => b.status === 'resolved' || b.status === 'verified')
  const activeBarriers = state.barriers.filter((b) => b.status !== 'resolved' && b.status !== 'verified')
  const criticalActive = activeBarriers.filter((b) => b.severity === 'critical')
  const resolutionRate = state.barriers.length > 0
    ? Math.round((resolvedBarriers.length / state.barriers.length) * 100)
    : 0

  const stats = [
    { label: 'Active Challenges', value: activeChallenges.length, icon: <Target className="w-4 h-4" /> },
    { label: 'Vendors Matched', value: storefrontVendors.length, icon: <Building2 className="w-4 h-4" /> },
    { label: 'Awards This Quarter', value: awardedChallenges.length, icon: <GitBranch className="w-4 h-4" /> },
    { label: 'Avg Days to OT Award', value: 11, icon: <TrendingUp className="w-4 h-4" /> },
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

        {/* ===== OT Factory — Speed Section ===== */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-16 md:py-24">
          <div className="flex items-center gap-3 mb-8 md:mb-12">
            <div className="w-1 h-8 rounded-full" style={{ backgroundColor: sf.accentColor }} />
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">The OT Factory</h2>
              <p className="text-sm text-muted-foreground mt-1">Speed is the weapon. Dramatic acceleration in acquisition.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
            <div className="glass-card p-6 text-center relative overflow-hidden">
              <div className="absolute top-2 right-3 text-6xl font-bold pointer-events-none select-none" style={{ color: sf.accentColor, opacity: 0.05 }}>
                <Zap className="w-16 h-16" />
              </div>
              <div className="relative">
                <div className="flex items-center justify-center gap-2 mb-2" style={{ color: sf.accentColor }}>
                  <Timer className="w-5 h-5" />
                </div>
                <div className="text-4xl md:text-5xl font-bold font-mono mb-2" style={{ color: sf.accentColor }}>11</div>
                <div className="text-sm font-semibold mb-1">Days to OT Award</div>
                <div className="text-xs text-muted-foreground">Pre-competed solutions via Other Transactions</div>
              </div>
            </div>

            <div className="glass-card p-6 text-center relative overflow-hidden">
              <div className="relative">
                <div className="flex items-center justify-center gap-2 mb-2 text-muted-foreground">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="text-4xl md:text-5xl font-bold font-mono mb-2 text-muted-foreground/50">180+</div>
                <div className="text-sm font-semibold mb-1">Traditional Timeline</div>
                <div className="text-xs text-muted-foreground">Average days in traditional FAR-based acquisition</div>
              </div>
            </div>

            <div className="glass-card p-6 text-center relative overflow-hidden">
              <div className="relative">
                <div className="flex items-center justify-center gap-2 mb-2" style={{ color: sf.accentColor }}>
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div className="text-4xl md:text-5xl font-bold font-mono mb-2" style={{ color: sf.accentColor }}>~94%</div>
                <div className="text-sm font-semibold mb-1">Time Saved</div>
                <div className="text-xs text-muted-foreground">OT Factory vs traditional acquisition pathways</div>
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground/60 mt-6 text-center max-w-2xl mx-auto">
            Challenge-Based Acquisition (ChBA) as the standard — try before you decide, versus inferior written proposals.
            Dedicated Authorizing Officials award in days to pre-competed solutions.
          </p>
        </section>

        {/* Section divider */}
        <div className="section-divider max-w-7xl mx-auto" />

        {/* Priority Capability Domains */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-16 md:py-24">
          <div className="flex items-center gap-3 mb-8 md:mb-12">
            <div className="w-1 h-8 rounded-full" style={{ backgroundColor: sf.accentColor }} />
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">
                {isIndo ? 'Kill Chain Gap Areas' : 'Priority Capability Domains'}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {isIndo
                  ? 'Operational needs and kill chain gaps driving acquisition priorities'
                  : 'Mission-critical technology areas driving acquisition priorities'}
              </p>
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
                <h2 className="text-2xl md:text-3xl font-bold">
                  {isIndo ? 'Active Kill Chain Gaps' : 'Featured Challenges'}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {isIndo
                    ? 'Operational gaps seeking innovative solutions from industry'
                    : 'Active opportunities seeking innovative solutions'}
                </p>
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

        {/* ===== Breaking Barriers Section ===== */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-16 md:py-24">
          <div className="flex items-center justify-between mb-8 md:mb-12">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 rounded-full" style={{ backgroundColor: sf.accentColor }} />
              <div>
                <h2 className="text-2xl md:text-3xl font-bold">Breaking Barriers Team</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Executing the Bureaucratic Kill Chain — destroying barriers blocking industry and startups
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/barriers')}
              className="text-sm font-medium flex items-center gap-1.5 hover:gap-2 transition-all"
              style={{ color: sf.accentColor }}
            >
              View all <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Barrier summary metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 mb-8">
            <div className="glass-card p-4 text-center">
              <div className="text-2xl font-bold font-mono" style={{ color: sf.accentColor }}>{state.barriers.length}</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">Barriers Tracked</div>
            </div>
            <div className="glass-card p-4 text-center">
              <div className="text-2xl font-bold font-mono text-green-400">{resolvedBarriers.length}</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">Barriers Destroyed</div>
            </div>
            <div className="glass-card p-4 text-center">
              <div className="text-2xl font-bold font-mono" style={{ color: sf.accentColor }}>{resolutionRate}%</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">Resolution Rate</div>
            </div>
            <div className="glass-card p-4 text-center">
              <div className="text-2xl font-bold font-mono text-red-400">{criticalActive.length}</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">Critical Active</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Resolved — wins */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span className="text-sm font-semibold text-green-400">Recently Destroyed</span>
              </div>
              <div className="space-y-3">
                {resolvedBarriers.slice(0, 4).map((barrier) => (
                  <div key={barrier.id} className="glass-card p-4 border-green-500/10">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                      <div>
                        <div className="text-sm font-medium">{barrier.title}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-[10px]">
                            {BARRIER_CATEGORY_LABELS[barrier.category]}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground">{barrier.severity}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Active critical — currently attacking */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-semibold text-amber-400">Currently Attacking</span>
              </div>
              <div className="space-y-3">
                {[...criticalActive, ...activeBarriers.filter((b) => b.severity === 'high')].slice(0, 4).map((barrier) => (
                  <div key={barrier.id} className="glass-card p-4 border-amber-500/10">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                      <div>
                        <div className="text-sm font-medium">{barrier.title}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-[10px]">
                            {BARRIER_CATEGORY_LABELS[barrier.category]}
                          </Badge>
                          <Badge variant={barrier.severity === 'critical' ? 'destructive' : 'secondary'} className="text-[10px]">
                            {barrier.severity}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section divider */}
        <div className="section-divider max-w-7xl mx-auto" />

        {/* ===== Embedded Cadre Unit ===== */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-16 md:py-24">
          <div className="glass-card max-w-3xl mx-auto p-8 md:p-10 relative overflow-hidden">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse at 50% 50%, rgba(var(--storefront-accent-rgb), 0.04), transparent 70%)`,
              }}
            />
            <div className="relative flex flex-col md:flex-row items-start gap-6">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                style={{ background: `rgba(var(--storefront-accent-rgb), 0.1)` }}
              >
                <Users className="w-7 h-7" style={{ color: sf.accentColor }} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Embedded Cadre Unit</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {sf.cadreDescription}
                </p>
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground/60">
                  <span className="flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5" style={{ color: sf.accentColor }} />
                    Capability Integration
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5" style={{ color: sf.accentColor }} />
                    Challenge Refinement
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" style={{ color: sf.accentColor }} />
                    Barrier Destruction
                  </span>
                </div>
              </div>
            </div>
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

        {/* Section divider */}
        <div className="section-divider max-w-7xl mx-auto" />

        {/* ===== Strategic Outputs Section ===== */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-16 md:py-24">
          <div className="flex items-center gap-3 mb-8 md:mb-12">
            <div className="w-1 h-8 rounded-full" style={{ backgroundColor: sf.accentColor }} />
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Outputs to Theater Programs</h2>
              <p className="text-sm text-muted-foreground mt-1">What the storefront delivers to Pacific programs</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[
              {
                icon: <Zap className="w-6 h-6" />,
                title: 'Accelerated Capability Delivery',
                description: 'OT awards in days through pre-competed solutions and dedicated Authorizing Officials.',
              },
              {
                icon: <Route className="w-6 h-6" />,
                title: 'Streamlined Acquisition Pathways',
                description: 'Challenge-Based Acquisition replaces inferior written proposals with prove-and-select.',
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: 'Enhanced Theater Integration',
                description: 'Embedded Cadre Unit connects warfighter needs directly to commercial innovation.',
              },
              {
                icon: <Sprout className="w-6 h-6" />,
                title: isIndo ? 'Pacific Innovation Ecosystem Growth' : 'Cyber Innovation Ecosystem Growth',
                description: 'Continuous competition and non-traditional engagement expands the industrial base.',
              },
            ].map((output) => (
              <div key={output.title} className="glass-card p-6 relative overflow-hidden group">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `rgba(var(--storefront-accent-rgb), 0.1)`, color: sf.accentColor }}
                >
                  {output.icon}
                </div>
                <h3 className="text-sm font-semibold mb-2">{output.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{output.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== CTA Footer Section ===== */}
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
                  Unleash Industry. Close Kill Chain Gaps. Deliver at Speed.
                </h2>
                <p className="text-sm text-muted-foreground max-w-lg mx-auto mb-8 leading-relaxed">
                  Challenge-Based Acquisition that puts DoW on a war footing.
                  Radically change procurement to resemble a commercial technology firm.
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
