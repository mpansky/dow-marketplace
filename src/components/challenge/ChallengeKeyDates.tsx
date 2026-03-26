import { Calendar, MapPin, Clock, CircleCheck as CheckCircle2 } from 'lucide-react'
import type { ChallengeDate } from '@/types'
import { CHALLENGE_DATE_TYPE_LABELS } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Props {
  keyDates: ChallengeDate[]
  closesAt: string
}

function formatDate(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function getDateStatus(dateStr: string): 'past' | 'upcoming' | 'next' {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const date = new Date(dateStr + 'T00:00:00')
  if (date < today) return 'past'
  return 'upcoming'
}

function getDaysUntil(dateStr: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const date = new Date(dateStr + 'T00:00:00')
  return Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

export function ChallengeKeyDates({ keyDates, closesAt }: Props) {
  if (!keyDates || keyDates.length === 0) return null

  const sorted = [...keyDates].sort(
    (a, b) => new Date(a.dateValue).getTime() - new Date(b.dateValue).getTime()
  )

  const firstUpcoming = sorted.findIndex((d) => getDateStatus(d.dateValue) === 'upcoming')

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Calendar className="h-4 w-4 text-[color:var(--accent)]" />
          Key Dates
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-0">
          {sorted.map((date, idx) => {
            const status = getDateStatus(date.dateValue)
            const isNext = idx === firstUpcoming
            const isDeadline = date.dateType === 'submission_deadline'
            const daysLeft = isDeadline && status === 'upcoming' ? getDaysUntil(date.dateValue) : null

            return (
              <div key={`${date.dateType}-${idx}`} className="relative flex gap-3 pb-4 last:pb-0">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                      status === 'past'
                        ? 'border-green-500 bg-green-50'
                        : isNext
                          ? 'border-[color:var(--accent)] bg-[color:var(--accent)]/10'
                          : 'border-gray-300 bg-white'
                    }`}
                  >
                    {status === 'past' ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                    ) : (
                      <div
                        className={`h-2 w-2 rounded-full ${
                          isNext ? 'bg-[color:var(--accent)]' : 'bg-gray-300'
                        }`}
                      />
                    )}
                  </div>
                  {idx < sorted.length - 1 && (
                    <div className={`w-px flex-1 ${status === 'past' ? 'bg-green-300' : 'bg-gray-200'}`} />
                  )}
                </div>

                <div className="min-w-0 flex-1 pb-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <p
                      className={`text-sm font-medium ${
                        status === 'past'
                          ? 'text-gray-400'
                          : isNext
                            ? 'text-gray-900'
                            : 'text-gray-600'
                      }`}
                    >
                      {CHALLENGE_DATE_TYPE_LABELS[date.dateType]}
                      {date.label && ` - ${date.label}`}
                    </p>
                    <p
                      className={`shrink-0 text-sm tabular-nums ${
                        status === 'past'
                          ? 'text-gray-400 line-through'
                          : isDeadline && daysLeft !== null && daysLeft <= 14
                            ? 'font-semibold text-red-600'
                            : isNext
                              ? 'font-medium text-gray-900'
                              : 'text-gray-500'
                      }`}
                    >
                      {formatDate(date.dateValue)}
                    </p>
                  </div>

                  {daysLeft !== null && daysLeft > 0 && (
                    <span
                      className={`mt-0.5 inline-flex items-center gap-1 text-xs font-medium ${
                        daysLeft <= 14 ? 'text-red-600' : daysLeft <= 30 ? 'text-amber-600' : 'text-gray-500'
                      }`}
                    >
                      <Clock className="h-3 w-3" />
                      {daysLeft} days remaining
                    </span>
                  )}

                  {date.location && (
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
                      <MapPin className="h-3 w-3" />
                      {date.location}
                    </p>
                  )}
                  {date.notes && (
                    <p className="mt-0.5 text-xs text-gray-400 italic">{date.notes}</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
