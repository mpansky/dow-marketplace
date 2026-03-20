import type { Vendor, CapabilityDomain } from '@/types'
import { DOMAIN_LABELS, PLATFORM_LABELS, PLATFORM_COLORS, CLEARANCE_LABELS } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Shield } from 'lucide-react'
import { getInitials } from '@/lib/utils'

interface VendorCardProps {
  vendor: Vendor
  onClick?: (vendor: Vendor) => void
}

export function VendorCard({ vendor, onClick }: VendorCardProps) {
  const firstProduct = vendor.products[0]
  const trl = firstProduct?.trl

  return (
    <Card
      className="cursor-pointer hover:border-[var(--storefront-accent)]/50 transition-all hover:shadow-md group relative"
      onClick={() => onClick?.(vendor)}
    >
      {/* Match score overlay */}
      {vendor.matchScore != null && (
        <div className="absolute top-3 right-3 flex items-center justify-center w-10 h-10 rounded-full bg-[var(--storefront-accent)]/15 border border-[var(--storefront-accent)]/40">
          <span className="text-xs font-bold text-[var(--storefront-accent)]">
            {vendor.matchScore}%
          </span>
        </div>
      )}

      <CardContent className="p-4">
        {/* Header: Avatar + Name */}
        <div className="flex items-start gap-3 mb-3">
          <div
            className="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-bold"
            style={{
              background: 'color-mix(in srgb, var(--storefront-accent) 15%, transparent)',
              color: 'var(--storefront-accent)',
            }}
          >
            {getInitials(vendor.name)}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold truncate group-hover:text-[var(--storefront-accent)] transition-colors">
              {vendor.name}
            </h3>
            <p className="text-[11px] text-muted-foreground truncate">
              {vendor.tagline}
            </p>
          </div>
        </div>

        {/* Domain badges */}
        <div className="flex flex-wrap gap-1 mb-2.5">
          {vendor.domains.map((domain: CapabilityDomain) => (
            <Badge key={domain} variant="secondary" className="text-[10px] px-1.5 py-0">
              {DOMAIN_LABELS[domain]}
            </Badge>
          ))}
        </div>

        {/* TRL + Clearance row */}
        <div className="flex items-center gap-1.5 mb-2.5">
          {trl != null && (
            <Badge variant="accent" className="text-[10px] px-1.5 py-0">
              TRL {trl}
            </Badge>
          )}
          {vendor.clearanceLevel !== 'none' && (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 gap-0.5">
              <Shield className="w-2.5 h-2.5" />
              {CLEARANCE_LABELS[vendor.clearanceLevel]}
            </Badge>
          )}
        </div>

        {/* Platform badges */}
        {vendor.platformRegistrations.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2.5">
            {vendor.platformRegistrations.map((platform) => (
              <Badge
                key={platform}
                className={`text-[10px] px-1.5 py-0 border ${PLATFORM_COLORS[platform]}`}
              >
                {PLATFORM_LABELS[platform]}
              </Badge>
            ))}
          </div>
        )}

        {/* Location */}
        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
          <MapPin className="w-3 h-3" />
          <span className="truncate">{vendor.hqLocation}</span>
        </div>
      </CardContent>
    </Card>
  )
}
