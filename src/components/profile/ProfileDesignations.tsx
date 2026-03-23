import type { CompanyProfile, CompanyDesignations } from '@/types/companyProfile'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Props {
  profile: CompanyProfile
  onChange: (updates: Partial<CompanyProfile>) => void
}

const DESIGNATION_ITEMS: { key: keyof CompanyDesignations; label: string; tooltip: string; hasExpiration?: boolean }[] = [
  { key: 'small_business', label: 'Small Business', tooltip: 'Meets SBA size standards for your NAICS code' },
  { key: 'small_disadvantaged', label: 'Small Disadvantaged Business (SDB)', tooltip: 'Socially and economically disadvantaged per SBA criteria' },
  { key: 'eight_a', label: '8(a) Program', tooltip: 'SBA 8(a) Business Development program participant', hasExpiration: true },
  { key: 'hubzone', label: 'HUBZone', tooltip: 'Located in a Historically Underutilized Business Zone', hasExpiration: true },
  { key: 'wosb', label: 'WOSB', tooltip: 'Women-Owned Small Business' },
  { key: 'edwosb', label: 'EDWOSB', tooltip: 'Economically Disadvantaged Women-Owned Small Business' },
  { key: 'sdvosb', label: 'SDVOSB', tooltip: 'Service-Disabled Veteran-Owned Small Business' },
  { key: 'vosb', label: 'VOSB', tooltip: 'Veteran-Owned Small Business' },
  { key: 'minority_owned', label: 'Minority-Owned', tooltip: 'At least 51% owned by minority group members' },
  { key: 'hbcu', label: 'HBCU/MI', tooltip: 'Historically Black Colleges and Universities / Minority Institutions' },
  { key: 'ability_one', label: 'AbilityOne', tooltip: 'AbilityOne program participant' },
]

function getEmptyDesignations(companyId: string): CompanyDesignations {
  return {
    id: '',
    company_id: companyId,
    small_business: false,
    small_disadvantaged: false,
    eight_a: false,
    eight_a_expiration: null,
    hubzone: false,
    hubzone_expiration: null,
    wosb: false,
    edwosb: false,
    sdvosb: false,
    vosb: false,
    minority_owned: false,
    hbcu: false,
    ability_one: false,
  }
}

export function ProfileDesignations({ profile, onChange }: Props) {
  const d = profile.designations ?? getEmptyDesignations(profile.id)

  const update = (updates: Partial<CompanyDesignations>) => {
    onChange({ designations: { ...d, ...updates } })
  }

  const anyChecked = DESIGNATION_ITEMS.some((item) => d[item.key] as boolean)

  const clearAll = () => {
    onChange({ designations: getEmptyDesignations(profile.id) })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Select all applicable small business designations
        </p>
        {anyChecked && (
          <button
            onClick={clearAll}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {DESIGNATION_ITEMS.map((item) => {
          const checked = d[item.key] as boolean
          return (
            <div key={item.key}>
              <label
                className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                  checked
                    ? 'border-[var(--storefront-accent)]/50 bg-[var(--storefront-accent)]/5'
                    : 'border-border hover:border-border/80'
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => {
                    const updates: Partial<CompanyDesignations> = { [item.key]: e.target.checked }
                    if (!e.target.checked && item.hasExpiration) {
                      const expKey = `${item.key}_expiration` as keyof CompanyDesignations
                      (updates as Record<string, unknown>)[expKey] = null
                    }
                    update(updates)
                  }}
                  className="mt-0.5 rounded border-border accent-[var(--storefront-accent)]"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium">{item.label}</span>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{item.tooltip}</p>
                </div>
              </label>

              {item.hasExpiration && checked && (
                <div className="mt-2 pl-8">
                  <Label className="text-[10px] text-muted-foreground mb-1 block">Expiration Date</Label>
                  <Input
                    type="date"
                    value={
                      (item.key === 'eight_a' ? d.eight_a_expiration : d.hubzone_expiration) ?? ''
                    }
                    onChange={(e) => {
                      const expKey = `${item.key}_expiration` as keyof CompanyDesignations
                      update({ [expKey]: e.target.value || null } as Partial<CompanyDesignations>)
                    }}
                    className="h-8 text-xs"
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
