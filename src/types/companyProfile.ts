export type RevenueRange = '' | 'under_1m' | '1m_5m' | '5m_25m' | '25m_100m' | '100m_500m' | '500m_plus'

export type OrgStructure = '' | 'llc' | 'corp' | 's_corp' | 'partnership' | 'sole_proprietor' | 'other'

export type SAMStatus = 'not_registered' | 'active' | 'inactive' | 'expired'

export type FedRAMPLevel = 'none' | 'li_saas' | 'low' | 'moderate' | 'high'

export type ContactType = 'primary' | 'contracts_bd' | 'technical' | 'security'

export type VehicleType = 'gwac' | 'bpa' | 'idiq' | 'ota' | 'gsa_mas' | 'other'

export type ContractType = 'firm_fixed' | 'cost_plus' | 'time_materials' | 'ota' | 'sbir' | 'other'

export type DocumentType = 'capability_statement_pdf' | 'logo' | 'sam_registration' | 'certification' | 'other'

export type TagType = 'domain' | 'subcategory' | 'core_competency' | 'keyword' | 'operational_environment' | 'tech_stack'

export interface CompanyProfile {
  id: string
  user_id: string | null
  vendor_slug: string
  name: string
  legal_name: string
  dba_name: string
  tagline: string
  executive_summary: string
  description: string
  capability_statement: string
  differentiators: string
  logo_url: string
  website: string
  phone_primary: string
  phone_secondary: string
  email: string
  founding_year: number | null
  employee_count: number
  annual_revenue_range: RevenueRange
  org_structure: OrgStructure
  state_of_incorporation: string
  parent_company: string
  funding_stage: string
  cage_code: string
  uei: string
  duns_number: string
  sam_status: SAMStatus
  sam_expiration_date: string | null
  clearance_level: string
  facility_clearance_level: string
  cleared_personnel: Record<string, number>
  created_at: string
  updated_at: string
  locations: CompanyLocation[]
  contacts: CompanyContact[]
  designations: CompanyDesignations | null
  naics_codes: CompanyNAICSCode[]
  compliance: CompanyCompliance | null
  contract_vehicles: CompanyContractVehicle[]
  platform_registrations: CompanyPlatformRegistration[]
  tags: CompanyTag[]
  products: CompanyProduct[]
  past_performance: CompanyPastPerformance[]
  documents: CompanyDocument[]
}

export interface CompanyLocation {
  id: string
  company_id: string
  label: string
  address_line_1: string
  address_line_2: string
  city: string
  state: string
  zip: string
  country: string
  is_primary: boolean
}

export interface CompanyContact {
  id: string
  company_id: string
  contact_type: ContactType
  name: string
  title: string
  email: string
  phone: string
  linkedin_url: string
}

export interface CompanyDesignations {
  id: string
  company_id: string
  small_business: boolean
  small_disadvantaged: boolean
  eight_a: boolean
  eight_a_expiration: string | null
  hubzone: boolean
  hubzone_expiration: string | null
  wosb: boolean
  edwosb: boolean
  sdvosb: boolean
  vosb: boolean
  minority_owned: boolean
  hbcu: boolean
  ability_one: boolean
}

export interface CompanyNAICSCode {
  id: string
  company_id: string
  naics_code: string
  naics_description: string
  is_primary: boolean
}

export interface CompanyCompliance {
  id: string
  company_id: string
  fedramp_level: FedRAMPLevel
  il_level: number | null
  cmmc_level: number | null
  cmmc_certification_date: string | null
  nist_800_171_score: number | null
  cato: boolean
  iso_9001: boolean
  iso_27001: boolean
  iso_20243: boolean
  soc2_type1: boolean
  soc2_type2: boolean
  itar_registered: boolean
  ear_compliant: boolean
}

export interface CompanyContractVehicle {
  id: string
  company_id: string
  vehicle_name: string
  contract_number: string
  vehicle_type: VehicleType
}

export interface CompanyPlatformRegistration {
  id: string
  company_id: string
  platform: string
  registration_status: string
  registration_date: string | null
}

export interface CompanyTag {
  id: string
  company_id: string
  tag_type: TagType
  tag_value: string
}

export interface CompanyProduct {
  id: string
  company_id: string
  name: string
  description: string
  trl: number
  domains: string[]
  demo_url: string
  docs_url: string
}

export interface CompanyPastPerformance {
  id: string
  company_id: string
  program_name: string
  agency: string
  contract_value: string
  year: number | null
  description: string
  contract_type: ContractType
}

export interface CompanyDocument {
  id: string
  company_id: string
  document_type: DocumentType
  file_name: string
  storage_path: string
  file_size: number
  mime_type: string
  uploaded_at: string
}

export const REVENUE_RANGE_LABELS: Record<string, string> = {
  '': 'Not specified',
  under_1m: 'Under $1M',
  '1m_5m': '$1M - $5M',
  '5m_25m': '$5M - $25M',
  '25m_100m': '$25M - $100M',
  '100m_500m': '$100M - $500M',
  '500m_plus': '$500M+',
}

export const ORG_STRUCTURE_LABELS: Record<string, string> = {
  '': 'Not specified',
  llc: 'LLC',
  corp: 'Corporation (C-Corp)',
  s_corp: 'S-Corporation',
  partnership: 'Partnership',
  sole_proprietor: 'Sole Proprietor',
  other: 'Other',
}

