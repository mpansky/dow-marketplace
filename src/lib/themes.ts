import type { StorefrontConfig, StorefrontId } from '../types'

export const storefronts: Record<StorefrontId, StorefrontConfig> = {
  indopacom: {
    id: 'indopacom',
    name: 'INDOPACOM',
    command: 'U.S. Indo-Pacific Command',
    description: 'Connecting Pacific warfighters to American innovation across maritime, expeditionary, and coalition operations.',
    tagline: 'Connecting Pacific Warfighters to American Innovation',
    accentColor: '#0077B6',
    accentRgb: '0, 119, 182',
    priorityDomains: ['cuas', 'autonomy', 'aiml', 'cyber'],
    heroClass: 'indopacom-topo',
  },
  cybercom: {
    id: 'cybercom',
    name: 'CYBERCOM',
    command: 'U.S. Cyber Command',
    description: 'Arming cyber warriors with commercial innovation for persistent cyber operations and zero-trust architecture.',
    tagline: 'Arming Cyber Warriors with Commercial Innovation',
    accentColor: '#39FF14',
    accentRgb: '57, 255, 20',
    priorityDomains: ['cyber', 'aiml', 'autonomy', 'cuas'],
    heroClass: 'cybercom-grid',
  },
  global: {
    id: 'global',
    name: 'Global',
    command: 'DoW Marketplace',
    description: 'The single front door connecting American innovation to warfighter needs.',
    tagline: 'The Single Front Door to Defense Innovation',
    accentColor: '#3b82f6',
    accentRgb: '59, 130, 246',
    priorityDomains: ['cuas', 'cyber', 'aiml', 'autonomy'],
    heroClass: '',
  },
}

export function applyStorefrontTheme(storefrontId: StorefrontId) {
  document.documentElement.setAttribute('data-storefront', storefrontId)
}
