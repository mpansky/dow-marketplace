import type { CompanyProfile } from '@/types/companyProfile'
import { calculateProfileCompleteness } from '@/lib/profileCompleteness'

interface Props {
  profile: CompanyProfile
}

export function ProfileCompletenessBar({ profile }: Props) {
  const { overall, sections } = calculateProfileCompleteness(profile)

  const getColor = (pct: number) => {
    if (pct >= 80) return 'bg-emerald-500'
    if (pct >= 50) return 'bg-amber-500'
    return 'bg-red-500'
  }

  const getDotColor = (score: number, max: number) => {
    if (max === 0) return 'bg-zinc-600'
    const pct = (score / max) * 100
    if (pct >= 100) return 'bg-emerald-500'
    if (pct > 0) return 'bg-amber-500'
    return 'bg-zinc-600'
  }

  return (
    <div className="rounded-lg border border-border bg-card/50 p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Profile Completeness
        </span>
        <span className="text-sm font-bold" style={{ color: 'var(--storefront-accent)' }}>
          {overall}%
        </span>
      </div>
      <div className="h-2 bg-border rounded-full overflow-hidden mb-3">
        <div
          className={`h-full rounded-full transition-all duration-500 ${getColor(overall)}`}
          style={{ width: `${overall}%` }}
        />
      </div>
      <div className="flex flex-wrap gap-3">
        {sections.map((s) => (
          <div key={s.label} className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${getDotColor(s.score, s.maxPoints)}`} />
            <span className="text-[10px] text-muted-foreground">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
