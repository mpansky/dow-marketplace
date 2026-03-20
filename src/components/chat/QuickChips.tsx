import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

const CHIPS_BY_ROUTE: Record<string, string[]> = {
  '/dashboard': ['Show top matches', 'Pipeline summary', 'AI insights'],
  '/challenges': ['Compare challenges', 'Submission trends', 'Domain analysis'],
  '/vendors': ['Top vendors for cUAS', 'Compare by clearance', 'Platform coverage'],
  '/pipeline': ['Bottleneck analysis', 'Award velocity', 'At-risk entries'],
}

const DEFAULT_CHIPS = ['Overview', 'Top vendors', 'Active challenges']

interface QuickChipsProps {
  onSelect: (text: string) => void
}

export function QuickChips({ onSelect }: QuickChipsProps) {
  const location = useLocation()

  const chips = useMemo(() => {
    const path = location.pathname
    for (const [route, routeChips] of Object.entries(CHIPS_BY_ROUTE)) {
      if (path.startsWith(route)) return routeChips
    }
    return DEFAULT_CHIPS
  }, [location.pathname])

  return (
    <div className="flex flex-wrap gap-1.5 px-3 pb-2">
      {chips.map((chip) => (
        <button
          key={chip}
          onClick={() => onSelect(chip)}
          className="rounded-full border border-border/60 bg-secondary/40 px-3 py-1 text-xs text-muted-foreground transition-all hover:border-[var(--storefront-accent)]/50 hover:bg-[var(--storefront-accent)]/10 hover:text-[var(--storefront-accent)]"
        >
          {chip}
        </button>
      ))}
    </div>
  )
}
