import { useNavigate } from 'react-router-dom'
import { Building2, Target, GitBranch } from 'lucide-react'
import type { Citation } from '@/types'

const iconMap = {
  vendor: Building2,
  challenge: Target,
  pipeline: GitBranch,
} as const

const routeMap = {
  vendor: '/vendors',
  challenge: '/challenges',
  pipeline: '/pipeline',
} as const

interface CitationBadgeProps {
  citation: Citation
}

export function CitationBadge({ citation }: CitationBadgeProps) {
  const navigate = useNavigate()
  const Icon = iconMap[citation.type]

  function handleClick() {
    navigate(`${routeMap[citation.type]}/${citation.id}`)
  }

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium transition-colors hover:bg-[var(--storefront-accent)]/15"
      style={{
        borderColor: 'var(--storefront-accent)',
        color: 'var(--storefront-accent)',
      }}
    >
      <Icon className="h-3 w-3" />
      <span>{citation.label}</span>
    </button>
  )
}
