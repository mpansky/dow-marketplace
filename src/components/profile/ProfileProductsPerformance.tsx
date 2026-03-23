import type { CompanyProfile, CompanyProduct, CompanyPastPerformance, ContractType } from '@/types/companyProfile'
import { CONTRACT_TYPE_LABELS } from '@/types/companyProfile'
import { DOMAIN_LABELS, type CapabilityDomain } from '@/types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Trash2, Package, FileText } from 'lucide-react'
import { generateId } from '@/lib/utils'

interface Props {
  profile: CompanyProfile
  onChange: (updates: Partial<CompanyProfile>) => void
}

const ALL_DOMAINS: CapabilityDomain[] = ['cuas', 'cyber', 'aiml', 'autonomy']

export function ProfileProductsPerformance({ profile, onChange }: Props) {
  const addProduct = () => {
    const p: CompanyProduct = {
      id: generateId(),
      company_id: profile.id,
      name: '',
      description: '',
      trl: 5,
      domains: [],
      demo_url: '',
      docs_url: '',
    }
    onChange({ products: [...profile.products, p] })
  }

  const updateProduct = (idx: number, updates: Partial<CompanyProduct>) => {
    const ps = [...profile.products]
    ps[idx] = { ...ps[idx], ...updates }
    onChange({ products: ps })
  }

  const removeProduct = (idx: number) => {
    onChange({ products: profile.products.filter((_, i) => i !== idx) })
  }

  const toggleProductDomain = (idx: number, domain: string) => {
    const p = profile.products[idx]
    const domains = p.domains.includes(domain)
      ? p.domains.filter((d) => d !== domain)
      : [...p.domains, domain]
    updateProduct(idx, { domains })
  }

  const addPastPerf = () => {
    const pp: CompanyPastPerformance = {
      id: generateId(),
      company_id: profile.id,
      program_name: '',
      agency: '',
      contract_value: '',
      year: null,
      description: '',
      contract_type: 'other',
    }
    onChange({ past_performance: [...profile.past_performance, pp] })
  }

  const updatePastPerf = (idx: number, updates: Partial<CompanyPastPerformance>) => {
    const pps = [...profile.past_performance]
    pps[idx] = { ...pps[idx], ...updates }
    onChange({ past_performance: pps })
  }

  const removePastPerf = (idx: number) => {
    onChange({ past_performance: profile.past_performance.filter((_, i) => i !== idx) })
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold">Products & Solutions</h3>
          </div>
          <Button variant="outline" size="sm" onClick={addProduct}>
            <Plus className="w-3.5 h-3.5 mr-1" /> Add Product
          </Button>
        </div>

        {profile.products.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-border rounded-lg">
            <Package className="w-6 h-6 mx-auto mb-2 text-muted-foreground/40" />
            <p className="text-xs text-muted-foreground">No products added yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {profile.products.map((product, idx) => (
              <Card key={product.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <Input
                      value={product.name}
                      onChange={(e) => updateProduct(idx, { name: e.target.value })}
                      placeholder="Product name"
                      className="text-sm font-semibold border-0 p-0 h-auto focus-visible:ring-0 shadow-none"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeProduct(idx)}
                      className="h-7 w-7 p-0 text-muted-foreground hover:text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>

                  <Textarea
                    value={product.description}
                    onChange={(e) => updateProduct(idx, { description: e.target.value })}
                    placeholder="Describe this product..."
                    rows={2}
                    className="text-xs mb-3"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <div>
                      <Label className="text-[10px] text-muted-foreground mb-1 block">
                        TRL Level: {product.trl}
                      </Label>
                      <input
                        type="range"
                        min={1}
                        max={9}
                        value={product.trl}
                        onChange={(e) => updateProduct(idx, { trl: Number(e.target.value) })}
                        className="w-full accent-[var(--storefront-accent)]"
                      />
                      <div className="flex justify-between text-[9px] text-muted-foreground">
                        <span>1</span><span>3</span><span>5</span><span>7</span><span>9</span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-[10px] text-muted-foreground mb-1 block">Domains</Label>
                      <div className="flex flex-wrap gap-1">
                        {ALL_DOMAINS.map((d) => (
                          <Badge
                            key={d}
                            variant={product.domains.includes(d) ? 'accent' : 'outline'}
                            className="text-[10px] cursor-pointer"
                            onClick={() => toggleProductDomain(idx, d)}
                          >
                            {DOMAIN_LABELS[d]}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-[10px] text-muted-foreground mb-1 block">Demo URL</Label>
                      <Input
                        value={product.demo_url}
                        onChange={(e) => updateProduct(idx, { demo_url: e.target.value })}
                        placeholder="https://..."
                        className="text-xs"
                      />
                    </div>
                    <div>
                      <Label className="text-[10px] text-muted-foreground mb-1 block">Docs URL</Label>
                      <Input
                        value={product.docs_url}
                        onChange={(e) => updateProduct(idx, { docs_url: e.target.value })}
                        placeholder="https://..."
                        className="text-xs"
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
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold">Past Performance</h3>
          </div>
          <Button variant="outline" size="sm" onClick={addPastPerf}>
            <Plus className="w-3.5 h-3.5 mr-1" /> Add Record
          </Button>
        </div>

        {profile.past_performance.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-border rounded-lg">
            <FileText className="w-6 h-6 mx-auto mb-2 text-muted-foreground/40" />
            <p className="text-xs text-muted-foreground">No past performance records</p>
          </div>
        ) : (
          <div className="space-y-3">
            {profile.past_performance.map((pp, idx) => (
              <Card key={pp.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
                      <div>
                        <Label className="text-[10px] text-muted-foreground mb-1 block">Program Name</Label>
                        <Input
                          value={pp.program_name}
                          onChange={(e) => updatePastPerf(idx, { program_name: e.target.value })}
                          placeholder="Program name"
                          className="text-xs"
                        />
                      </div>
                      <div>
                        <Label className="text-[10px] text-muted-foreground mb-1 block">Contracting Agency</Label>
                        <Input
                          value={pp.agency}
                          onChange={(e) => updatePastPerf(idx, { agency: e.target.value })}
                          placeholder="US Army, USAF, etc."
                          className="text-xs"
                        />
                      </div>
                      <div>
                        <Label className="text-[10px] text-muted-foreground mb-1 block">Contract Value</Label>
                        <Input
                          value={pp.contract_value}
                          onChange={(e) => updatePastPerf(idx, { contract_value: e.target.value })}
                          placeholder="$10M"
                          className="text-xs"
                        />
                      </div>
                      <div>
                        <Label className="text-[10px] text-muted-foreground mb-1 block">Year</Label>
                        <Input
                          type="number"
                          value={pp.year ?? ''}
                          onChange={(e) => updatePastPerf(idx, { year: e.target.value ? Number(e.target.value) : null })}
                          placeholder="2024"
                          className="text-xs"
                          min={1990}
                          max={2030}
                        />
                      </div>
                      <div>
                        <Label className="text-[10px] text-muted-foreground mb-1 block">Contract Type</Label>
                        <select
                          value={pp.contract_type}
                          onChange={(e) => updatePastPerf(idx, { contract_type: e.target.value as ContractType })}
                          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                          {Object.entries(CONTRACT_TYPE_LABELS).map(([k, v]) => (
                            <option key={k} value={k}>{v}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removePastPerf(idx)}
                      className="h-7 w-7 p-0 ml-2 text-muted-foreground hover:text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                  <div>
                    <Label className="text-[10px] text-muted-foreground mb-1 block">Description</Label>
                    <Textarea
                      value={pp.description}
                      onChange={(e) => updatePastPerf(idx, { description: e.target.value })}
                      placeholder="Describe the work performed..."
                      rows={2}
                      className="text-xs"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
