import { Sparkles, Zap, Shield, Target, BarChart3, Globe } from 'lucide-react'

const features = [
  {
    icon: Sparkles,
    title: 'AI-Powered Matching',
    description:
      'Machine learning algorithms analyze vendor capabilities against challenge requirements, surfacing the highest-fidelity matches in seconds.',
  },
  {
    icon: Zap,
    title: 'Rapid OT Acquisition',
    description:
      'Purpose-built for Other Transaction authority. Go from challenge publication to prototype award in as few as 11 days.',
  },
  {
    icon: Shield,
    title: 'Security-First Design',
    description:
      'End-to-end classification handling, clearance verification, and ITAR compliance built into every workflow.',
  },
  {
    icon: Target,
    title: 'Challenge-Based Discovery',
    description:
      'Warfighters publish operational needs as structured challenges. Vendors discover and self-match against real requirements.',
  },
  {
    icon: BarChart3,
    title: 'Market Intelligence',
    description:
      'Real-time analytics on vendor landscapes, capability gaps, and acquisition pipeline health across all storefronts.',
  },
  {
    icon: Globe,
    title: 'Multi-Storefront Architecture',
    description:
      'Dedicated storefronts for INDOPACOM, CYBERCOM, and more — each with tailored priority domains and theater-specific context.',
  },
]

export function LandingFeatures() {
  return (
    <section id="features" className="py-24 px-8">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="landing-reveal">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-[var(--storefront-accent)]" />
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--storefront-accent)]">
              Why DoW Marketplace
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold">
            Accelerating the Path from Innovation to Impact
          </h2>
          <p className="mt-3 text-muted-foreground max-w-2xl">
            The DoW Marketplace eliminates barriers between commercial technology companies and
            defense acquisition, reducing time-to-award from years to weeks.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="landing-reveal glass-card rounded-xl p-6 transition-all duration-300 group"
            >
              <div className="w-10 h-10 rounded-lg bg-[var(--storefront-accent)]/10 flex items-center justify-center">
                <feature.icon className="w-5 h-5 text-[var(--storefront-accent)]" />
              </div>
              <h3 className="text-sm font-semibold mt-4">{feature.title}</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
