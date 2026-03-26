import { CircleUser as UserCircle, Mail, Phone } from 'lucide-react'
import type { ChallengeContact } from '@/types'
import { CHALLENGE_CONTACT_ROLE_LABELS } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Props {
  contacts: ChallengeContact[]
}

export function ChallengeContacts({ contacts }: Props) {
  if (!contacts || contacts.length === 0) return null

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <UserCircle className="h-4 w-4 text-[color:var(--accent)]" />
          Points of Contact
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {contacts.map((contact, idx) => (
            <div key={idx} className="rounded-lg border border-gray-100 p-3">
              <p className="text-xs font-medium uppercase tracking-wide text-[color:var(--accent)]">
                {CHALLENGE_CONTACT_ROLE_LABELS[contact.role]}
              </p>
              <p className="mt-1 text-sm font-semibold text-gray-900">{contact.name}</p>
              <p className="text-xs text-gray-500">
                {contact.title} &middot; {contact.organization}
              </p>
              <div className="mt-2 flex flex-wrap gap-3">
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-1.5 text-xs text-[color:var(--accent)] hover:underline"
                >
                  <Mail className="h-3 w-3" />
                  {contact.email}
                </a>
                {contact.phone && (
                  <a
                    href={`tel:${contact.phone}`}
                    className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700"
                  >
                    <Phone className="h-3 w-3" />
                    {contact.phone}
                  </a>
                )}
              </div>
              {contact.notes && (
                <p className="mt-1.5 text-xs text-gray-400 italic">{contact.notes}</p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
