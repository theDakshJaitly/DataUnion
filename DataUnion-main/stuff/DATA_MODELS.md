# Data Models - Single Source of Truth

These models are the **spine of the entire application**. Everything — contributor dashboards, company marketplace, transparency logs, walkthrough — hangs off these models.

---

## 1. Contributor
Represents an individual providing data to the union.

### Fields:
```typescript
{
  id: string;                      // Unique identifier
  displayName: string;             // Contributor's name
  joinedAt: Date;                  // Registration timestamp
  totalContributedDatasets: number; // Count of contributions
  averageQualityScore: number;     // 0-100 quality metric
  totalEarnings: number;           // Simulated earnings (USD)
  datasets: string[];              // Array of Dataset IDs
}
```

### Purpose:
- Tracks ownership and contribution history
- Enables earnings visibility
- Links contributors to their datasets

---

## 2. Dataset
Represents a pooled, licensable data asset.

### Fields:
```typescript
{
  id: string;                      // Unique identifier
  name: string;                    // Dataset name
  description: string;             // What this dataset contains
  dataType: string;                // e.g., "text", "speech", "images"
  domain: string;                  // e.g., "Healthcare", "Agriculture"
  sizeMetrics: {                   // Volume information
    samples?: number;
    duration?: string;
    fileSize?: string;
  };
  contributorCount: number;        // Number of contributors
  qualityScore: number;            // 0-100 quality assessment
  consentScope: string;            // Summary of permitted uses
  allowedUseCases: string[];       // Explicitly permitted applications
  restrictedUseCases: string[];    // Explicitly prohibited applications
  price: number;                   // Simulated licensing price (USD)
  createdAt: Date;                 // When dataset was created
  contributors: string[];          // Array of Contributor IDs
}
```

### Purpose:
- This is what **companies browse and license**
- Central entity connecting contributors and companies
- Contains all decision-relevant metadata

---

## 3. ConsentRecord
Explicit consent tied to data usage.

### Fields:
```typescript
{
  id: string;                      // Unique identifier
  datasetId: string;               // Which dataset
  contributorId: string;           // Who consented
  grantedAt: Date;                 // When consent was given
  consentScope: string;            // What was approved
  allowedUseCases: string[];       // Permitted uses
  revocable: boolean;              // Can be withdrawn
}
```

### Purpose:
- Makes consent a **first-class object**, not a checkbox
- Enables audit trails
- Supports revocation workflows

---

## 4. License
Represents a company licensing a dataset.

### Fields:
```typescript
{
  id: string;                      // Unique identifier
  datasetId: string;               // Which dataset was licensed
  companyId: string;               // Which company licensed it
  intendedUse: string;             // Stated purpose
  licensedAt: Date;                // When license was granted
  licenseStatus: string;           // "active", "expired", "revoked"
  auditReferenceId: string;        // Unique audit/compliance ID
  pricePaid: number;               // Simulated cost (USD)
}
```

### Purpose:
- Connects datasets to companies with traceability
- Creates licensing records
- Generates audit references

---

## 5. Company
Represents an AI organization licensing data.

### Fields:
```typescript
{
  id: string;                      // Unique identifier
  companyName: string;             // Organization name
  industry: string;                // e.g., "Healthcare AI", "AgTech"
  licensedDatasets: string[];      // Array of License IDs
  totalSpend: number;              // Simulated total spending (USD)
}
```

### Purpose:
- Drives marketplace and compliance views
- Tracks licensing history
- Enables spend analysis

---

## 6. UsageLog
Tracks how licensed data is used (for auditability).

### Fields:
```typescript
{
  id: string;                      // Unique identifier
  licenseId: string;               // Which license
  datasetId: string;               // Which dataset
  companyId: string;               // Which company
  usageType: string;               // e.g., "training", "evaluation"
  timestamp: Date;                 // When the event occurred
}
```

### Purpose:
- Auditability and transparency
- Creates usage trail
- Enables compliance verification

---

## 7. PayoutRecord
Simulated distribution of value to contributors.

### Fields:
```typescript
{
  id: string;                      // Unique identifier
  datasetId: string;               // Which dataset generated revenue
  contributorId: string;           // Who receives payout
  licenseId: string;               // Which license triggered it
  payoutAmount: number;            // Simulated payout (USD)
  calculatedAt: Date;              // When payout was calculated
  payoutStatus: string;            // "pending", "completed"
}
```

### Purpose:
- Closes the economic loop
- Demonstrates value distribution
- Shows contributors the ROI of participation

---

## Data Flow Pipeline

Every feature should support this flow:

```
┌─────────────┐      ┌─────────┐      ┌─────────┐
│ Contributor │ ───▶ │ Dataset │ ◀─── │ Company │
└─────────────┘      └─────────┘      └─────────┘
       │                  │                  │
       ▼                  ▼                  ▼
┌────────────────┐  ┌─────────┐  ┌────────────────┐
│ ConsentRecord  │  │ License │  │   UsageLog     │
└────────────────┘  └─────────┘  └────────────────┘
                          │
                          ▼
                  ┌──────────────┐
                  │ PayoutRecord │
                  └──────────────┘
```

## Implementation Notes

- All models should be **TypeScript interfaces** for type safety
- Store as JSON for prototype (can use localStorage, mock API, or simple backend)
- Seed with **realistic mock data** for demo flows
- Support **custom data uploads** that conform to these schemas
- IDs should be UUIDs or similar unique identifiers
- Dates should be ISO 8601 strings
