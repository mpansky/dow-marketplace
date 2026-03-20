import { useState } from 'react'
import type { Vendor, CapabilityDomain, PlatformSource } from '@/types'
import { DOMAIN_LABELS, PLATFORM_LABELS, PLATFORM_COLORS, CLEARANCE_LABELS } from '@/types'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  MapPin, Users, Calendar, Landmark, Globe, Shield,
  CheckCircle2, XCircle, Package, FileText, Layers,
} from 'lucide-react'
import { getInitials } from '@/lib/utils'

type Tab = 'overview' | 'products' | 'performance' | 'platforms'

const TABS: { id: Tab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'products', label: 'Products' },
  { id: 'performance', label: 'Past Performance' },
  { id: 'platforms', label: 'Platforms' },
]

const FUNDING_LABELS: Record<string, string> = {
  bootstrapped: 'Bootstrapped',
  seed: 'Seed',
  series_a: 'Series A',
  series_b: 'Series B',
  series_c: 'Series C',
  series_d: 'Series D',
  public: 'Public',
}

interface VendorDetailProps {
  vendor: Vendor | null
  open: boolean
  onClose: () => void
}

export function VendorDetail({ vendor, open, onClose }: VendorDetailProps) {
  const [activeTab, setActiveTab] = useState<Tab>('overview')

  if (!vendor) return null

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent side="right" className="w-full max-w-2xl p-0 flex flex-col">
        {/* Header */}
        <div className="p-6 pb-0">
          <SheetHeader className="mb-4">
            <div className="flex items-start gap-4">
              <div
                className="w-14 h-14 rounded-xl flex-shrink-0 flex items-center justify-center text-lg font-bold"
                style={{
                  background: 'color-mix(in srgb, var(--storefront-accent) 15%, transparent)',
                  color: 'var(--storefront-accent)',
                }}
              >
                {getInitials(vendor.name)}
              </div>
              <div className="min-w-0 flex-1">
                <SheetTitle className="text-xl">{vendor.name}</SheetTitle>
                <SheetDescription className="mt-0.5">{vendor.tagline}</SheetDescription>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {vendor.domains.map((domain: CapabilityDomain) => (
                    <Badge key={domain} variant="secondary" className="text-[10px]">
                      {DOMAIN_LABELS[domain]}
                    </Badge>
                  ))}
                  {vendor.clearanceLevel !== 'none' && (
                    <Badge variant="outline" className="text-[10px] gap-0.5">
                      <Shield className="w-2.5 h-2.5" />
                      {CLEARANCE_LABELS[vendor.clearanceLevel]}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </SheetHeader>

          {/* Health score bars */}
          <HealthScoreSection vendor={vendor} />

          {/* Tab bar */}
          <div className="flex gap-1 mt-4 border-b border-border">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 text-xs font-medium transition-colors relative ${
                  activeTab === tab.id
                    ? 'text-[var(--storefront-accent)]'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--storefront-accent)] rounded-t" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <ScrollArea className="flex-1 p-6">
          {activeTab === 'overview' && <OverviewTab vendor={vendor} />}
          {activeTab === 'products' && <ProductsTab vendor={vendor} />}
          {activeTab === 'performance' && <PerformanceTab vendor={vendor} />}
          {activeTab === 'platforms' && <PlatformsTab vendor={vendor} />}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

/* ---------- Health Score Section ---------- */

function HealthScoreSection({ vendor }: { vendor: Vendor }) {
  const hs = vendor.healthScore
  const dimensions: { label: string; value: number }[] = [
    { label: 'Profile', value: hs.profileCompleteness },
    { label: 'Platforms', value: hs.platformBreadth },
    { label: 'Engagement', value: hs.engagementRate },
    { label: 'Past Perf.', value: hs.pastPerformanceStrength },
    { label: 'Compliance', value: hs.complianceReadiness },
  ]

  return (
    <div className="mt-4 rounded-lg border border-border bg-card/50 p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Health Score
        </span>
        <span className="text-sm font-bold text-[var(--storefront-accent)]">{hs.overall}/100</span>
      </div>
      <div className="space-y-1.5">
        {dimensions.map((d) => (
          <div key={d.label} className="flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground w-16 shrink-0">{d.label}</span>
            <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${d.value}%`,
                  background: 'var(--storefront-accent)',
                  opacity: d.value > 70 ? 1 : d.value > 40 ? 0.7 : 0.4,
                }}
              />
            </div>
            <span className="text-[10px] text-muted-foreground w-6 text-right">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ---------- Overview Tab ---------- */

function OverviewTab({ vendor }: { vendor: Vendor }) {
  const stats = [
    { icon: <Users className="w-3.5 h-3.5" />, label: 'Employees', value: vendor.employeeCount.toLocaleString() },
    { icon: <Calendar className="w-3.5 h-3.5" />, label: 'Founded', value: vendor.foundingYear.toString() },
    { icon: <Landmark className="w-3.5 h-3.5" />, label: 'Funding', value: FUNDING_LABELS[vendor.fundingStage] ?? vendor.fundingStage },
    { icon: <MapPin className="w-3.5 h-3.5" />, label: 'HQ', value: vendor.hqLocation },
  ]

  return (
    <div className="space-y-5">
      {/* Description */}
      <div>
        <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">About</h4>
        <p className="text-sm text-foreground/90 leading-relaxed">{vendor.description}</p>
      </div>

      {/* Key stats */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="flex items-center gap-2 rounded-lg border border-border p-2.5">
            <span className="text-muted-foreground">{s.icon}</span>
            <div>
              <div className="text-[10px] text-muted-foreground">{s.label}</div>
              <div className="text-xs font-medium">{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Website */}
      {vendor.website && (
        <div className="flex items-center gap-2 text-sm">
          <Globe className="w-3.5 h-3.5 text-muted-foreground" />
          <a
            href={vendor.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--storefront-accent)] hover:underline text-xs"
          >
            {vendor.website}
          </a>
        </div>
      )}

      {/* Investors */}
      {vendor.investors.length > 0 && (
        <div>
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Investors</h4>
          <div className="flex flex-wrap gap-1.5">
            {vendor.investors.map((inv) => (
              <Badge key={inv} variant="outline" className="text-[10px]">
                {inv}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Tech stack */}
      {vendor.techStack.length > 0 && (
        <div>
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Tech Stack</h4>
          <div className="flex flex-wrap gap-1.5">
            {vendor.techStack.map((tech) => (
              <Badge key={tech} variant="secondary" className="text-[10px]">
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Compliance */}
      <ComplianceSection vendor={vendor} />

      {/* Contract vehicles */}
      {vendor.contractVehicles.length > 0 && (
        <div>
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Contract Vehicles
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {vendor.contractVehicles.map((cv) => (
              <Badge key={cv} variant="outline" className="text-[10px]">
                {cv}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ---------- Compliance Section ---------- */

function ComplianceSection({ vendor }: { vendor: Vendor }) {
  const c = vendor.compliance
  const items: { label: string; value: string | boolean | number | undefined }[] = [
    { label: 'FedRAMP', value: c.fedramp },
    { label: 'IL Level', value: c.ilLevel != null ? `IL-${c.ilLevel}` : undefined },
    { label: 'CATO', value: c.cato },
    { label: 'CMMC', value: c.cmmc != null ? `Level ${c.cmmc}` : undefined },
    { label: 'NIST 800-171', value: c.nist80071 },
  ]

  const hasAny = items.some((i) => i.value != null)
  if (!hasAny) return null

  return (
    <div>
      <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Compliance</h4>
      <div className="grid grid-cols-2 gap-2">
        {items.map((item) => {
          if (item.value == null) return null
          const isBool = typeof item.value === 'boolean'
          return (
            <div
              key={item.label}
              className="flex items-center gap-2 rounded-md border border-border px-2.5 py-1.5"
            >
              {isBool ? (
                item.value ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-red-400" />
                )
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
              )}
              <span className="text-xs">
                {item.label}{isBool ? '' : `: ${item.value}`}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ---------- Products Tab ---------- */

function ProductsTab({ vendor }: { vendor: Vendor }) {
  if (vendor.products.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <Package className="w-8 h-8 mx-auto mb-2 opacity-40" />
        <p className="text-sm">No products listed</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {vendor.products.map((product) => (
        <Card key={product.id} className="border-border">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <h4 className="text-sm font-semibold">{product.name}</h4>
              <Badge variant="accent" className="text-[10px] ml-2 shrink-0">
                TRL {product.trl}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mb-2">
              {product.description}
            </p>
            <div className="flex flex-wrap gap-1">
              {product.domains.map((d: CapabilityDomain) => (
                <Badge key={d} variant="secondary" className="text-[10px]">
                  {DOMAIN_LABELS[d]}
                </Badge>
              ))}
            </div>
            {(product.demoUrl || product.docsUrl) && (
              <div className="flex gap-2 mt-3">
                {product.demoUrl && (
                  <Button variant="outline" size="sm" className="text-xs h-7" asChild>
                    <a href={product.demoUrl} target="_blank" rel="noopener noreferrer">
                      Demo
                    </a>
                  </Button>
                )}
                {product.docsUrl && (
                  <Button variant="outline" size="sm" className="text-xs h-7" asChild>
                    <a href={product.docsUrl} target="_blank" rel="noopener noreferrer">
                      Docs
                    </a>
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

/* ---------- Past Performance Tab ---------- */

function PerformanceTab({ vendor }: { vendor: Vendor }) {
  if (vendor.pastPerformance.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <FileText className="w-8 h-8 mx-auto mb-2 opacity-40" />
        <p className="text-sm">No past performance records</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-border text-left">
            <th className="py-2 pr-3 font-medium text-muted-foreground">Program</th>
            <th className="py-2 pr-3 font-medium text-muted-foreground">Agency</th>
            <th className="py-2 pr-3 font-medium text-muted-foreground">Value</th>
            <th className="py-2 pr-3 font-medium text-muted-foreground">Year</th>
          </tr>
        </thead>
        <tbody>
          {vendor.pastPerformance.map((pp, i) => (
            <tr key={i} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
              <td className="py-2.5 pr-3">
                <div className="font-medium">{pp.program}</div>
                <div className="text-muted-foreground mt-0.5 line-clamp-2">{pp.description}</div>
              </td>
              <td className="py-2.5 pr-3 text-muted-foreground">{pp.agency}</td>
              <td className="py-2.5 pr-3 font-medium">{pp.value}</td>
              <td className="py-2.5 pr-3 text-muted-foreground">{pp.year}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ---------- Platforms Tab ---------- */

function PlatformsTab({ vendor }: { vendor: Vendor }) {
  if (vendor.platformRegistrations.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <Layers className="w-8 h-8 mx-auto mb-2 opacity-40" />
        <p className="text-sm">No platform registrations</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {vendor.platformRegistrations.map((platform: PlatformSource) => (
        <div
          key={platform}
          className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-secondary/30 transition-colors"
        >
          <Badge className={`border ${PLATFORM_COLORS[platform]} text-xs`}>
            {PLATFORM_LABELS[platform]}
          </Badge>
          <span className="text-xs text-muted-foreground">Registered</span>
        </div>
      ))}
    </div>
  )
}
