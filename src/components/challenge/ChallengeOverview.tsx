import { useState } from 'react'
import { ChevronDown, ChevronRight, Target, BookOpen, Crosshair, Package, SquareCheck as CheckSquare } from 'lucide-react'
import type { Challenge } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Props {
  challenge: Challenge
}

function Section({
  icon: Icon,
  title,
  content,
  defaultOpen = false,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  content?: string
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)

  if (!content) return null

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2 py-3 text-left hover:bg-gray-50/50 transition-colors"
      >
        <Icon className="h-4 w-4 shrink-0 text-[color:var(--accent)]" />
        <span className="flex-1 text-sm font-medium text-gray-900">{title}</span>
        {open ? (
          <ChevronDown className="h-4 w-4 text-gray-400" />
        ) : (
          <ChevronRight className="h-4 w-4 text-gray-400" />
        )}
      </button>
      {open && (
        <div className="pb-3 pl-6">
          <p className="text-sm leading-relaxed text-gray-600 whitespace-pre-wrap">{content}</p>
        </div>
      )}
    </div>
  )
}

export function ChallengeOverview({ challenge }: Props) {
  const hasExtendedContent = challenge.background || challenge.objective || challenge.deliverables || challenge.successCriteria

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-0">
          <div className="pb-3">
            <p className="text-sm font-medium text-gray-900 mb-1.5">Problem Statement</p>
            <p className="text-sm leading-relaxed text-gray-600">{challenge.problemStatement}</p>
          </div>

          {hasExtendedContent && (
            <div className="border-t border-gray-100 pt-1">
              <Section
                icon={BookOpen}
                title="Background & Context"
                content={challenge.background}
              />
              <Section
                icon={Target}
                title="Objective"
                content={challenge.objective}
              />
              <Section
                icon={Crosshair}
                title="Scope & Deliverables"
                content={challenge.deliverables}
              />
              <Section
                icon={Package}
                title="Success Criteria"
                content={challenge.successCriteria}
                defaultOpen
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
