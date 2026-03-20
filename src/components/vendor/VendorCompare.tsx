import { useState, useMemo } from 'react'
import { useApp } from '@/context/AppContext'
import type { Vendor } from '@/types'
import { DOMAIN_LABELS, CLEARANCE_LABELS, PLATFORM_LABELS, PLATFORM_COLORS } from '@/types'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Search, X, Plus, Trophy, Minus } from 'lucide-react'
import { getInitials } from '@/lib/utils'

const MAX_COMPARE = 4

interface CompareRow {
  label: string
  render: (vendor: Vendor) => React.ReactNode
  compare?: (vendor: Vendor) => number
}

export function VendorCompare() {
  const { state } = useApp()
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [addingSlot, setAddingSlot] = useState<number | null>(null)

  const selectedVendors = useMemo(
    () => selectedIds.map((id) => state.vendors.find((v) => v.id === id)).filter(Boolean) as Vendor[],
    [selectedIds, state.vendors]
  )

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return []
    const q = searchQuery.toLowerCase()
    return state.vendors
      .filter(
        (v) =>
          !selectedIds.includes(v.id) &&
          (v.name.toLowerCase().includes(q) || v.tagline.toLowerCase().includes(q))
      )
      .slice(0, 8)
  }, [searchQuery, state.vendors, selectedIds])

  const addVendor = (vendorId: string) => {
    if (selectedIds.length >= MAX_COMPARE) return
    setSelectedIds((prev) => [...prev, vendorId])
    setSearchQuery('')
    setAddingSlot(null)
  }

  const removeVendor = (vendorId: string) => {
    setSelectedIds((prev) => prev.filter((id) => id !== vendorId))
  }

  const clearanceRank: Record<string, number> = { none: 0, pending: 1, secret: 2, ts_sci: 3 }

  const rows: CompareRow[] = [
    {
      label: 'Domains',
      render: (v) => (
        <div className="flex flex-wrap gap-1">
          {v.domains.map((d) => (
            <Badge key={d} variant="secondary" className="text-[10px]">
              {DOMAIN_LABELS[d]}
            </Badge>
          ))}
        </div>
      ),
      compare: (v) => v.domains.length,
    },
    {
      label: 'Max TRL',
      render: (v) => {
        const max = Math.max(...v.products.map((p) => p.trl), 0)
        return <Badge variant="accent" className="text-[10px]">TRL {max}</Badge>
      },
      compare: (v) => Math.max(...v.products.map((p) => p.trl), 0),
    },
    {
      label: 'Clearance',
      render: (v) => (
        <Badge variant="outline" className="text-[10px]">
          {CLEARANCE_LABELS[v.clearanceLevel]}
        </Badge>
      ),
      compare: (v) => clearanceRank[v.clearanceLevel] ?? 0,
    },
    {
      label: 'FedRAMP',
      render: (v) => (
        <span className="text-xs">{v.compliance.fedramp ?? 'N/A'}</span>
      ),
      compare: (v) => (v.compliance.fedramp ? 1 : 0),
    },
    {
      label: 'IL Level',
      render: (v) => (
        <span className="text-xs">{v.compliance.ilLevel != null ? `IL-${v.compliance.ilLevel}` : 'N/A'}</span>
      ),
      compare: (v) => v.compliance.ilLevel ?? 0,
    },
    {
      label: 'CMMC',
      render: (v) => (
        <span className="text-xs">{v.compliance.cmmc != null ? `Level ${v.compliance.cmmc}` : 'N/A'}</span>
      ),
      compare: (v) => v.compliance.cmmc ?? 0,
    },
    {
      label: 'NIST 800-171',
      render: (v) => (
        <span className={`text-xs ${v.compliance.nist80071 ? 'text-green-400' : 'text-muted-foreground'}`}>
          {v.compliance.nist80071 ? 'Yes' : 'No'}
        </span>
      ),
      compare: (v) => (v.compliance.nist80071 ? 1 : 0),
    },
    {
      label: 'Health Score',
      render: (v) => (
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden max-w-[80px]">
            <div
              className="h-full rounded-full"
              style={{ width: `${v.healthScore.overall}%`, background: 'var(--storefront-accent)' }}
            />
          </div>
          <span className="text-xs font-medium">{v.healthScore.overall}</span>
        </div>
      ),
      compare: (v) => v.healthScore.overall,
    },
    {
      label: 'Platforms',
      render: (v) => (
        <div className="flex flex-wrap gap-1">
          {v.platformRegistrations.map((p) => (
            <Badge key={p} className={`text-[10px] border ${PLATFORM_COLORS[p]}`}>
              {PLATFORM_LABELS[p]}
            </Badge>
          ))}
        </div>
      ),
      compare: (v) => v.platformRegistrations.length,
    },
    {
      label: 'Employees',
      render: (v) => <span className="text-xs">{v.employeeCount.toLocaleString()}</span>,
      compare: (v) => v.employeeCount,
    },
    {
      label: 'Products',
      render: (v) => <span className="text-xs">{v.products.length}</span>,
      compare: (v) => v.products.length,
    },
    {
      label: 'Past Performance',
      render: (v) => <span className="text-xs">{v.pastPerformance.length} records</span>,
      compare: (v) => v.pastPerformance.length,
    },
  ]

  const getBestIndex = (row: CompareRow): number => {
    if (!row.compare || selectedVendors.length < 2) return -1
    let bestIdx = 0
    let bestVal = row.compare(selectedVendors[0])
    for (let i = 1; i < selectedVendors.length; i++) {
      const val = row.compare(selectedVendors[i])
      if (val > bestVal) {
        bestVal = val
        bestIdx = i
      }
    }
    // Only highlight if there's a clear winner (not all tied)
    const allSame = selectedVendors.every((v) => row.compare!(v) === bestVal)
    return allSame ? -1 : bestIdx
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Compare Vendors</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Select up to {MAX_COMPARE} vendors for side-by-side comparison
        </p>
      </div>

      {/* Vendor selector row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Array.from({ length: MAX_COMPARE }).map((_, idx) => {
          const vendor = selectedVendors[idx]
          if (vendor) {
            return (
              <Card key={vendor.id} className="relative group">
                <CardContent className="p-4 text-center">
                  <button
                    onClick={() => removeVendor(vendor.id)}
                    className="absolute top-2 right-2 p-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-secondary"
                  >
                    <X className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                  <div
                    className="w-12 h-12 rounded-xl mx-auto mb-2 flex items-center justify-center text-sm font-bold"
                    style={{
                      background: 'color-mix(in srgb, var(--storefront-accent) 15%, transparent)',
                      color: 'var(--storefront-accent)',
                    }}
                  >
                    {getInitials(vendor.name)}
                  </div>
                  <div className="text-xs font-semibold truncate">{vendor.name}</div>
                  <div className="text-[10px] text-muted-foreground truncate">{vendor.tagline}</div>
                </CardContent>
              </Card>
            )
          }

          // Empty slot
          return (
            <div key={idx} className="relative">
              <Card
                className="border-dashed cursor-pointer hover:border-[var(--storefront-accent)]/50 transition-colors"
                onClick={() => setAddingSlot(addingSlot === idx ? null : idx)}
              >
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 rounded-xl mx-auto mb-2 flex items-center justify-center border border-dashed border-border">
                    <Plus className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="text-xs text-muted-foreground">Add vendor</div>
                </CardContent>
              </Card>

              {/* Search dropdown */}
              {addingSlot === idx && (
                <div className="absolute z-20 top-full mt-1 left-0 right-0 rounded-lg border border-border bg-card shadow-xl p-2">
                  <div className="relative mb-2">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <Input
                      placeholder="Search vendors..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 h-8 text-xs"
                      autoFocus
                    />
                  </div>
                  <div className="max-h-48 overflow-y-auto space-y-0.5">
                    {searchResults.length > 0 ? (
                      searchResults.map((v) => (
                        <button
                          key={v.id}
                          onClick={() => addVendor(v.id)}
                          className="w-full text-left px-2 py-1.5 rounded-md hover:bg-secondary transition-colors flex items-center gap-2"
                        >
                          <div
                            className="w-6 h-6 rounded flex-shrink-0 flex items-center justify-center text-[9px] font-bold"
                            style={{
                              background: 'color-mix(in srgb, var(--storefront-accent) 15%, transparent)',
                              color: 'var(--storefront-accent)',
                            }}
                          >
                            {getInitials(v.name)}
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-medium truncate">{v.name}</div>
                            <div className="text-[10px] text-muted-foreground truncate">{v.tagline}</div>
                          </div>
                        </button>
                      ))
                    ) : searchQuery.trim() ? (
                      <div className="text-xs text-muted-foreground text-center py-3">No vendors found</div>
                    ) : (
                      <div className="text-xs text-muted-foreground text-center py-3">Type to search</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Comparison table */}
      {selectedVendors.length >= 2 && (
        <ScrollArea className="w-full">
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider p-3 w-36">
                    Attribute
                  </th>
                  {selectedVendors.map((v) => (
                    <th key={v.id} className="text-left text-xs font-medium p-3">
                      {v.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const bestIdx = getBestIndex(row)
                  return (
                    <tr key={row.label} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                      <td className="p-3 text-xs text-muted-foreground font-medium">{row.label}</td>
                      {selectedVendors.map((v, idx) => (
                        <td key={v.id} className="p-3">
                          <div className="flex items-center gap-1.5">
                            {row.render(v)}
                            {bestIdx === idx && (
                              <Trophy className="w-3 h-3 text-[var(--storefront-accent)] shrink-0" />
                            )}
                          </div>
                        </td>
                      ))}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </ScrollArea>
      )}

      {/* Empty state */}
      {selectedVendors.length < 2 && (
        <div className="text-center py-16 text-muted-foreground rounded-xl border border-dashed border-border">
          <Minus className="w-8 h-8 mx-auto mb-3 opacity-40" />
          <p className="text-sm font-medium">Select at least 2 vendors to compare</p>
          <p className="text-xs mt-1">Click the empty slots above to search and add vendors</p>
        </div>
      )}
    </div>
  )
}
