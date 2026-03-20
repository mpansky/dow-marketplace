import type { User } from '../types'

export const users: User[] = [
  // PAE Users - INDOPACOM
  {
    id: 'pae-indo-1',
    name: 'Col. Marcus Hale',
    role: 'pae',
    title: 'Portfolio Acquisition Executive, Emerging Tech',
    organization: 'USINDOPACOM J8',
    email: 'marcus.hale@indopacom.mil',
    storefront: 'indopacom',
  },
  {
    id: 'pae-indo-2',
    name: 'LCDR Sarah Nakamura',
    role: 'pae',
    title: 'Portfolio Acquisition Executive, Maritime Systems',
    organization: 'USINDOPACOM J8',
    email: 'sarah.nakamura@indopacom.mil',
    storefront: 'indopacom',
  },
  // PAE Users - CYBERCOM
  {
    id: 'pae-cyber-1',
    name: 'Lt Col. Derek Wainwright',
    role: 'pae',
    title: 'Portfolio Acquisition Executive, Cyber Operations',
    organization: 'USCYBERCOM J9',
    email: 'derek.wainwright@cybercom.mil',
    storefront: 'cybercom',
  },
  {
    id: 'pae-cyber-2',
    name: 'Maj. Priya Okonkwo',
    role: 'pae',
    title: 'Portfolio Acquisition Executive, Zero Trust',
    organization: 'USCYBERCOM J9',
    email: 'priya.okonkwo@cybercom.mil',
    storefront: 'cybercom',
  },
  // NDC Users
  {
    id: 'ndc-1',
    name: 'Jason Haught',
    role: 'ndc',
    title: 'VP of Defense Programs',
    organization: 'Defense Unicorns',
    email: 'jason.haught@defenseunicorns.com',
  },
  {
    id: 'ndc-2',
    name: 'Michael Thompson',
    role: 'ndc',
    title: 'Director of Federal Sales',
    organization: 'CrowdStrike',
    email: 'michael.thompson@crowdstrike.com',
  },
  {
    id: 'ndc-3',
    name: 'Andrea Chen',
    role: 'ndc',
    title: 'Head of Government Solutions',
    organization: 'Palantir Technologies',
    email: 'andrea.chen@palantir.com',
  },
  // Admin Users - SWP Cadre
  {
    id: 'admin-1',
    name: 'Rachel Dominguez',
    role: 'admin',
    title: 'SWP Cadre Operations Lead',
    organization: 'Software & Digital Technology Pilot (SWP)',
    email: 'rachel.dominguez@swp.dod.mil',
  },
  {
    id: 'admin-2',
    name: 'James Kofi-Mensah',
    role: 'admin',
    title: 'SWP Cadre Platform Manager',
    organization: 'Software & Digital Technology Pilot (SWP)',
    email: 'james.kofi-mensah@swp.dod.mil',
  },
]

export const defaultPAE = users.find((u) => u.id === 'pae-indo-1')!
export const defaultNDC = users.find((u) => u.id === 'ndc-1')!
export const defaultAdmin = users.find((u) => u.id === 'admin-1')!
