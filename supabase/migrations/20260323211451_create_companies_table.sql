/*
  # Create companies table

  1. New Tables
    - `companies` - Core company identity and profile data
      - `id` (uuid, primary key)
      - `user_id` (uuid, nullable - for future auth linkage)
      - `vendor_slug` (text, unique) - maps to existing vendor ID
      - `name` (text, NOT NULL) - display name
      - `legal_name` (text) - legal registered name
      - `dba_name` (text) - doing business as
      - `tagline` (text) - short marketing tagline
      - `executive_summary` (text) - 300-char search summary
      - `description` (text) - full description
      - `capability_statement` (text) - detailed capability narrative
      - `differentiators` (text) - competitive differentiation
      - `logo_url` (text) - storage path for logo
      - `website` (text)
      - `phone_primary` (text)
      - `phone_secondary` (text)
      - `email` (text) - general contact email
      - `founding_year` (integer)
      - `employee_count` (integer)
      - `annual_revenue_range` (text)
      - `org_structure` (text)
      - `state_of_incorporation` (text)
      - `parent_company` (text)
      - `funding_stage` (text)
      - `cage_code` (varchar(5))
      - `uei` (varchar(12))
      - `duns_number` (varchar(9))
      - `sam_status` (text)
      - `sam_expiration_date` (date)
      - `clearance_level` (text)
      - `facility_clearance_level` (text)
      - `cleared_personnel` (jsonb)
      - `created_at` / `updated_at` timestamps
  2. Security
    - Enable RLS on `companies` table
    - Add policy for authenticated users to read all companies
    - Add policy for company owners to update their own company
*/

CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  vendor_slug text UNIQUE,
  name text NOT NULL,
  legal_name text DEFAULT '',
  dba_name text DEFAULT '',
  tagline text DEFAULT '',
  executive_summary text DEFAULT '',
  description text DEFAULT '',
  capability_statement text DEFAULT '',
  differentiators text DEFAULT '',
  logo_url text DEFAULT '',
  website text DEFAULT '',
  phone_primary text DEFAULT '',
  phone_secondary text DEFAULT '',
  email text DEFAULT '',
  founding_year integer,
  employee_count integer DEFAULT 0,
  annual_revenue_range text DEFAULT '',
  org_structure text DEFAULT '',
  state_of_incorporation text DEFAULT '',
  parent_company text DEFAULT '',
  funding_stage text DEFAULT '',
  cage_code varchar(5) DEFAULT '',
  uei varchar(12) DEFAULT '',
  duns_number varchar(9) DEFAULT '',
  sam_status text DEFAULT 'not_registered',
  sam_expiration_date date,
  clearance_level text DEFAULT 'none',
  facility_clearance_level text DEFAULT 'none',
  cleared_personnel jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read all companies"
  ON companies
  FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Anon users can read all companies"
  ON companies
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Company owners can insert their own company"
  ON companies
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Company owners can update their own company"
  ON companies
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anon users can insert companies"
  ON companies
  FOR INSERT
  TO anon
  WITH CHECK (user_id IS NULL);

CREATE POLICY "Anon users can update companies"
  ON companies
  FOR UPDATE
  TO anon
  USING (user_id IS NULL)
  WITH CHECK (user_id IS NULL);
