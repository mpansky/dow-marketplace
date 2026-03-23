import { useState } from 'react'
import type { CompanyProfile, CompanyTag, TagType } from '@/types/companyProfile'
import { OPERATIONAL_ENVIRONMENTS } from '@/types/companyProfile'
import { DOMAIN_LABELS, type CapabilityDomain } from '@/types'
import { domains as domainData } from '@/data/taxonomy'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { generateId } from '@/lib/utils'

interface Props {
  profile: CompanyProfile
  onChange: (updates: Partial<CompanyProfile>) => void
}

const ALL_DOMAINS: CapabilityDomain[] = ['cuas', 'cyber', 'aiml', 'autonomy']

export function ProfileCapabilities({ profile, onChange }: Props) {
  const [competencyInput, setCompetencyInput] = useState('')
  const [keywordInput, setKeywordInput] = useState('')
  const [techInput, setTechInput] = useState('')

  const tagsByType = (type: TagType) => profile.tags.filter((t) => t.tag_type === type)
  const selectedDomains = tagsByType('domain').map((t) => t.tag_value)

  const toggleDomain = (domain: string) => {
    const exists = profile.tags.find((t) => t.tag_type === 'domain' && t.tag_value === domain)
    if (exists) {
      onChange({ tags: profile.tags.filter((t) => !(t.tag_type === 'domain' && t.tag_value === domain)) })
    } else {
      const newTag: CompanyTag = { id: generateId(), company_id: profile.id, tag_type: 'domain', tag_value: domain }
      onChange({ tags: [...profile.tags, newTag] })
    }
  }

  const toggleSubcategory = (sub: string) => {
    const exists = profile.tags.find((t) => t.tag_type === 'subcategory' && t.tag_value === sub)
    if (exists) {
      onChange({ tags: profile.tags.filter((t) => !(t.tag_type === 'subcategory' && t.tag_value === sub)) })
    } else {
      const newTag: CompanyTag = { id: generateId(), company_id: profile.id, tag_type: 'subcategory', tag_value: sub }
      onChange({ tags: [...profile.tags, newTag] })
    }
  }

  const toggleEnv = (env: string) => {
    const exists = profile.tags.find((t) => t.tag_type === 'operational_environment' && t.tag_value === env)
    if (exists) {
      onChange({ tags: profile.tags.filter((t) => !(t.tag_type === 'operational_environment' && t.tag_value === env)) })
    } else {
      const newTag: CompanyTag = { id: generateId(), company_id: profile.id, tag_type: 'operational_environment', tag_value: env }
      onChange({ tags: [...profile.tags, newTag] })
    }
  }

  const addFreeformTag = (type: TagType, value: string, setter: (v: string) => void) => {
    const trimmed = value.trim()
    if (!trimmed) return
    if (profile.tags.some((t) => t.tag_type === type && t.tag_value === trimmed)) {
      setter('')
      return
    }
    const newTag: CompanyTag = { id: generateId(), company_id: profile.id, tag_type: type, tag_value: trimmed }
    onChange({ tags: [...profile.tags, newTag] })
    setter('')
  }

  const removeTag = (id: string) => {
    onChange({ tags: profile.tags.filter((t) => t.id !== id) })
  }

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    type: TagType,
    value: string,
    setter: (v: string) => void,
  ) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addFreeformTag(type, value, setter)
    }
  }

  const availableSubs = domainData.filter((d) => selectedDomains.includes(d.id))

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-xs text-muted-foreground mb-1.5 block">
          Executive Summary <span className="text-muted-foreground/50">({profile.executive_summary.length}/300)</span>
        </Label>
        <Textarea
          value={profile.executive_summary}
          onChange={(e) => onChange({ executive_summary: e.target.value.slice(0, 300) })}
          placeholder="A concise search-friendly summary of your company capabilities..."
          rows={3}
        />
      </div>

      <div>
        <Label className="text-xs text-muted-foreground mb-1.5 block">Capability Statement</Label>
        <Textarea
          value={profile.capability_statement}
          onChange={(e) => onChange({ capability_statement: e.target.value })}
          placeholder="Detailed capability narrative..."
          rows={6}
        />
        <p className="text-[10px] text-muted-foreground mt-1">{profile.capability_statement.length}/5000 characters</p>
      </div>

      <div>
        <Label className="text-xs text-muted-foreground mb-1.5 block">Differentiators</Label>
        <Textarea
          value={profile.differentiators}
          onChange={(e) => onChange({ differentiators: e.target.value })}
          placeholder="What sets your company apart from competitors?"
          rows={3}
        />
      </div>

      <div>
        <Label className="text-xs text-muted-foreground mb-2 block">Capability Domains</Label>
        <div className="flex flex-wrap gap-2">
          {ALL_DOMAINS.map((d) => (
            <Button
              key={d}
              variant={selectedDomains.includes(d) ? 'accent' : 'outline'}
              size="sm"
              onClick={() => toggleDomain(d)}
              className="text-xs"
            >
              {DOMAIN_LABELS[d]}
            </Button>
          ))}
        </div>
      </div>

      {availableSubs.length > 0 && (
        <div>
          <Label className="text-xs text-muted-foreground mb-2 block">Subcategories</Label>
          <div className="space-y-3">
            {availableSubs.map((domain) => (
              <div key={domain.id}>
                <p className="text-[10px] font-medium text-muted-foreground mb-1.5">{domain.name}</p>
                <div className="flex flex-wrap gap-1.5">
                  {domain.subcategories.map((sub) => {
                    const selected = profile.tags.some((t) => t.tag_type === 'subcategory' && t.tag_value === sub)
                    return (
                      <Badge
                        key={sub}
                        variant={selected ? 'accent' : 'outline'}
                        className="text-[10px] cursor-pointer"
                        onClick={() => toggleSubcategory(sub)}
                      >
                        {sub}
                      </Badge>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <TagInputSection
        label="Core Competencies"
        tags={tagsByType('core_competency')}
        inputValue={competencyInput}
        onInputChange={setCompetencyInput}
        onKeyDown={(e) => handleKeyDown(e, 'core_competency', competencyInput, setCompetencyInput)}
        onRemove={removeTag}
        placeholder="Type and press Enter..."
      />

      <TagInputSection
        label="Keywords / Search Tags"
        tags={tagsByType('keyword')}
        inputValue={keywordInput}
        onInputChange={setKeywordInput}
        onKeyDown={(e) => handleKeyDown(e, 'keyword', keywordInput, setKeywordInput)}
        onRemove={removeTag}
        placeholder="Add search keywords..."
      />

      <TagInputSection
        label="Tech Stack"
        tags={tagsByType('tech_stack')}
        inputValue={techInput}
        onInputChange={setTechInput}
        onKeyDown={(e) => handleKeyDown(e, 'tech_stack', techInput, setTechInput)}
        onRemove={removeTag}
        placeholder="Technologies, platforms, tools..."
      />

      <div>
        <Label className="text-xs text-muted-foreground mb-2 block">Operational Environments</Label>
        <div className="flex flex-wrap gap-2">
          {OPERATIONAL_ENVIRONMENTS.map((env) => {
            const selected = profile.tags.some((t) => t.tag_type === 'operational_environment' && t.tag_value === env)
            return (
              <Button
                key={env}
                variant={selected ? 'accent' : 'outline'}
                size="sm"
                className="text-xs"
                onClick={() => toggleEnv(env)}
              >
                {env}
              </Button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function TagInputSection({
  label,
  tags,
  inputValue,
  onInputChange,
  onKeyDown,
  onRemove,
  placeholder,
}: {
  label: string
  tags: CompanyTag[]
  inputValue: string
  onInputChange: (v: string) => void
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
  onRemove: (id: string) => void
  placeholder: string
}) {
  return (
    <div>
      <Label className="text-xs text-muted-foreground mb-1.5 block">{label}</Label>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {tags.map((t) => (
            <Badge key={t.id} variant="secondary" className="text-[10px] gap-1 pr-1">
              {t.tag_value}
              <button onClick={() => onRemove(t.id)} className="hover:text-red-400">
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
      <Input
        value={inputValue}
        onChange={(e) => onInputChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className="text-xs"
      />
      <p className="text-[10px] text-muted-foreground mt-1">Press Enter or comma to add</p>
    </div>
  )
}
