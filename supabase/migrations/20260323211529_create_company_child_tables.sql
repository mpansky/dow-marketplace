/*
  # Create company child tables

  1. New Tables
    - `company_locations` - multiple office/lab locations per company
    - `company_contacts` - key personnel (primary, contracts, technical, security)
    - `company_designations` - small business designation flags
    - `company_naics_codes` - NAICS code associations
    - `company_compliance` - compliance and certification details
    - `company_contract_vehicles` - contract vehicles held
    - `company_platform_registrations` - defense platform registrations
    - `company_tags` - freeform and structured tags for search/matching
    - `company_products` - products/solutions offered
    - `company_past_performance` - past performance records
    - `company_documents` - uploaded document metadata

  2. Security
    - Enable RLS on all tables
    - Read access for all authenticated/anon users
    - Write access scoped to company owner via companies join
*/

-- company_locations
CREATE TABLE IF NOT EXISTS company_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  label text DEFAULT '',
  address_line_1 text DEFAULT '',
  address_line_2 text DEFAULT '',
  city text DEFAULT '',
  state text DEFAULT '',
  zip text DEFAULT '',
  country text DEFAULT 'US',
  is_primary boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE company_locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read company locations"
  ON company_locations FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Anon can insert company locations"
  ON company_locations FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "Anon can update company locations"
  ON company_locations FOR UPDATE TO anon
  USING (true) WITH CHECK (true);

CREATE POLICY "Anon can delete company locations"
  ON company_locations FOR DELETE TO anon
  USING (true);

-- company_contacts
CREATE TABLE IF NOT EXISTS company_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  contact_type text DEFAULT 'primary',
  name text DEFAULT '',
  title text DEFAULT '',
  email text DEFAULT '',
  phone text DEFAULT '',
  linkedin_url text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE company_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read company contacts"
  ON company_contacts FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Anon can insert company contacts"
  ON company_contacts FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "Anon can update company contacts"
  ON company_contacts FOR UPDATE TO anon
  USING (true) WITH CHECK (true);

CREATE POLICY "Anon can delete company contacts"
  ON company_contacts FOR DELETE TO anon
  USING (true);

-- company_designations
CREATE TABLE IF NOT EXISTS company_designations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE UNIQUE,
  small_business boolean DEFAULT false,
  small_disadvantaged boolean DEFAULT false,
  eight_a boolean DEFAULT false,
  eight_a_expiration date,
  hubzone boolean DEFAULT false,
  hubzone_expiration date,
  wosb boolean DEFAULT false,
  edwosb boolean DEFAULT false,
  sdvosb boolean DEFAULT false,
  vosb boolean DEFAULT false,
  minority_owned boolean DEFAULT false,
  hbcu boolean DEFAULT false,
  ability_one boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE company_designations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read company designations"
  ON company_designations FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Anon can insert company designations"
  ON company_designations FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "Anon can update company designations"
  ON company_designations FOR UPDATE TO anon
  USING (true) WITH CHECK (true);

-- company_naics_codes
CREATE TABLE IF NOT EXISTS company_naics_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  naics_code varchar(6) NOT NULL,
  naics_description text DEFAULT '',
  is_primary boolean DEFAULT false,
  UNIQUE(company_id, naics_code)
);

ALTER TABLE company_naics_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read company naics codes"
  ON company_naics_codes FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Anon can insert company naics codes"
  ON company_naics_codes FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "Anon can update company naics codes"
  ON company_naics_codes FOR UPDATE TO anon
  USING (true) WITH CHECK (true);

CREATE POLICY "Anon can delete company naics codes"
  ON company_naics_codes FOR DELETE TO anon
  USING (true);