export const SAM_STATUS_LABELS: Record<string, string> = {
  not_registered: 'Not Registered',
  active: 'Active',
  inactive: 'Inactive',
  expired: 'Expired',
}

export const FEDRAMP_LABELS: Record<string, string> = {
  none: 'None',
  li_saas: 'Li-SaaS',
  low: 'Low',
  moderate: 'Moderate',
  high: 'High',
}

export const CONTACT_TYPE_LABELS: Record<ContactType, string> = {
  primary: 'Primary POC',
  contracts_bd: 'Contracts / BD',
  technical: 'Technical POC',
  security: 'Security POC',
}

export const VEHICLE_TYPE_LABELS: Record<VehicleType, string> = {
  gwac: 'GWAC',
  bpa: 'BPA',
  idiq: 'IDIQ',
  ota: 'OTA',
  gsa_mas: 'GSA MAS',
  other: 'Other',
}

export const CONTRACT_TYPE_LABELS: Record<ContractType, string> = {
  firm_fixed: 'Firm Fixed Price',
  cost_plus: 'Cost Plus',
  time_materials: 'Time & Materials',
  ota: 'OTA',
  sbir: 'SBIR/STTR',
  other: 'Other',
}

export const FUNDING_STAGE_LABELS: Record<string, string> = {
  bootstrapped: 'Bootstrapped',
  seed: 'Seed',
  series_a: 'Series A',
  series_b: 'Series B',
  series_c: 'Series C',
  series_d: 'Series D',
  public: 'Public',
}

export const FACILITY_CLEARANCE_LABELS: Record<string, string> = {
  none: 'None',
  confidential: 'Confidential',
  secret: 'Secret',
  ts: 'Top Secret',
  ts_sci: 'TS/SCI',
}

export const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA',
  'HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
  'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
  'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC',
]

export const COMMON_NAICS_CODES: { code: string; description: string }[] = [
  { code: '541511', description: 'Custom Computer Programming Services' },
  { code: '541512', description: 'Computer Systems Design Services' },
  { code: '541513', description: 'Computer Facilities Management Services' },
  { code: '541519', description: 'Other Computer Related Services' },
  { code: '541330', description: 'Engineering Services' },
  { code: '541715', description: 'R&D in the Physical, Engineering, and Life Sciences' },
  { code: '334511', description: 'Search, Detection, Navigation, and Guidance Instruments' },
  { code: '334220', description: 'Radio and Television Broadcasting Equipment' },
  { code: '334290', description: 'Other Communications Equipment Manufacturing' },
  { code: '336414', description: 'Guided Missile and Space Vehicle Manufacturing' },
  { code: '336411', description: 'Aircraft Manufacturing' },
  { code: '336413', description: 'Other Aircraft Parts and Auxiliary Equipment' },
  { code: '334118', description: 'Computer Terminal and Other Computer Peripheral Equipment' },
  { code: '518210', description: 'Data Processing, Hosting, and Related Services' },
  { code: '561210', description: 'Facilities Support Services' },
  { code: '561612', description: 'Security Guards and Patrol Services' },
  { code: '519130', description: 'Internet Publishing and Broadcasting and Web Search Portals' },
  { code: '511210', description: 'Software Publishers' },
  { code: '541690', description: 'Other Scientific and Technical Consulting Services' },
  { code: '541990', description: 'All Other Professional, Scientific, and Technical Services' },
  { code: '336992', description: 'Military Armored Vehicle, Tank, and Tank Component Manufacturing' },
  { code: '332993', description: 'Ammunition (except Small Arms) Manufacturing' },
  { code: '334419', description: 'Other Electronic Component Manufacturing' },
  { code: '517110', description: 'Wired Telecommunications Carriers' },
  { code: '517210', description: 'Wireless Telecommunications Carriers' },
]

export const OPERATIONAL_ENVIRONMENTS = [
  'Maritime',
  'Airborne',
  'Ground',
  'Space',
  'Cyber',
  'DDIL / Austere',
]

export function createEmptyProfile(vendorSlug: string, name: string): CompanyProfile {
  return {
    id: '',
    user_id: null,
    vendor_slug: vendorSlug,
    name,
    legal_name: '',
    dba_name: '',
    tagline: '',
    executive_summary: '',
    description: '',
    capability_statement: '',
    differentiators: '',
    logo_url: '',
    website: '',
    phone_primary: '',
    phone_secondary: '',
    email: '',
    founding_year: null,
    employee_count: 0,
    annual_revenue_range: '',
    org_structure: '',
    state_of_incorporation: '',
    parent_company: '',
    funding_stage: '',
    cage_code: '',
    uei: '',
    duns_number: '',
    sam_status: 'not_registered',
    sam_expiration_date: null,
    clearance_level: 'none',
    facility_clearance_level: 'none',
    cleared_personnel: {},
    created_at: '',
    updated_at: '',
    locations: [],
    contacts: [],
    designations: null,
    naics_codes: [],
    compliance: null,
    contract_vehicles: [],
    platform_registrations: [],
    tags: [],
    products: [],
    past_performance: [],
    documents: [],
  }
}
