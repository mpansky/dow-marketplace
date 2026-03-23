import type { CompanyProfile, CompanyLocation, CompanyContact, ContactType } from '@/types/companyProfile'
import { CONTACT_TYPE_LABELS, US_STATES } from '@/types/companyProfile'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Trash2, MapPin, ShieldAlert } from 'lucide-react'
import { generateId } from '@/lib/utils'

interface Props {
  profile: CompanyProfile
  onChange: (updates: Partial<CompanyProfile>) => void
}

function emptyLocation(companyId: string): CompanyLocation {
  return {
    id: generateId(),
    company_id: companyId,
    label: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
    is_primary: false,
  }
}

function emptyContact(companyId: string, contactType: ContactType): CompanyContact {
  return {
    id: generateId(),
    company_id: companyId,
    contact_type: contactType,
    name: '',
    title: '',
    email: '',
    phone: '',
    linkedin_url: '',
  }
}

const CONTACT_TYPES: ContactType[] = ['primary', 'contracts_bd', 'technical', 'security']

export function ProfileLocationsContacts({ profile, onChange }: Props) {
  const addLocation = () => {
    const loc = emptyLocation(profile.id)
    if (profile.locations.length === 0) loc.is_primary = true
    onChange({ locations: [...profile.locations, loc] })
  }

  const updateLocation = (idx: number, updates: Partial<CompanyLocation>) => {
    const locs = [...profile.locations]
    locs[idx] = { ...locs[idx], ...updates }
    onChange({ locations: locs })
  }

  const removeLocation = (idx: number) => {
    const locs = profile.locations.filter((_, i) => i !== idx)
    if (locs.length > 0 && !locs.some((l) => l.is_primary)) locs[0].is_primary = true
    onChange({ locations: locs })
  }

  const setPrimary = (idx: number) => {
    onChange({
      locations: profile.locations.map((l, i) => ({ ...l, is_primary: i === idx })),
    })
  }

  const getContact = (type: ContactType) =>
    profile.contacts.find((c) => c.contact_type === type) ?? emptyContact(profile.id, type)

  const updateContact = (type: ContactType, updates: Partial<CompanyContact>) => {
    const existing = profile.contacts.find((c) => c.contact_type === type)
    if (existing) {
      onChange({
        contacts: profile.contacts.map((c) =>
          c.contact_type === type ? { ...c, ...updates } : c
        ),
      })
    } else {
      onChange({
        contacts: [...profile.contacts, { ...emptyContact(profile.id, type), ...updates }],
      })
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold">Locations</h3>
          </div>
          <Button variant="outline" size="sm" onClick={addLocation}>
            <Plus className="w-3.5 h-3.5 mr-1" /> Add Location
          </Button>
        </div>

        {profile.locations.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-border rounded-lg">
            <MapPin className="w-6 h-6 mx-auto mb-2 text-muted-foreground/40" />
            <p className="text-xs text-muted-foreground">No locations added yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {profile.locations.map((loc, idx) => (
              <Card key={loc.id} className={loc.is_primary ? 'border-[var(--storefront-accent)]/40' : ''}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Input
                        value={loc.label}
                        onChange={(e) => updateLocation(idx, { label: e.target.value })}
                        placeholder="Label (e.g., HQ, DC Office)"
                        className="h-7 text-xs w-40"
                      />
                      {loc.is_primary ? (
                        <span className="text-[10px] font-medium text-[var(--storefront-accent)]">Primary</span>
                      ) : (
                        <button
                          onClick={() => setPrimary(idx)}
                          className="text-[10px] text-muted-foreground hover:text-foreground"
                        >
                          Set primary
                        </button>
                      )}
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeLocation(idx)} className="h-7 w-7 p-0 text-muted-foreground hover:text-red-400">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="md:col-span-2">
                      <Input
                        value={loc.address_line_1}
                        onChange={(e) => updateLocation(idx, { address_line_1: e.target.value })}
                        placeholder="Address Line 1"
                        className="text-xs"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Input
                        value={loc.address_line_2}
                        onChange={(e) => updateLocation(idx, { address_line_2: e.target.value })}
                        placeholder="Address Line 2"
                        className="text-xs"
                      />
                    </div>
                    <Input
                      value={loc.city}
                      onChange={(e) => updateLocation(idx, { city: e.target.value })}
                      placeholder="City"
                      className="text-xs"
                    />
                    <div className="flex gap-2">
                      <select
                        value={loc.state}
                        onChange={(e) => updateLocation(idx, { state: e.target.value })}
                        className="flex h-9 w-20 rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      >
                        <option value="">ST</option>
                        {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <Input
                        value={loc.zip}
                        onChange={(e) => updateLocation(idx, { zip: e.target.value })}
                        placeholder="ZIP"
                        className="text-xs flex-1"
                        maxLength={10}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center gap-2 mb-4">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-semibold">Points of Contact</h3>
          <span className="text-[10px] text-amber-400 border border-amber-400/30 rounded px-1.5 py-0.5">
            Visible to PAEs and Admins only
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CONTACT_TYPES.map((type) => {
            const contact = getContact(type)
            return (
              <Card key={type}>
                <CardContent className="p-4">
                  <h4 className="text-xs font-semibold mb-3 text-[var(--storefront-accent)]">
                    {CONTACT_TYPE_LABELS[type]}
                  </h4>
                  <div className="space-y-2">
                    <Input
                      value={contact.name}
                      onChange={(e) => updateContact(type, { name: e.target.value })}
                      placeholder="Full name"
                      className="text-xs"
                    />
                    <Input
                      value={contact.title}
                      onChange={(e) => updateContact(type, { title: e.target.value })}
                      placeholder="Job title"
                      className="text-xs"
                    />
                    <Input
                      value={contact.email}
                      onChange={(e) => updateContact(type, { email: e.target.value })}
                      placeholder="Email"
                      className="text-xs"
                    />
                    <Input
                      value={contact.phone}
                      onChange={(e) => updateContact(type, { phone: e.target.value })}
                      placeholder="Phone"
                      className="text-xs"
                    />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