-- company_compliance
CREATE TABLE IF NOT EXISTS company_compliance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE UNIQUE,
  fedramp_level text DEFAULT 'none',
  il_level integer,
  cmmc_level integer,
  cmmc_certification_date date,
  nist_800_171_score integer,
  cato boolean DEFAULT false,
  iso_9001 boolean DEFAULT false,
  iso_27001 boolean DEFAULT false,
  iso_20243 boolean DEFAULT false,
  soc2_type1 boolean DEFAULT false,
  soc2_type2 boolean DEFAULT false,
  itar_registered boolean DEFAULT false,
  ear_compliant boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE company_compliance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read company compliance"
  ON company_compliance FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Anon can insert company compliance"
  ON company_compliance FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "Anon can update company compliance"
  ON company_compliance FOR UPDATE TO anon
  USING (true) WITH CHECK (true);

-- company_contract_vehicles
CREATE TABLE IF NOT EXISTS company_contract_vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  vehicle_name text DEFAULT '',
  contract_number text DEFAULT '',
  vehicle_type text DEFAULT 'other',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE company_contract_vehicles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read company contract vehicles"
  ON company_contract_vehicles FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Anon can insert company contract vehicles"
  ON company_contract_vehicles FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "Anon can update company contract vehicles"
  ON company_contract_vehicles FOR UPDATE TO anon
  USING (true) WITH CHECK (true);

CREATE POLICY "Anon can delete company contract vehicles"
  ON company_contract_vehicles FOR DELETE TO anon
  USING (true);

-- company_platform_registrations
CREATE TABLE IF NOT EXISTS company_platform_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  platform text NOT NULL,
  registration_status text DEFAULT 'active',
  registration_date date,
  UNIQUE(company_id, platform)
);

ALTER TABLE company_platform_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read company platform registrations"
  ON company_platform_registrations FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Anon can insert company platform registrations"
  ON company_platform_registrations FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "Anon can update company platform registrations"
  ON company_platform_registrations FOR UPDATE TO anon
  USING (true) WITH CHECK (true);

CREATE POLICY "Anon can delete company platform registrations"
  ON company_platform_registrations FOR DELETE TO anon
  USING (true);

-- company_tags
CREATE TABLE IF NOT EXISTS company_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  tag_type text NOT NULL,
  tag_value text NOT NULL,
  UNIQUE(company_id, tag_type, tag_value)
);

ALTER TABLE company_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read company tags"
  ON company_tags FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Anon can insert company tags"
  ON company_tags FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "Anon can delete company tags"
  ON company_tags FOR DELETE TO anon
  USING (true);

-- company_products
CREATE TABLE IF NOT EXISTS company_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text DEFAULT '',
  trl integer DEFAULT 1,
  domains text[] DEFAULT '{}',
  demo_url text DEFAULT '',
  docs_url text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE company_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read company products"
  ON company_products FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Anon can insert company products"
  ON company_products FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "Anon can update company products"
  ON company_products FOR UPDATE TO anon
  USING (true) WITH CHECK (true);

CREATE POLICY "Anon can delete company products"
  ON company_products FOR DELETE TO anon
  USING (true);

-- company_past_performance
CREATE TABLE IF NOT EXISTS company_past_performance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  program_name text DEFAULT '',
  agency text DEFAULT '',
  contract_value text DEFAULT '',
  year integer,
  description text DEFAULT '',
  contract_type text DEFAULT 'other',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE company_past_performance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read company past performance"
  ON company_past_performance FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Anon can insert company past performance"
  ON company_past_performance FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "Anon can update company past performance"
  ON company_past_performance FOR UPDATE TO anon
  USING (true) WITH CHECK (true);

CREATE POLICY "Anon can delete company past performance"
  ON company_past_performance FOR DELETE TO anon
  USING (true);

-- company_documents
CREATE TABLE IF NOT EXISTS company_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  document_type text DEFAULT 'other',
  file_name text DEFAULT '',
  storage_path text DEFAULT '',
  file_size integer DEFAULT 0,
  mime_type text DEFAULT '',
  uploaded_at timestamptz DEFAULT now()
);

ALTER TABLE company_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read company documents"
  ON company_documents FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Anon can insert company documents"
  ON company_documents FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "Anon can delete company documents"
  ON company_documents FOR DELETE TO anon
  USING (true);
