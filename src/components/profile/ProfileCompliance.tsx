import type { CompanyProfile, CompanyCompliance, FedRAMPLevel } from '@/types/companyProfile'
import { FEDRAMP_LABELS, FACILITY_CLEARANCE_LABELS } from '@/types/companyProfile'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Props {
  profile: CompanyProfile
  onChange: (updates: Partial<CompanyProfile>) => void
}

function getEmptyCompliance(companyId: string): CompanyCompliance {
  return {
    id: '',
    company_id: companyId,
    fedramp_level: 'none',
    il_level: null,
    cmmc_level: null,
    cmmc_certification_date: null,
    nist_800_171_score: null,
    cato: false,
    iso_9001: false,
    iso_27001: false,
    iso_20243: false,
    soc2_type1: false,
    soc2_type2: false,
    itar_registered: false,
    ear_compliant: false,
  }
}

export function ProfileCompliance({ profile, onChange }: Props) {
  const c = profile.compliance ?? getEmptyCompliance(profile.id)

  const update = (updates: Partial<CompanyCompliance>) => {
    onChange({ compliance: { ...c, ...updates } })
  }

  const BoolField = ({ label, field }: { label: string; field: keyof CompanyCompliance }) => (
    <label className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${
      c[field] ? 'border-[var(--storefront-accent)]/50 bg-[var(--storefront-accent)]/5' : 'border-border hover:border-border/80'
    }`}>
      <input
        type="checkbox"
        checked={!!c[field]}
        onChange={(e) => update({ [field]: e.target.checked } as Partial<CompanyCompliance>)}
        className="rounded border-border accent-[var(--storefront-accent)]"
      />
      <span className="text-sm">{label}</span>
    </label>
  )

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label className="text-xs text-muted-foreground mb-1.5 block">FedRAMP Authorization Level</Label>
          <select
            value={c.fedramp_level}
            onChange={(e) => update({ fedramp_level: e.target.value as FedRAMPLevel })}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            {Object.entries(FEDRAMP_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>

        <div>
          <Label className="text-xs text-muted-foreground mb-1.5 block">Impact Level (IL)</Label>
          <select
            value={c.il_level ?? ''}
            onChange={(e) => update({ il_level: e.target.value ? Number(e.target.value) : null })}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="">None</option>
            <option value="2">IL-2</option>
            <option value="4">IL-4</option>
            <option value="5">IL-5</option>
            <option value="6">IL-6</option>
          </select>
        </div>

        <div>
          <Label className="text-xs text-muted-foreground mb-1.5 block">CMMC Level</Label>
          <select
            value={c.cmmc_level ?? ''}
            onChange={(e) => update({ cmmc_level: e.target.value ? Number(e.target.value) : null })}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="">None</option>
            <option value="1">Level 1</option>
            <option value="2">Level 2</option>
            <option value="3">Level 3</option>
          </select>
        </div>

        {c.cmmc_level && (
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">CMMC Certification Date</Label>
            <Input
              type="date"
              value={c.cmmc_certification_date ?? ''}
              onChange={(e) => update({ cmmc_certification_date: e.target.value || null })}
            />
          </div>
        )}

        <div>
          <Label className="text-xs text-muted-foreground mb-1.5 block">NIST 800-171 Self-Assessment Score</Label>
          <Input
            type="number"
            value={c.nist_800_171_score ?? ''}
            onChange={(e) => update({ nist_800_171_score: e.target.value ? Number(e.target.value) : null })}
            placeholder="0-110"
            min={0}
            max={110}
          />
        </div>

        <div>
          <Label className="text-xs text-muted-foreground mb-1.5 block">Facility Clearance Level</Label>
          <select
            value={profile.facility_clearance_level}
            onChange={(e) => onChange({ facility_clearance_level: e.target.value })}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            {Object.entries(FACILITY_CLEARANCE_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <Label className="text-xs text-muted-foreground mb-2 block">Cleared Personnel</Label>
        <div className="grid grid-cols-3 gap-3">
          {(['secret', 'ts', 'ts_sci'] as const).map((level) => (
            <div key={level}>
              <Label className="text-[10px] text-muted-foreground mb-1 block">
                {level === 'secret' ? 'Secret' : level === 'ts' ? 'Top Secret' : 'TS/SCI'}
              </Label>
              <Input
                type="number"
                value={profile.cleared_personnel[level] ?? ''}
                onChange={(e) =>
                  onChange({
                    cleared_personnel: {
                      ...profile.cleared_personnel,
                      [level]: e.target.value ? Number(e.target.value) : 0,
                    },
                  })
                }
                placeholder="0"
                min={0}
                className="text-xs"
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-xs text-muted-foreground mb-2 block">Certifications and Authorizations</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <BoolField label="CATO (Continuous Authority to Operate)" field="cato" />
          <BoolField label="ISO 9001 (Quality Management)" field="iso_9001" />
          <BoolField label="ISO 27001 (Information Security)" field="iso_27001" />
          <BoolField label="ISO 20243 (O-TTPS)" field="iso_20243" />
          <BoolField label="SOC 2 Type I" field="soc2_type1" />
          <BoolField label="SOC 2 Type II" field="soc2_type2" />
          <BoolField label="ITAR Registered" field="itar_registered" />
          <BoolField label="EAR Compliant" field="ear_compliant" />
        </div>
      </div>
    </div>
  )
}
