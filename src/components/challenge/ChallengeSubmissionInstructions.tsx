import { Send, ExternalLink, FileText, CircleCheck as CheckCircle2, Paperclip } from 'lucide-react'
import type { Challenge } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Props {
  challenge: Challenge
  role: string
}

export function ChallengeSubmissionInstructions({ challenge, role }: Props) {
  const hasInstructions =
    challenge.submissionPortalUrl ||
    challenge.submissionFormat ||
    challenge.requiredSections ||
    challenge.requiredAttachments ||
    challenge.maxSubmissionsPerVendor

  if (!hasInstructions) return null

  const isOpen = challenge.status === 'submissions_open' || challenge.status === 'published'

  return (
    <Card className={isOpen && role === 'ndc' ? 'ring-1 ring-[color:var(--accent)]/30' : ''}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Send className="h-4 w-4 text-[color:var(--accent)]" />
          How to Submit
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {challenge.submissionFormat && (
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Format Requirements</p>
            <p className="mt-1 text-sm text-gray-700">{challenge.submissionFormat}</p>
          </div>
        )}

        {challenge.maxSubmissionsPerVendor && (
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Submissions Limit</p>
            <p className="mt-1 text-sm text-gray-700">
              Maximum {challenge.maxSubmissionsPerVendor} submission{challenge.maxSubmissionsPerVendor > 1 ? 's' : ''} per vendor
            </p>
          </div>
        )}

        {challenge.requiredSections && challenge.requiredSections.length > 0 && (
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400 mb-2">Required Sections</p>
            <ul className="space-y-1.5">
              {challenge.requiredSections.map((section, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                  <FileText className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-400" />
                  {section}
                </li>
              ))}
            </ul>
          </div>
        )}

        {challenge.requiredAttachments && challenge.requiredAttachments.length > 0 && (
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400 mb-2">Required Attachments</p>
            <ul className="space-y-1.5">
              {challenge.requiredAttachments.map((attachment, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                  <Paperclip className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-400" />
                  {attachment}
                </li>
              ))}
            </ul>
          </div>
        )}

        {challenge.submissionPortalUrl && isOpen && (
          <div className="pt-2 border-t border-gray-100">
            <a href={challenge.submissionPortalUrl} target="_blank" rel="noopener noreferrer">
              <Button
                className="w-full gap-2 bg-[color:var(--accent)] hover:bg-[color:var(--accent)]/90 text-white"
              >
                <ExternalLink className="h-4 w-4" />
                Go to Submission Portal
              </Button>
            </a>
          </div>
        )}

        {!isOpen && (
          <div className="rounded-lg bg-gray-50 p-3 text-center">
            <p className="text-sm text-gray-500">Submissions are currently closed for this challenge.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
