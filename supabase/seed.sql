-- Seed file for DataUnion platform
-- Run this in Supabase SQL Editor after schema.sql

-- Clear existing data (optional, for clean slate)
TRUNCATE TABLE payout_records, licenses, data_contributions, datasets, contributors, companies CASCADE;

-- 1. Create demo contributors
INSERT INTO contributors (name, total_earnings, created_at) VALUES
('Alice Johnson', 0, NOW() - INTERVAL '30 days'),
('Bob Smith', 0, NOW() - INTERVAL '25 days'),
('Carol Davis', 0, NOW() - INTERVAL '20 days'),
('David Wilson', 0, NOW() - INTERVAL '15 days'),
('Emma Brown', 0, NOW() - INTERVAL '10 days');

-- 2. Create platform-managed datasets
INSERT INTO datasets (name, description, domain, data_type, total_contributions, contributor_count, quality_score, price_per_license, times_licensed, created_at) VALUES
(
  'Urban Mobility Dataset',
  'Real-time GPS and transportation data from city commuters',
  'Transportation',
  'sensor',
  0,  -- Will be updated after contributions
  0,  -- Will be updated after contributions
  92.5,
  5000,
  0,
  NOW() - INTERVAL '30 days'
),
(
  'Social Sentiment Dataset',
  'Anonymized social media posts and sentiment analysis',
  'Social Media',
  'text',
  0,
  0,
  88.3,
  3500,
  0,
  NOW() - INTERVAL '28 days'
),
(
  'Medical Imaging Dataset',
  'Anonymized medical scans for AI training',
  'Healthcare',
  'image',
  0,
  0,
  95.7,
  12000,
  0,
  NOW() - INTERVAL '25 days'
),
(
  'IoT Smart Home Dataset',
  'Energy usage and environmental sensor readings',
  'IoT',
  'sensor',
  0,
  0,
  90.1,
  4500,
  0,
  NOW() - INTERVAL '20 days'
);

-- 3. Add sample data contributions (distributed across contributors and datasets)
-- This makes licensing payouts realistic by spreading contributions across multiple users
DO $$
DECLARE
  contributor_ids UUID[];
  urban_mobility_id UUID;
  social_sentiment_id UUID;
  medical_imaging_id UUID;
  iot_smart_home_id UUID;
