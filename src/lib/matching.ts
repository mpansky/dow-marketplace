import type { Vendor, Challenge, CapabilityDomain } from '../types'

/**
 * Mock match scoring logic.
 * In production this would call an AI service; here we use weighted heuristics.
 */

function domainOverlap(vendorDomains: CapabilityDomain[], challengeDomains: CapabilityDomain[]): number {
  const overlap = vendorDomains.filter((d) => challengeDomains.includes(d)).length
  if (challengeDomains.length === 0) return 0
  return overlap / challengeDomains.length
}

function trlFit(vendor: Vendor, challenge: Challenge): number {
  const vendorMaxTrl = Math.max(...vendor.products.map((p) => p.trl), 0)
  if (vendorMaxTrl === 0) return 0.3
  if (vendorMaxTrl >= challenge.trlMin && vendorMaxTrl <= challenge.trlMax) return 1
  if (vendorMaxTrl >= challenge.trlMin - 1) return 0.7
  return 0.3
}

function clearanceFit(vendor: Vendor, challenge: Challenge): number {
  const levels = { none: 0, pending: 1, secret: 2, ts_sci: 3 }
  const requiredLevel = challenge.classification === 'secret' ? 2 : challenge.classification === 'cui' ? 1 : 0
  return levels[vendor.clearanceLevel] >= requiredLevel ? 1 : 0.4
}

function platformBreadth(vendor: Vendor): number {
  return Math.min(vendor.platformRegistrations.length / 3, 1)
}

function pastPerformanceScore(vendor: Vendor): number {
  if (vendor.pastPerformance.length >= 3) return 1
  if (vendor.pastPerformance.length >= 1) return 0.7
  return 0.3
}

export function computeMatchScore(vendor: Vendor, challenge: Challenge): number {
  const weights = {
    domain: 0.35,
    trl: 0.2,
    clearance: 0.15,
    platform: 0.1,
    pastPerformance: 0.1,
    health: 0.1,
  }

  const score =
    weights.domain * domainOverlap(vendor.domains, challenge.domains) +
    weights.trl * trlFit(vendor, challenge) +
    weights.clearance * clearanceFit(vendor, challenge) +
    weights.platform * platformBreadth(vendor) +
    weights.pastPerformance * pastPerformanceScore(vendor) +
    weights.health * (vendor.healthScore.overall / 100)

  return Math.round(score * 100)
}

export function generateMatchExplanation(vendor: Vendor, challenge: Challenge): string {
  const parts: string[] = []

  const overlap = vendor.domains.filter((d) => challenge.domains.includes(d))
  if (overlap.length > 0) {
    parts.push(`Strong capability overlap in ${overlap.length} domain${overlap.length > 1 ? 's' : ''}`)
  }

  const maxTrl = Math.max(...vendor.products.map((p) => p.trl), 0)
  if (maxTrl >= challenge.trlMin) {
    parts.push(`TRL ${maxTrl} meets requirement range (${challenge.trlMin}-${challenge.trlMax})`)
  }

  if (vendor.pastPerformance.length >= 2) {
    parts.push(`${vendor.pastPerformance.length} relevant past performance entries`)
  }

  if (vendor.clearanceLevel === 'ts_sci' || vendor.clearanceLevel === 'secret') {
    parts.push(`${vendor.clearanceLevel === 'ts_sci' ? 'TS/SCI' : 'SECRET'} cleared workforce`)
  }

  if (vendor.platformRegistrations.length >= 3) {
    parts.push(`Registered on ${vendor.platformRegistrations.length} platforms`)
  }

  return parts.length > 0 ? parts.join('. ') + '.' : 'General capability alignment with challenge requirements.'
}

export function rankVendorsForChallenge(
  vendors: Vendor[],
  challenge: Challenge
): (Vendor & { matchScore: number; matchExplanation: string })[] {
  return vendors
    .map((v) => ({
      ...v,
      matchScore: computeMatchScore(v, challenge),
      matchExplanation: generateMatchExplanation(v, challenge),
    }))
    .sort((a, b) => b.matchScore - a.matchScore)
}
