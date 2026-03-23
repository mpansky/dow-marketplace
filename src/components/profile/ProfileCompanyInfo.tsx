import { useRef } from 'react'
import type { CompanyProfile, RevenueRange, OrgStructure } from '@/types/companyProfile'
import { REVENUE_RANGE_LABELS, ORG_STRUCTURE_LABELS, FUNDING_STAGE_LABELS, US_STATES } from '@/types/companyProfile'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Upload, X } from 'lucide-react'
import { uploadLogo } from '@/services/companyProfile'

interface Props {
  profile: CompanyProfile
  onChange: (updates: Partial<CompanyProfile>) => void
}

export function ProfileCompanyInfo({ profile, onChange }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !profile.id) return
    try {
      const url = await uploadLogo(profile.id, file)
      onChange({ logo_url: url })
    } catch {
      // silently fail
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <Label className="text-xs text-muted-foreground mb-1.5 block">Company Logo</Label>
          <div className="flex items-center gap-4">
            {profile.logo_url ? (
              <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-border">
                <img src={profile.logo_url} alt="Logo" className="w-full h-full object-cover" />
                <button
                  onClick={() => onChange({ logo_url: '' })}
                  className="absolute top-0 right-0 p-0.5 bg-black/60 rounded-bl"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              </div>
            ) : (
              <div
                className="w-16 h-16 rounded-lg border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-[var(--storefront-accent)]/50 transition-colors"
                onClick={() => fileRef.current?.click()}
              >
                <Upload className="w-5 h-5 text-muted-foreground" />
              </div>
            )}
            <div>
              <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
                {profile.logo_url ? 'Change' : 'Upload'}
              </Button>
              <p className="text-[10px] text-muted-foreground mt-1">PNG, JPG, or SVG. Max 2MB.</p>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/svg+xml"
              className="hidden"
              onChange={handleLogoUpload}
            />
          </div>
        </div>

        <div>
          <Label className="text-xs text-muted-foreground mb-1.5 block">Display Name *</Label>
          <Input
            value={profile.name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="Company display name"
          />
        </div>

        <div>
          <Label className="text-xs text-muted-foreground mb-1.5 block">Legal Name</Label>
          <Input
            value={profile.legal_name}
            onChange={(e) => onChange({ legal_name: e.target.value })}
            placeholder="Legal registered name"
          />
        </div>

        <div>
          <Label className="text-xs text-muted-foreground mb-1.5 block">DBA / Trade Name</Label>
          <Input
            value={profile.dba_name}
            onChange={(e) => onChange({ dba_name: e.target.value })}
            placeholder="Doing business as"
          />
        </div>

        <div>
          <Label className="text-xs text-muted-foreground mb-1.5 block">Website</Label>
          <Input
            value={profile.website}
            onChange={(e) => onChange({ website: e.target.value })}
            placeholder="https://www.example.com"
          />
        </div>

        <div>
          <Label className="text-xs text-muted-foreground mb-1.5 block">Primary Phone</Label>
          <Input
            value={profile.phone_primary}
            onChange={(e) => onChange({ phone_primary: e.target.value })}
            placeholder="(555) 123-4567"
          />
        </div>

        <div>
          <Label className="text-xs text-muted-foreground mb-1.5 block">Secondary Phone</Label>
          <Input
            value={profile.phone_secondary}
            onChange={(e) => onChange({ phone_secondary: e.target.value })}
            placeholder="(555) 987-6543"
          />
        </div>

        <div>
          <Label className="text-xs text-muted-foreground mb-1.5 block">General Email</Label>
          <Input
            value={profile.email}
            onChange={(e) => onChange({ email: e.target.value })}
            placeholder="info@company.com"
          />
        </div>

        <div>
          <Label className="text-xs text-muted-foreground mb-1.5 block">Founding Year</Label>
          <Input
            type="number"
            value={profile.founding_year ?? ''}
            onChange={(e) => onChange({ founding_year: e.target.value ? Number(e.target.value) : null })}
            placeholder="2020"
            min={1900}
            max={2030}
          />
        </div>

        <div>
          <Label className="text-xs text-muted-foreground mb-1.5 block">Employee Count</Label>
          <Input
            type="number"
            value={profile.employee_count || ''}
            onChange={(e) => onChange({ employee_count: Number(e.target.value) || 0 })}
            placeholder="100"
            min={0}
          />
        </div>

        <div>
          <Label className="text-xs text-muted-foreground mb-1.5 block">Annual Revenue Range</Label>
          <select
            value={profile.annual_revenue_range}
            onChange={(e) => onChange({ annual_revenue_range: e.target.value as RevenueRange })}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            {Object.entries(REVENUE_RANGE_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>

        <div>
          <Label className="text-xs text-muted-foreground mb-1.5 block">Organizational Structure</Label>
          <select
            value={profile.org_structure}
            onChange={(e) => onChange({ org_structure: e.target.value as OrgStructure })}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            {Object.entries(ORG_STRUCTURE_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>

        <div>
          <Label className="text-xs text-muted-foreground mb-1.5 block">State of Incorporation</Label>
          <select
            value={profile.state_of_incorporation}
            onChange={(e) => onChange({ state_of_incorporation: e.target.value })}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="">Select state</option>
            {US_STATES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <Label className="text-xs text-muted-foreground mb-1.5 block">Parent Company</Label>
          <Input
            value={profile.parent_company}
            onChange={(e) => onChange({ parent_company: e.target.value })}
            placeholder="Leave blank if independent"
          />
        </div>

        <div>
          <Label className="text-xs text-muted-foreground mb-1.5 block">Funding Stage</Label>
          <select
            value={profile.funding_stage}
            onChange={(e) => onChange({ funding_stage: e.target.value })}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="">Select stage</option>
            {Object.entries(FUNDING_STAGE_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <Label className="text-xs text-muted-foreground mb-1.5 block">Tagline</Label>
        <Input
          value={profile.tagline}
          onChange={(e) => onChange({ tagline: e.target.value })}
          placeholder="A brief marketing tagline for your company"
          maxLength={120}
        />
        <p className="text-[10px] text-muted-foreground mt-1">{profile.tagline.length}/120</p>
      </div>

      <div>
        <Label className="text-xs text-muted-foreground mb-1.5 block">Company Description</Label>
        <Textarea
          value={profile.description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="Full company description for your profile page"
          rows={4}
        />
      </div>
    </div>
  )
}