BEGIN
  -- Get contributor IDs
  SELECT ARRAY_AGG(contributor_id) INTO contributor_ids FROM contributors;
  
  -- Get dataset IDs
  SELECT dataset_id INTO urban_mobility_id FROM datasets WHERE name = 'Urban Mobility Dataset';
  SELECT dataset_id INTO social_sentiment_id FROM datasets WHERE name = 'Social Sentiment Dataset';
  SELECT dataset_id INTO medical_imaging_id FROM datasets WHERE name = 'Medical Imaging Dataset';
  SELECT dataset_id INTO iot_smart_home_id FROM datasets WHERE name = 'IoT Smart Home Dataset';

  -- Urban Mobility contributions (30 samples from 4 contributors)
  FOR i IN 1..8 LOOP
    INSERT INTO data_contributions (dataset_id, contributor_id, data_type, sample_data, quality_score, contribution_value, created_at) VALUES
    (urban_mobility_id, contributor_ids[1], 'sensor', '{"latitude": 12.9716, "longitude": 77.5946, "speed": ' || (40 + i * 5) || '}', 92 + (i % 5), 3.20, NOW() - INTERVAL '25 days' + (i || ' days')::INTERVAL);
  END LOOP;
  
  FOR i IN 1..8 LOOP
    INSERT INTO data_contributions (dataset_id, contributor_id, data_type, sample_data, quality_score, contribution_value, created_at) VALUES
    (urban_mobility_id, contributor_ids[2], 'sensor', '{"latitude": 12.2958, "longitude": 76.6394, "speed": ' || (35 + i * 4) || '}', 88 + (i % 6), 3.00, NOW() - INTERVAL '23 days' + (i || ' days')::INTERVAL);
  END LOOP;

  FOR i IN 1..7 LOOP
    INSERT INTO data_contributions (dataset_id, contributor_id, data_type, sample_data, quality_score, contribution_value, created_at) VALUES
    (urban_mobility_id, contributor_ids[3], 'sensor', '{"latitude": 13.0827, "longitude": 80.2707, "speed": ' || (42 + i * 3) || '}', 90 + (i % 4), 3.10, NOW() - INTERVAL '20 days' + (i || ' days')::INTERVAL);
  END LOOP;

  FOR i IN 1..7 LOOP
    INSERT INTO data_contributions (dataset_id, contributor_id, data_type, sample_data, quality_score, contribution_value, created_at) VALUES
    (urban_mobility_id, contributor_ids[4], 'sensor', '{"latitude": 19.0760, "longitude": 72.8777, "speed": ' || (38 + i * 6) || '}', 91 + (i % 5), 3.15, NOW() - INTERVAL '18 days' + (i || ' days')::INTERVAL);
  END LOOP;

  -- Social Sentiment contributions (25 samples from 5 contributors)
  FOR i IN 1..5 LOOP
    INSERT INTO data_contributions (dataset_id, contributor_id, data_type, sample_data, quality_score, contribution_value, created_at) VALUES
    (social_sentiment_id, contributor_ids[1], 'text', 'Just had an amazing experience with the new metro line! Clean, fast, and affordable. Sample ' || i, 85 + (i * 2), 2.50, NOW() - INTERVAL '22 days' + (i || ' days')::INTERVAL);
  END LOOP;

  FOR i IN 1..5 LOOP
    INSERT INTO data_contributions (dataset_id, contributor_id, data_type, sample_data, quality_score, contribution_value, created_at) VALUES
    (social_sentiment_id, contributor_ids[2], 'text', 'Traffic is really heavy on MG Road this morning. Bumper to bumper since 8 AM. Sample ' || i, 87 + (i * 2), 2.60, NOW() - INTERVAL '20 days' + (i || ' days')::INTERVAL);
  END LOOP;

  FOR i IN 1..5 LOOP
    INSERT INTO data_contributions (dataset_id, contributor_id, data_type, sample_data, quality_score, contribution_value, created_at) VALUES
    (social_sentiment_id, contributor_ids[3], 'text', 'Concerned about air quality today. AQI is showing 180+ in my area. Sample ' || i, 83 + (i * 2), 2.40, NOW() - INTERVAL '18 days' + (i || ' days')::INTERVAL);
  END LOOP;

  FOR i IN 1..5 LOOP
    INSERT INTO data_contributions (dataset_id, contributor_id, data_type, sample_data, quality_score, contribution_value, created_at) VALUES
    (social_sentiment_id, contributor_ids[4], 'text', 'The new park in our neighborhood is wonderful. Great for morning walks. Sample ' || i, 89 + (i * 2), 2.70, NOW() - INTERVAL '16 days' + (i || ' days')::INTERVAL);
  END LOOP;

  FOR i IN 1..5 LOOP
    INSERT INTO data_contributions (dataset_id, contributor_id, data_type, sample_data, quality_score, contribution_value, created_at) VALUES
    (social_sentiment_id, contributor_ids[5], 'text', 'Online food delivery service was quick and efficient today. Impressed. Sample ' || i, 86 + (i * 2), 2.55, NOW() - INTERVAL '14 days' + (i || ' days')::INTERVAL);
  END LOOP;

  -- Medical Imaging contributions (20 samples from 3 contributors)
  FOR i IN 1..7 LOOP
    INSERT INTO data_contributions (dataset_id, contributor_id, data_type, sample_data, quality_score, contribution_value, created_at) VALUES
    (medical_imaging_id, contributor_ids[2], 'image', 'data:image/placeholder-chest-xray-' || i, 94 + (i % 4), 8.50, NOW() - INTERVAL '24 days' + (i || ' days')::INTERVAL);
  END LOOP;

  FOR i IN 1..7 LOOP
    INSERT INTO data_contributions (dataset_id, contributor_id, data_type, sample_data, quality_score, contribution_value, created_at) VALUES
    (medical_imaging_id, contributor_ids[3], 'image', 'data:image/placeholder-mri-scan-' || i, 96 + (i % 3), 9.00, NOW() - INTERVAL '22 days' + (i || ' days')::INTERVAL);
  END LOOP;

  FOR i IN 1..6 LOOP
    INSERT INTO data_contributions (dataset_id, contributor_id, data_type, sample_data, quality_score, contribution_value, created_at) VALUES
    (medical_imaging_id, contributor_ids[4], 'image', 'data:image/placeholder-ct-scan-' || i, 95 + (i % 3), 8.80, NOW() - INTERVAL '20 days' + (i || ' days')::INTERVAL);
  END LOOP;

  -- IoT Smart Home contributions (25 samples from 4 contributors)
  FOR i IN 1..7 LOOP
    INSERT INTO data_contributions (dataset_id, contributor_id, data_type, sample_data, quality_score, contribution_value, created_at) VALUES
    (iot_smart_home_id, contributor_ids[1], 'sensor', '{"temperature": ' || (22 + i) || ', "humidity": ' || (60 + i * 2) || ', "energy": ' || (2.0 + i * 0.3) || '}', 89 + (i % 5), 1.80, NOW() - INTERVAL '19 days' + (i || ' days')::INTERVAL);
  END LOOP;

  FOR i IN 1..6 LOOP
    INSERT INTO data_contributions (dataset_id, contributor_id, data_type, sample_data, quality_score, contribution_value, created_at) VALUES
    (iot_smart_home_id, contributor_ids[3], 'sensor', '{"temperature": ' || (24 + i) || ', "humidity": ' || (55 + i * 2) || ', "energy": ' || (1.8 + i * 0.4) || '}', 91 + (i % 4), 1.90, NOW() - INTERVAL '17 days' + (i || ' days')::INTERVAL);
  END LOOP;

  FOR i IN 1..6 LOOP
    INSERT INTO data_contributions (dataset_id, contributor_id, data_type, sample_data, quality_score, contribution_value, created_at) VALUES
    (iot_smart_home_id, contributor_ids[4], 'sensor', '{"temperature": ' || (23 + i) || ', "humidity": ' || (58 + i * 2) || ', "energy": ' || (2.2 + i * 0.2) || '}', 88 + (i % 6), 1.75, NOW() - INTERVAL '15 days' + (i || ' days')::INTERVAL);
  END LOOP;

  FOR i IN 1..6 LOOP
    INSERT INTO data_contributions (dataset_id, contributor_id, data_type, sample_data, quality_score, contribution_value, created_at) VALUES
    (iot_smart_home_id, contributor_ids[5], 'sensor', '{"temperature": ' || (25 + i) || ', "humidity": ' || (62 + i * 2) || ', "energy": ' || (1.9 + i * 0.3) || '}', 90 + (i % 5), 1.85, NOW() - INTERVAL '13 days' + (i || ' days')::INTERVAL);
  END LOOP;

  -- Update dataset stats
  UPDATE datasets SET 
    total_contributions = (SELECT COUNT(*) FROM data_contributions WHERE dataset_id = datasets.dataset_id),
    contributor_count = (SELECT COUNT(DISTINCT contributor_id) FROM data_contributions WHERE dataset_id = datasets.dataset_id);
    
END $$;

-- 4. Add demo companies
INSERT INTO companies (name, industry, total_spend, created_at) VALUES
('TechCorp AI', 'Artificial Intelligence', 0, NOW() - INTERVAL '15 days'),
('DataScience Inc', 'Data Analytics', 0, NOW() - INTERVAL '12 days'),
('SmartCity Solutions', 'Urban Planning', 0, NOW() - INTERVAL '8 days');
