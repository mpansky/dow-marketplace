import { Shield, Building2, Settings } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import type { UserRole } from '@/types'

const roles: { id: UserRole; title: string; subtitle: string; description: string; icon: React.ReactNode }[] = [
  {
    id: 'pae',
    title: 'Program Acquisition Executive',
    subtitle: 'Government Buyer (PAE)',
    description: 'Publish operational challenges, discover vendors, conduct AI market research, and track OT award pipeline.',
    icon: <Shield className="w-8 h-8" />,
  },
  {
    id: 'ndc',
    title: 'Non-traditional Defense Company',
    subtitle: 'Industry Seller (NDC)',
    description: 'Discover matched challenges, build capability profiles, submit proposals, and track award pipeline.',
    icon: <Building2 className="w-8 h-8" />,
  },
  {
    id: 'admin',
    title: 'SWP Cadre Operator',
    subtitle: 'Platform Admin',
    description: 'Monitor marketplace health, curate AI matches, track barriers-to-entry, and generate leadership reports.',
    icon: <Settings className="w-8 h-8" />,
  },
]

export function RoleSelector() {
  const { dispatch } = useApp()

  function selectRole(role: UserRole) {
    dispatch({ type: 'SET_ROLE', payload: role })
    dispatch({ type: 'SET_AUTHENTICATED', payload: true })
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center font-bold text-lg">
            DW
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-2">DoW Marketplace</h1>
        <p className="text-muted-foreground text-lg max-w-xl">
          The single front door connecting American innovation to warfighter needs
        </p>
        <div className="mt-4 flex items-center justify-center gap-2">
          <div className="h-px w-12 bg-border" />
          <span className="text-xs text-muted-foreground uppercase tracking-widest">Select Your Role</span>
          <div className="h-px w-12 bg-border" />
        </div>
      </div>

      {/* Role Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
        {roles.map((role) => (
          <button
            key={role.id}
            onClick={() => selectRole(role.id)}
            className="group relative bg-card border border-border rounded-xl p-6 text-left transition-all duration-200 hover:border-[var(--storefront-accent)] hover:shadow-lg hover:shadow-[var(--storefront-accent)]/5 hover:-translate-y-1"
          >
            <div className="mb-4 text-muted-foreground group-hover:text-[var(--storefront-accent)] transition-colors">
              {role.icon}
            </div>
            <h3 className="font-semibold mb-1">{role.subtitle}</h3>
            <p className="text-xs text-muted-foreground mb-3">{role.title}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{role.description}</p>
            <div className="mt-4 text-xs font-medium text-[var(--storefront-accent)] opacity-0 group-hover:opacity-100 transition-opacity">
              Enter Marketplace →
            </div>
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-12 text-center">
        <p className="text-xs text-muted-foreground">
          UNCLASSIFIED · ATS Initiative 1.7 · SWP Cadre OTA · Prototype v1.0
        </p>
      </div>
    </div>
  )
}
