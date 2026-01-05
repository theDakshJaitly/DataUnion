-- Data Union Platform Database Schema (Realistic Individual Contributions)
-- This schema supports individual data samples aggregated into platform-managed datasets

-- Drop existing tables to rebuild with new structure
DROP TABLE IF EXISTS payout_records CASCADE;
DROP TABLE IF EXISTS usage_logs CASCADE;
DROP TABLE IF EXISTS licenses CASCADE;
DROP TABLE IF EXISTS data_contributions CASCADE;
DROP TABLE IF EXISTS consent_records CASCADE;
DROP TABLE IF EXISTS companies CASCADE;
DROP TABLE IF EXISTS datasets CASCADE;
DROP TABLE IF EXISTS contributors CASCADE;

-- 1. Contributors Table
CREATE TABLE contributors (
  contributor_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  total_earnings NUMERIC(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Datasets Table (Platform-Managed)
-- Datasets are pre-seeded and managed by platform, not created by users
CREATE TABLE datasets (
  dataset_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  data_type TEXT NOT NULL, -- 'text', 'image', 'sensor'
  domain TEXT NOT NULL,
  quality_score NUMERIC(5,2) DEFAULT 0, -- Average quality of all contributions
  price_per_license NUMERIC(10,2) DEFAULT 0, -- How much companies pay to license this
  total_contributions INTEGER DEFAULT 0, -- How many individual samples in this dataset
  contributor_count INTEGER DEFAULT 0, -- How many unique contributors
  times_licensed INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Data Contributions Table (Individual Samples)
-- Each row is ONE data sample from ONE contributor
CREATE TABLE data_contributions (
  contribution_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contributor_id UUID REFERENCES contributors(contributor_id) ON DELETE CASCADE,
  dataset_id UUID REFERENCES datasets(dataset_id) ON DELETE CASCADE,
  data_type TEXT NOT NULL,
  sample_data TEXT NOT NULL, -- The actual data (text, base64 image, JSON sensor reading)
  quality_score NUMERIC(5,2) DEFAULT 0, -- Individual quality score
  contribution_value NUMERIC(10,2) DEFAULT 0, -- Estimated value of this single contribution
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Companies Table
CREATE TABLE companies (
  company_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  industry TEXT,
  total_spend NUMERIC(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Licenses Table
-- When a company licenses a dataset, ALL contributors to that dataset get paid
CREATE TABLE licenses (
  license_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dataset_id UUID REFERENCES datasets(dataset_id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(company_id) ON DELETE CASCADE,
  intended_use TEXT NOT NULL,
  price_paid NUMERIC(10,2) DEFAULT 0,
  licensed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Payout Records Table
-- Each payout is for ONE contribution when the dataset is licensed
CREATE TABLE payout_records (
  payout_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contribution_id UUID REFERENCES data_contributions(contribution_id) ON DELETE CASCADE,
  dataset_id UUID REFERENCES datasets(dataset_id) ON DELETE CASCADE,
  contributor_id UUID REFERENCES contributors(contributor_id) ON DELETE CASCADE,
  license_id UUID REFERENCES licenses(license_id) ON DELETE CASCADE,
  amount NUMERIC(10,2) DEFAULT 0, -- Per-contribution share of license fee
  payout_date TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_contributions_contributor ON data_contributions(contributor_id);
CREATE INDEX idx_contributions_dataset ON data_contributions(dataset_id);
CREATE INDEX idx_licenses_dataset ON licenses(dataset_id);
CREATE INDEX idx_licenses_company ON licenses(company_id);
CREATE INDEX idx_payout_contributor ON payout_records(contributor_id);
CREATE INDEX idx_payout_contribution ON payout_records(contribution_id);

-- Enable Row Level Security
ALTER TABLE contributors ENABLE ROW LEVEL SECURITY;
ALTER TABLE datasets ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE payout_records ENABLE ROW LEVEL SECURITY;

-- Allow all for prototype
CREATE POLICY "Allow all for prototype" ON contributors FOR ALL USING (true);
CREATE POLICY "Allow all for prototype" ON datasets FOR ALL USING (true);
CREATE POLICY "Allow all for prototype" ON data_contributions FOR ALL USING (true);
CREATE POLICY "Allow all for prototype" ON companies FOR ALL USING (true);
CREATE POLICY "Allow all for prototype" ON licenses FOR ALL USING (true);
CREATE POLICY "Allow all for prototype" ON payout_records FOR ALL USING (true);
