import { useState, useMemo } from 'react'
import { useApp } from '@/context/AppContext'

interface SearchResult {
  type: 'challenge' | 'vendor' | 'pipeline'
  id: string
  title: string
  subtitle: string
  link: string
}

export function useSearch(query: string) {
  const { state } = useApp()

  const results = useMemo<SearchResult[]>(() => {
    if (!query || query.length < 2) return []
    const q = query.toLowerCase()

    const challengeResults: SearchResult[] = state.challenges
      .filter((c) => c.title.toLowerCase().includes(q) || c.problemStatement.toLowerCase().includes(q))
      .slice(0, 5)
      .map((c) => ({
        type: 'challenge' as const,
        id: c.id,
        title: c.title,
        subtitle: `${c.storefrontId.toUpperCase()} · ${c.status.replace(/_/g, ' ')}`,
        link: `/challenges/${c.id}`,
      }))

    const vendorResults: SearchResult[] = state.vendors
      .filter((v) => v.name.toLowerCase().includes(q) || v.tagline.toLowerCase().includes(q))
      .slice(0, 5)
      .map((v) => ({
        type: 'vendor' as const,
        id: v.id,
        title: v.name,
        subtitle: v.tagline,
        link: `/vendors?selected=${v.id}`,
      }))

    const pipelineResults: SearchResult[] = state.pipelineEntries
      .slice(0, 3)
      .filter(() => q.includes('pipeline') || q.includes('award') || q.includes('ot'))
      .map((p) => {
        const challenge = state.challenges.find((c) => c.id === p.challengeId)
        return {
          type: 'pipeline' as const,
          id: p.id,
          title: challenge?.title || p.challengeId,
          subtitle: `${p.stage.replace(/_/g, ' ')} · ${p.daysInStage} days`,
          link: '/pipeline',
        }
      })

    return [...challengeResults, ...vendorResults, ...pipelineResults]
  }, [query, state.challenges, state.vendors, state.pipelineEntries])

  return results
}
