import type { CompanyProfile } from '@/types/companyProfile'

interface SectionScore {
  label: string
  score: number
  maxPoints: number
  weight: number
}

export function calculateProfileCompleteness(profile: CompanyProfile): {
  overall: number
  sections: SectionScore[]
} {
  const sections: SectionScore[] = []

  const companyInfoMax = 8
  let companyInfoScore = 0
  if (profile.name) companyInfoScore++
  if (profile.tagline) companyInfoScore++
  if (profile.website) companyInfoScore++
  if (profile.email) companyInfoScore++
  if (profile.founding_year) companyInfoScore++
  if (profile.employee_count > 0) companyInfoScore++
  if (profile.funding_stage) companyInfoScore++
  if (profile.description) companyInfoScore++
  sections.push({ label: 'Company Info', score: companyInfoScore, maxPoints: companyInfoMax, weight: 15 })

  const govIdMax = 4
  let govIdScore = 0
  if (profile.cage_code) govIdScore++
  if (profile.uei) govIdScore++
  if (profile.sam_status === 'active') govIdScore++
  if (profile.naics_codes.length > 0) govIdScore++
  sections.push({ label: 'Gov IDs', score: govIdScore, maxPoints: govIdMax, weight: 15 })

  const capMax = 5
  let capScore = 0
  if (profile.executive_summary) capScore++
  if (profile.capability_statement) capScore++
  const domainTags = profile.tags.filter(t => t.tag_type === 'domain')
  if (domainTags.length > 0) capScore++
  const compTags = profile.tags.filter(t => t.tag_type === 'core_competency')
  if (compTags.length >= 3) capScore++
  if (profile.differentiators) capScore++
  sections.push({ label: 'Capabilities', score: capScore, maxPoints: capMax, weight: 20 })

  const complianceMax = 3
  let complianceScore = 0
  if (profile.compliance) {
    if (profile.compliance.cmmc_level) complianceScore++
    if (profile.compliance.il_level) complianceScore++
    if (profile.compliance.fedramp_level && profile.compliance.fedramp_level !== 'none') complianceScore++
  }
  sections.push({ label: 'Compliance', score: complianceScore, maxPoints: complianceMax, weight: 15 })

  const perfMax = 1
  const perfScore = profile.past_performance.length > 0 ? 1 : 0
  sections.push({ label: 'Past Perf.', score: perfScore, maxPoints: perfMax, weight: 15 })

  const prodMax = 1
  const prodScore = profile.products.length > 0 ? 1 : 0
  sections.push({ label: 'Products', score: prodScore, maxPoints: prodMax, weight: 10 })

  const contactMax = 1
  const contactScore = profile.contacts.some(c => c.name && c.email) ? 1 : 0
  sections.push({ label: 'Contacts', score: contactScore, maxPoints: contactMax, weight: 5 })

  const locMax = 1
  const locScore = profile.locations.length > 0 ? 1 : 0
  sections.push({ label: 'Locations', score: locScore, maxPoints: locMax, weight: 5 })

  let overall = 0
  for (const s of sections) {
    const pct = s.maxPoints > 0 ? s.score / s.maxPoints : 0
    overall += pct * s.weight
  }

  return { overall: Math.round(overall), sections }
}
