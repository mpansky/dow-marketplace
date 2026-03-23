import { useState } from 'react'
import type { CompanyProfile, SAMStatus, CompanyNAICSCode } from '@/types/companyProfile'
import { SAM_STATUS_LABELS, COMMON_NAICS_CODES } from '@/types/companyProfile'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { X, Search, Star } from 'lucide-react'
import { generateId } from '@/lib/utils'

interface Props {
  profile: CompanyProfile
  onChange: (updates: Partial<CompanyProfile>) => void
}

export function ProfileGovIds({ profile, onChange }: Props) {
  const [naicsSearch, setNaicsSearch] = useState('')

  const cageValid = !profile.cage_code || /^[A-Z0-9]{5}$/i.test(profile.cage_code)
  const ueiValid = !profile.uei || /^[A-Z0-9]{12}$/i.test(profile.uei)

  const filteredNaics = naicsSearch
    ? COMMON_NAICS_CODES.filter(
        (n) =>
          n.code.includes(naicsSearch) ||
          n.description.toLowerCase().includes(naicsSearch.toLowerCase())
      )
    : COMMON_NAICS_CODES

  const addNaics = (code: string, description: string) => {
    if (profile.naics_codes.some((n) => n.naics_code === code)) return
    const newCode: CompanyNAICSCode = {
      id: generateId(),
      company_id: profile.id,
      naics_code: code,
      naics_description: description,
      is_primary: profile.naics_codes.length === 0,
    }
    onChange({ naics_codes: [...profile.naics_codes, newCode] })
  }

  const removeNaics = (code: string) => {
    const updated = profile.naics_codes.filter((n) => n.naics_code !== code)
    if (updated.length > 0 && !updated.some((n) => n.is_primary)) {
      updated[0].is_primary = true
    }
    onChange({ naics_codes: updated })
  }

  const setPrimaryNaics = (code: string) => {
    onChange({
      naics_codes: profile.naics_codes.map((n) => ({
        ...n,
        is_primary: n.naics_code === code,
      })),
    })
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label className="text-xs text-muted-foreground mb-1.5 block">CAGE Code</Label>
          <Input
            value={profile.cage_code}
            onChange={(e) => onChange({ cage_code: e.target.value.toUpperCase().slice(0, 5) })}
            placeholder="5-char alphanumeric (e.g., 3A4B2)"
            maxLength={5}
            className={!cageValid ? 'border-red-500' : ''}
          />
          {!cageValid && (
            <p className="text-[10px] text-red-400 mt-1">Must be exactly 5 alphanumeric characters</p>
          )}
        </div>

        <div>
          <Label className="text-xs text-muted-foreground mb-1.5 block">Unique Entity ID (UEI)</Label>
          <Input
            value={profile.uei}
            onChange={(e) => onChange({ uei: e.target.value.toUpperCase().slice(0, 12) })}
            placeholder="12-char SAM.gov UEI"
            maxLength={12}
            className={!ueiValid ? 'border-red-500' : ''}
          />
          {!ueiValid && (
            <p className="text-[10px] text-red-400 mt-1">Must be exactly 12 alphanumeric characters</p>
          )}
        </div>

        <div>
          <Label className="text-xs text-muted-foreground mb-1.5 block">
            DUNS Number <span className="text-muted-foreground/60">(Legacy)</span>
          </Label>
          <Input
            value={profile.duns_number}
            onChange={(e) => onChange({ duns_number: e.target.value.replace(/\D/g, '').slice(0, 9) })}
            placeholder="9-digit DUNS (optional)"
            maxLength={9}
          />
        </div>

        <div>
          <Label className="text-xs text-muted-foreground mb-1.5 block">SAM.gov Status</Label>
          <select
            value={profile.sam_status}
            onChange={(e) => onChange({ sam_status: e.target.value as SAMStatus })}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            {Object.entries(SAM_STATUS_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>

        {profile.sam_status === 'active' && (
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">SAM Expiration Date</Label>
            <Input
              type="date"
              value={profile.sam_expiration_date ?? ''}
              onChange={(e) => onChange({ sam_expiration_date: e.target.value || null })}
            />
          </div>
        )}
      </div>

      <div>
        <Label className="text-xs text-muted-foreground mb-1.5 block">NAICS Codes</Label>

        {profile.naics_codes.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {profile.naics_codes.map((n) => (
              <Badge
                key={n.naics_code}
                variant="secondary"
                className="text-xs gap-1.5 pl-2 pr-1 py-1"
              >
                {n.is_primary && <Star className="w-3 h-3 text-amber-400 fill-amber-400" />}
                <span
                  className="cursor-pointer"
                  onClick={() => setPrimaryNaics(n.naics_code)}
                  title="Click to set as primary"
                >
                  {n.naics_code} - {n.naics_description}
                </span>
                <button
                  onClick={() => removeNaics(n.naics_code)}
                  className="ml-1 hover:text-red-400 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        <div className="relative mb-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            value={naicsSearch}
            onChange={(e) => setNaicsSearch(e.target.value)}
            placeholder="Search NAICS codes..."
            className="pl-8"
          />
        </div>

        <div className="max-h-48 overflow-y-auto rounded-md border border-border">
          {filteredNaics.map((n) => {
            const selected = profile.naics_codes.some((nc) => nc.naics_code === n.code)
            return (
              <Button
                key={n.code}
                variant="ghost"
                size="sm"
                className={`w-full justify-start text-xs rounded-none border-b border-border/50 last:border-0 ${
                  selected ? 'bg-[var(--storefront-accent)]/10 text-[var(--storefront-accent)]' : ''
                }`}
                onClick={() => (selected ? removeNaics(n.code) : addNaics(n.code, n.description))}
              >
                <span className="font-mono mr-2">{n.code}</span>
                <span className="truncate">{n.description}</span>
              </Button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
