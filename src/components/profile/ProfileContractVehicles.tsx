import type { CompanyProfile, CompanyContractVehicle, CompanyPlatformRegistration, VehicleType } from '@/types/companyProfile'
import { VEHICLE_TYPE_LABELS } from '@/types/companyProfile'
import { PLATFORM_LABELS, type PlatformSource } from '@/types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Trash2 } from 'lucide-react'
import { generateId } from '@/lib/utils'

interface Props {
  profile: CompanyProfile
  onChange: (updates: Partial<CompanyProfile>) => void
}

const ALL_PLATFORMS: PlatformSource[] = ['vulcan', 'tradewinds', 'lynx', 'eris', 'ot_consortia']

const COMMON_VEHICLES = [
  'GSA MAS',
  'SEWP V',
  'CIO-SP3',
  'CIO-SP4',
  'OASIS',
  'OASIS+',
  'Alliant 2',
  'ITES-SW2',
  'ENCORE III',
  'Other',
]

export function ProfileContractVehicles({ profile, onChange }: Props) {
  const addVehicle = () => {
    const v: CompanyContractVehicle = {
      id: generateId(),
      company_id: profile.id,
      vehicle_name: '',
      contract_number: '',
      vehicle_type: 'other',
    }
    onChange({ contract_vehicles: [...profile.contract_vehicles, v] })
  }

  const updateVehicle = (idx: number, updates: Partial<CompanyContractVehicle>) => {
    const vs = [...profile.contract_vehicles]
    vs[idx] = { ...vs[idx], ...updates }
    onChange({ contract_vehicles: vs })
  }

  const removeVehicle = (idx: number) => {
    onChange({ contract_vehicles: profile.contract_vehicles.filter((_, i) => i !== idx) })
  }

  const getPlatformReg = (platform: PlatformSource) =>
    profile.platform_registrations.find((r) => r.platform === platform)

  const togglePlatform = (platform: PlatformSource) => {
    const existing = getPlatformReg(platform)
    if (existing) {
      onChange({
        platform_registrations: profile.platform_registrations.filter((r) => r.platform !== platform),
      })
    } else {
      const reg: CompanyPlatformRegistration = {
        id: generateId(),
        company_id: profile.id,
        platform,
        registration_status: 'active',
        registration_date: null,
      }
      onChange({ platform_registrations: [...profile.platform_registrations, reg] })
    }
  }

  const updatePlatformReg = (platform: PlatformSource, updates: Partial<CompanyPlatformRegistration>) => {
    onChange({
      platform_registrations: profile.platform_registrations.map((r) =>
        r.platform === platform ? { ...r, ...updates } : r
      ),
    })
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold">Contract Vehicles</h3>
          <Button variant="outline" size="sm" onClick={addVehicle}>
            <Plus className="w-3.5 h-3.5 mr-1" /> Add Vehicle
          </Button>
        </div>

        {profile.contract_vehicles.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-border rounded-lg">
            <p className="text-xs text-muted-foreground">No contract vehicles added</p>
          </div>
        ) : (
          <div className="space-y-3">
            {profile.contract_vehicles.map((v, idx) => (
              <Card key={v.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 flex-1">
                      <div>
                        <Label className="text-[10px] text-muted-foreground mb-1 block">Vehicle Name</Label>
                        <select
                          value={COMMON_VEHICLES.includes(v.vehicle_name) ? v.vehicle_name : 'Other'}
                          onChange={(e) => updateVehicle(idx, { vehicle_name: e.target.value === 'Other' ? '' : e.target.value })}
                          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                          <option value="">Select...</option>
                          {COMMON_VEHICLES.map((cv) => (
                            <option key={cv} value={cv}>{cv}</option>
                          ))}
                        </select>
                        {!COMMON_VEHICLES.includes(v.vehicle_name) && v.vehicle_name !== '' && (
                          <Input
                            value={v.vehicle_name}
                            onChange={(e) => updateVehicle(idx, { vehicle_name: e.target.value })}
                            placeholder="Custom vehicle name"
                            className="text-xs mt-2"
                          />
                        )}
                        {COMMON_VEHICLES.includes(v.vehicle_name) ? null : v.vehicle_name === '' ? (
                          <Input
                            value=""
                            onChange={(e) => updateVehicle(idx, { vehicle_name: e.target.value })}
                            placeholder="Enter vehicle name"
                            className="text-xs mt-2"
                          />
                        ) : null}
                      </div>
                      <div>
                        <Label className="text-[10px] text-muted-foreground mb-1 block">Contract Number</Label>
                        <Input
                          value={v.contract_number}
                          onChange={(e) => updateVehicle(idx, { contract_number: e.target.value })}
                          placeholder="Contract #"
                          className="text-xs"
                        />
                      </div>
                      <div>
                        <Label className="text-[10px] text-muted-foreground mb-1 block">Vehicle Type</Label>
                        <select
                          value={v.vehicle_type}
                          onChange={(e) => updateVehicle(idx, { vehicle_type: e.target.value as VehicleType })}
                          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                          {Object.entries(VEHICLE_TYPE_LABELS).map(([k, label]) => (
                            <option key={k} value={k}>{label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeVehicle(idx)}
                      className="h-7 w-7 p-0 ml-2 text-muted-foreground hover:text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-4">Platform Registrations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {ALL_PLATFORMS.map((platform) => {
            const reg = getPlatformReg(platform)
            const active = !!reg
            return (
              <Card key={platform} className={active ? 'border-[var(--storefront-accent)]/40' : ''}>
                <CardContent className="p-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={active}
                      onChange={() => togglePlatform(platform)}
                      className="rounded border-border accent-[var(--storefront-accent)]"
                    />
                    <span className="text-sm font-medium">{PLATFORM_LABELS[platform]}</span>
                  </label>
                  {active && (
                    <div className="mt-3 pl-7 grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-[10px] text-muted-foreground mb-1 block">Status</Label>
                        <select
                          value={reg.registration_status}
                          onChange={(e) => updatePlatformReg(platform, { registration_status: e.target.value })}
                          className="flex h-8 w-full rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                          <option value="active">Active</option>
                          <option value="pending">Pending</option>
                          <option value="expired">Expired</option>
                        </select>
                      </div>
                      <div>
                        <Label className="text-[10px] text-muted-foreground mb-1 block">Registration Date</Label>
                        <Input
                          type="date"
                          value={reg.registration_date ?? ''}
                          onChange={(e) => updatePlatformReg(platform, { registration_date: e.target.value || null })}
                          className="h-8 text-xs"
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
