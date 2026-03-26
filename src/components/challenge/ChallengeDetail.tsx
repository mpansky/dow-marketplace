import { useParams } from 'react-router-dom'
import { useApp } from '@/context/AppContext'
import { ChallengeDetailHeader } from './ChallengeDetailHeader'
import { ChallengeOverview } from './ChallengeOverview'
import { ChallengeKeyDates } from './ChallengeKeyDates'
import { ChallengeOpportunityDetails } from './ChallengeOpportunityDetails'
import { ChallengeTechnicalRequirements } from './ChallengeTechnicalRequirements'
import { ChallengeEvaluationCriteria } from './ChallengeEvaluationCriteria'
import { ChallengeSubmissionInstructions } from './ChallengeSubmissionInstructions'
import { ChallengeContacts } from './ChallengeContacts'
import { ChallengeTags } from './ChallengeTags'
import { ChallengeSidebar } from './ChallengeSidebar'

export function ChallengeDetail() {
  const { id } = useParams<{ id: string }>()
  const { state } = useApp()
  const challenge = state.challenges.find((c) => c.id === id)

  if (!challenge) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-gray-500">Challenge not found.</p>
      </div>
    )
  }

  const role = state.currentRole

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <ChallengeDetailHeader challenge={challenge} role={role} />

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <ChallengeOverview challenge={challenge} />

          {challenge.keyDates && challenge.keyDates.length > 0 && (
            <ChallengeKeyDates keyDates={challenge.keyDates} closesAt={challenge.closesAt} />
          )}

          <ChallengeOpportunityDetails challenge={challenge} />

          <ChallengeTechnicalRequirements challenge={challenge} />

          {challenge.evaluationCriteria && challenge.evaluationCriteria.length > 0 && (
            <ChallengeEvaluationCriteria criteria={challenge.evaluationCriteria} />
          )}

          <ChallengeSubmissionInstructions challenge={challenge} role={role} />

          {challenge.contacts && challenge.contacts.length > 0 && (
            <ChallengeContacts contacts={challenge.contacts} />
          )}

          {challenge.tags && challenge.tags.length > 0 && (
            <ChallengeTags tags={challenge.tags} />
          )}
        </div>

        <div className="lg:col-span-1">
          <ChallengeSidebar
            challenge={challenge}
            submissions={state.submissions}
            pipelineEntries={state.pipelineEntries}
            vendors={state.vendors}
          />
        </div>
      </div>
    </div>
  )
}
