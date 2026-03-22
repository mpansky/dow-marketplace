import type { StorefrontConfig, StorefrontId } from '../types'

export const storefronts: Record<StorefrontId, StorefrontConfig> = {
  indopacom: {
    id: 'indopacom',
    name: 'INDOPACOM',
    command: 'U.S. Indo-Pacific Command',
    description: 'Closing INDOPACOM kill chain gaps by unleashing American industry through Challenge-Based Acquisition.',
    tagline: 'Arsenal of Freedom',
    accentColor: '#0077B6',
    accentRgb: '0, 119, 182',
    priorityDomains: ['cuas', 'autonomy', 'aiml', 'cyber'],
    heroClass: 'indopacom-topo',
    visionTagline: 'Arsenal of Freedom',
    acquisitionBrand: 'Challenge-Based Acquisition (ChBA)',
    cadreDescription: 'The forward-deployed Embedded Cadre Unit helping integrate capabilities and refine government challenges. Your on-the-ground partner between warfighter need and vendor solution.',
  },
  cybercom: {
    id: 'cybercom',
    name: 'CYBERCOM',
    command: 'U.S. Cyber Command',
    description: 'Accelerating zero-trust and cyber capability delivery through Challenge-Based Acquisition.',
    tagline: 'Arming Cyber Warriors with Commercial Innovation',
    accentColor: '#39FF14',
    accentRgb: '57, 255, 20',
    priorityDomains: ['cyber', 'aiml', 'autonomy', 'cuas'],
    heroClass: 'cybercom-grid',
    visionTagline: 'Cyber Arsenal of Freedom',
    acquisitionBrand: 'Challenge-Based Acquisition (ChBA)',
    cadreDescription: 'The forward-deployed Embedded Cadre Unit helping integrate cyber capabilities and refine government challenges. Your on-the-ground partner between cyber warriors and vendor solutions.',
  },
  global: {
    id: 'global',
    name: 'Global',
    command: 'DoW Marketplace',
    description: 'The single front door connecting American innovation to warfighter needs through Challenge-Based Acquisition.',
    tagline: 'The Single Front Door to Defense Innovation',
    accentColor: '#3b82f6',
    accentRgb: '59, 130, 246',
    priorityDomains: ['cuas', 'cyber', 'aiml', 'autonomy'],
    heroClass: '',
    visionTagline: 'Arsenal of Freedom',
    acquisitionBrand: 'Challenge-Based Acquisition (ChBA)',
    cadreDescription: 'The forward-deployed Embedded Cadre Unit helping integrate capabilities and refine government challenges.',
  },
}

export function applyStorefrontTheme(storefrontId: StorefrontId) {
  document.documentElement.setAttribute('data-storefront', storefrontId)
}
