# Company Side Specification

## Overview
The company side of the platform represents AI organizations that license high-quality, consented datasets for model training, evaluation, or research, with full traceability and compliance guarantees.

## User Flow

### 1. Entry Point
- **Company Login** (no real authentication required for prototype)
- Simple entry screen to identify as a company/organization

### 2. Onboarding Flow
A brief, educational flow that covers:
- **How Datasets Are Structured** - Data organization and metadata
- **How Licensing Works** - Licensing process and terms
- **How Consent Is Enforced** - Consent mechanisms and boundaries
- **How Compliance Is Guaranteed** - Audit trails and accountability

### 3. Dataset Marketplace
Main discovery interface showing all available datasets with **decision-relevant metadata**:

#### Metadata Displayed:
- **Domain** - Subject area/category (e.g., Healthcare, Finance, Agriculture)
- **Data Type** - Format and structure (e.g., CSV, JSON, Images)
- **Size** - Volume of data (rows, files, GB)
- **Contributor Count** - Number of individuals who contributed
- **Quality Score** - Data quality assessment metric
- **Consent Scope** - What uses are permitted
- **Allowed Use Cases** - Explicitly permitted applications
- **Restricted Use Cases** - Explicitly prohibited applications
- **Simulated Pricing** - Cost to license the dataset

### 4. Dataset Detail View
Selecting a dataset opens detailed information:
- **Dataset Composition** - Breakdown of data structure and sources
- **Licensing Terms** - Legal and usage constraints
- **Auditability Guarantees** - Traceability and compliance promises

### 5. License Simulation Flow

#### Steps to License a Dataset:
1. **Select Intended Use** - Specify how the data will be used
2. **Review Pricing and Payout Distribution** - See cost breakdown and contributor compensation
3. **Confirm License** - Finalize the licensing agreement

#### Actions Triggered:
- **Generate Licensing Record** - Create permanent record of the license
- **Update Usage Logs** - Record the licensing event
- **Update Consent Logs** - Track consent-based usage on contributor side
- **Trigger Simulated Payout** - Distribute value to contributors

### 6. Company Dashboard
Operational and compliance visibility hub showing:
- **Licensed Datasets** - All datasets currently licensed
- **Usage History** - Timeline of licensing events
- **Consent Scope** - Summary of permitted uses across licenses
- **Audit Reference IDs** - Unique identifiers for traceability
- **Aggregate Spend** - Total licensing costs
- **Payout Summaries** - Total value distributed to contributors

## Core Principles

### Legal and Transparent Sourcing
- All data is properly consented
- Clear audit trails for compliance
- Explicit documentation of usage rights

### Full Traceability
- Every licensing action is recorded
- Audit IDs enable end-to-end tracking
- Consent boundaries are enforced and visible

### Compliance First
- Show restricted use cases clearly
- Prevent licensing for prohibited purposes
- Demonstrate accountability mechanisms

### Operational Clarity
- Companies can easily understand what they're licensing
- Clear pricing and terms
- Simple discovery and selection process

### Demonstrating Ethics
- Show how AI teams can source data responsibly
- Emphasize consent and fair compensation
- Model best practices for data procurement

## Implementation Notes
- All data is **mock/simulated**
- No real authentication required
- No real payment processing
- No actual data delivery
- Focus on demonstrating **end-to-end licensing and audit process**
- Should feel **production-ready** in structure but use simulated workflows
- Emphasis on **compliance visibility** and **traceability**
