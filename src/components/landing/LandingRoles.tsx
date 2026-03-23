import { Shield, Building2, Settings, ArrowRight } from 'lucide-react'
import type { UserRole } from '@/types'

const roles = [
  {
    id: 'pae' as UserRole,
    subtitle: 'Government Buyer (PAE)',
    title: 'Program Acquisition Executive',
    description:
      'Publish operational challenges, discover vendors, conduct AI market research, and track OT award pipeline.',
    icon: Shield,
  },
  {
    id: 'ndc' as UserRole,
    subtitle: 'Industry Seller (NDC)',
    title: 'Non-traditional Defense Company',
    description:
      'Discover matched challenges, build capability profiles, submit proposals, and track award pipeline.',
    icon: Building2,
  },
  {
    id: 'admin' as UserRole,
    subtitle: 'Platform Admin',
    title: 'SWP Cadre Operator',
    description:
      'Monitor marketplace health, curate AI matches, track barriers-to-entry, and generate leadership reports.',
    icon: Settings,
  },
]

export function LandingRoles({ onSelectRole }: { onSelectRole: (role: UserRole) => void }) {
  return (
    <section id="roles" className="py-24 px-8">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="text-center landing-reveal">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-8 bg-[var(--storefront-accent)]" />
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--storefront-accent)]">
              Enter the Marketplace
            </span>
            <div className="h-px w-8 bg-[var(--storefront-accent)]" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold">Choose Your Mission</h2>
          <p className="mt-3 text-muted-foreground">
            Select your role to access your personalized marketplace experience.
          </p>
        </div>

        {/* Role cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => onSelectRole(role.id)}
              className="landing-reveal group relative min-h-[280px] w-full rounded-2xl p-8 text-left overflow-hidden transition-all duration-300 hover:-translate-y-2"
              style={{
                background: 'rgba(17, 17, 24, 0.5)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(var(--storefront-accent-rgb), 0.4)'
                e.currentTarget.style.boxShadow = '0 0 40px -10px var(--storefront-accent)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--storefront-accent)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-[var(--storefront-accent)]/10 border border-[var(--storefront-accent)]/20 flex items-center justify-center">
                <role.icon className="w-7 h-7 text-[var(--storefront-accent)]" />
              </div>

              {/* Text */}
              <h3 className="text-lg font-semibold mt-5">{role.subtitle}</h3>
              <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">
                {role.title}
              </p>
              <p className="text-sm text-muted-foreground/80 mt-4 leading-relaxed">
                {role.description}
              </p>

              {/* Enter CTA */}
              <div className="mt-6 flex items-center gap-2 text-sm font-medium text-[var(--storefront-accent)]">
                Enter Marketplace
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </div>

              {/* Background glow on hover */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full bg-[var(--storefront-accent)]/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
