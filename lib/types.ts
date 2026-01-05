// Data Union Platform - TypeScript Data Models
// Single source of truth for all data structures

export interface Contributor {
  id: string;
  display_name: string;
  joined_at: string; // ISO 8601
  total_contributed_datasets: number;
  average_quality_score: number; // 0-100
  total_earnings: number; // Simulated USD
  datasets: string[]; // Dataset IDs
}

export interface Dataset {
  id: string;
  name: string;
  description: string;
  data_type: string; // e.g., "text", "speech", "images", "video"
  domain: string; // e.g., "Healthcare", "Agriculture", "Finance"
  size_metrics: {
    samples?: number;
    duration?: string;
    file_size?: string;
  };
  contributor_count: number;
  quality_score: number; // 0-100
  consent_scope: string;
  allowed_use_cases: string[];
  restricted_use_cases: string[];
  price: number; // Simulated USD
  created_at: string; // ISO 8601
  contributors: string[]; // Contributor IDs
}

export interface ConsentRecord {
  id: string;
  dataset_id: string;
  contributor_id: string;
  granted_at: string; // ISO 8601
  consent_scope: string;
  allowed_use_cases: string[];
  revocable: boolean;
}

export interface License {
  id: string;
  dataset_id: string;
  company_id: string;
  intended_use: string;
  licensed_at: string; // ISO 8601
  license_status: 'active' | 'expired' | 'revoked';
  audit_reference_id: string;
  price_paid: number; // Simulated USD
}

export interface Company {
  id: string;
  company_name: string;
  industry: string; // e.g., "Healthcare AI", "AgTech", "Finance ML"
  licensed_datasets: string[]; // License IDs
  total_spend: number; // Simulated USD
}

export interface UsageLog {
  id: string;
  license_id: string;
  dataset_id: string;
  company_id: string;
  usage_type: string; // e.g., "training", "evaluation", "research"
  timestamp: string; // ISO 8601
}

export interface PayoutRecord {
  id: string;
  dataset_id: string;
  contributor_id: string;
  license_id: string;
  payout_amount: number; // Simulated USD
  calculated_at: string; // ISO 8601
  payout_status: 'pending' | 'completed';
}

// Helper types for UI components
export interface DashboardStats {
  totalDatasets?: number;
  totalEarnings?: number;
  totalSpend?: number;
  averageQuality?: number;
}
