import { useState, useEffect, useCallback, useRef } from 'react'
import { useApp } from '@/context/AppContext'
import type { CompanyProfile } from '@/types/companyProfile'
import { createEmptyProfile } from '@/types/companyProfile'
import { fetchCompanyProfile, saveFullProfile } from '@/services/companyProfile'
import { ProfileCompletenessBar } from './ProfileCompletenessBar'
import { ProfileCompanyInfo } from './ProfileCompanyInfo'
import { ProfileGovIds } from './ProfileGovIds'
import { ProfileDesignations } from './ProfileDesignations'
import { ProfileLocationsContacts } from './ProfileLocationsContacts'
import { ProfileCapabilities } from './ProfileCapabilities'
import { ProfileCompliance } from './ProfileCompliance'
import { ProfileContractVehicles } from './ProfileContractVehicles'
import { ProfileProductsPerformance } from './ProfileProductsPerformance'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Building2, FileText, Award, MapPin, Layers, Shield, Briefcase, Package, Save, Loader as Loader2, Check } from 'lucide-react'

type TabId = 'company' | 'govids' | 'designations' | 'locations' | 'capabilities' | 'compliance' | 'vehicles' | 'products'

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'company', label: 'Company Info', icon: <Building2 className="w-4 h-4" /> },
  { id: 'govids', label: 'Gov IDs', icon: <FileText className="w-4 h-4" /> },
  { id: 'designations', label: 'Designations', icon: <Award className="w-4 h-4" /> },
  { id: 'locations', label: 'Locations & Contacts', icon: <MapPin className="w-4 h-4" /> },
  { id: 'capabilities', label: 'Capabilities', icon: <Layers className="w-4 h-4" /> },
  { id: 'compliance', label: 'Compliance', icon: <Shield className="w-4 h-4" /> },
  { id: 'vehicles', label: 'Contracts & Platforms', icon: <Briefcase className="w-4 h-4" /> },
  { id: 'products', label: 'Products & Performance', icon: <Package className="w-4 h-4" /> },
]

function getVendorSlug(organization: string, vendors: { id: string; name: string }[]): string {
  const match = vendors.find(
    (v) => v.name.toLowerCase() === organization.toLowerCase()
  )
  return match?.id ?? organization.toLowerCase().replace(/\s+/g, '-')
}

export function ProfileBuilder() {
  const { state } = useApp()
  const [activeTab, setActiveTab] = useState<TabId>('company')
  const [profile, setProfile] = useState<CompanyProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const vendorSlug = state.currentUser
    ? getVendorSlug(state.currentUser.organization, state.vendors)
    : ''

  useEffect(() => {
    if (!vendorSlug) return
    setLoading(true)
    fetchCompanyProfile(vendorSlug).then((existing) => {
      if (existing) {
        setProfile(existing)
      } else {
        const vendor = state.vendors.find((v) => v.id === vendorSlug)
        setProfile(
          createEmptyProfile(
            vendorSlug,
            vendor?.name ?? state.currentUser?.organization ?? ''
          )
        )
      }
      setLoading(false)
    })
  }, [vendorSlug, state.vendors, state.currentUser])

  const handleChange = useCallback(
    (updates: Partial<CompanyProfile>) => {
      setProfile((prev) => {
        if (!prev) return prev
        return { ...prev, ...updates }
      })
      setSaved(false)

      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
      saveTimerRef.current = setTimeout(() => {
        setProfile((current) => {
          if (current) {
            handleSave(current)
          }
          return current
        })
      }, 3000)
    },
    [],
  )

  const handleSave = async (profileToSave: CompanyProfile) => {
    setSaving(true)
    try {
      const id = await saveFullProfile(profileToSave)
      setProfile((prev) => prev ? { ...prev, id } : prev)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch {
      // save failed silently
    } finally {
      setSaving(false)
    }
  }

  const handleManualSave = () => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    if (profile) handleSave(profile)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Unable to load profile.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Company Profile</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Build your company profile to match with defense challenges
          </p>
        </div>
        <Button
          variant="accent"
          onClick={handleManualSave}
          disabled={saving}
          className="gap-2"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : saved ? (
            <Check className="w-4 h-4" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? 'Saving...' : saved ? 'Saved' : 'Save Profile'}
        </Button>
      </div>

      <ProfileCompletenessBar profile={profile} />

      <div className="flex flex-col lg:flex-row gap-6">
        <nav className="lg:w-56 shrink-0">
          <div className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible no-scrollbar">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[var(--storefront-accent)]/10 text-[var(--storefront-accent)]'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </nav>

        <div className="flex-1 min-w-0">
          <div className="rounded-xl border border-border bg-card p-6">
            <ScrollArea className="max-h-[calc(100vh-320px)]">
              {activeTab === 'company' && <ProfileCompanyInfo profile={profile} onChange={handleChange} />}
              {activeTab === 'govids' && <ProfileGovIds profile={profile} onChange={handleChange} />}
              {activeTab === 'designations' && <ProfileDesignations profile={profile} onChange={handleChange} />}
              {activeTab === 'locations' && <ProfileLocationsContacts profile={profile} onChange={handleChange} />}
              {activeTab === 'capabilities' && <ProfileCapabilities profile={profile} onChange={handleChange} />}
              {activeTab === 'compliance' && <ProfileCompliance profile={profile} onChange={handleChange} />}
              {activeTab === 'vehicles' && <ProfileContractVehicles profile={profile} onChange={handleChange} />}
              {activeTab === 'products' && <ProfileProductsPerformance profile={profile} onChange={handleChange} />}
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  )
}
