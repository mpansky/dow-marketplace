import { Tags } from 'lucide-react'
import type { ChallengeTag } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Props {
  tags: ChallengeTag[]
}

const TAG_TYPE_COLORS: Record<string, string> = {
  domain: 'bg-blue-50 text-blue-700 border-blue-200',
  technology: 'bg-teal-50 text-teal-700 border-teal-200',
  keyword: 'bg-gray-50 text-gray-700 border-gray-200',
  subcategory: 'bg-amber-50 text-amber-700 border-amber-200',
}

const TAG_TYPE_LABELS: Record<string, string> = {
  domain: 'Domain',
  technology: 'Technology',
  keyword: 'Keyword',
  subcategory: 'Subcategory',
}

export function ChallengeTags({ tags }: Props) {
  if (!tags || tags.length === 0) return null

  const grouped = tags.reduce<Record<string, ChallengeTag[]>>((acc, tag) => {
    if (!acc[tag.tagType]) acc[tag.tagType] = []
    acc[tag.tagType].push(tag)
    return acc
  }, {})

  const order = ['domain', 'technology', 'subcategory', 'keyword']
  const sortedTypes = order.filter((t) => grouped[t])

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Tags className="h-4 w-4 text-[color:var(--accent)]" />
          Tags & Keywords
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedTypes.map((type) => (
            <div key={type}>
              <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-gray-400">
                {TAG_TYPE_LABELS[type]}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {grouped[type].map((tag, idx) => (
                  <Badge
                    key={idx}
                    variant="outline"
                    className={`text-xs ${TAG_TYPE_COLORS[type] || 'bg-gray-50 text-gray-700'}`}
                  >
                    {tag.tagValue}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
