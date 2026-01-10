# 📐 Technical Documentation



## Table of Contents

1. [System Architecture](#system-architecture)
2. [Data Lifecycle Flow](#data-lifecycle-flow)
3. [Database Schema](#database-schema)
4. [Transaction Sequence](#transaction-sequence)
5. [Security & Compliance](#security--compliance)

---

## 🏗️ System Architecture

### Overview

DataUnion follows a modern **Client-First AI Architecture**. Unlike traditional systems that process data on the server, DataUnion performs heavy AI validation and quality scoring **directly in the user's browser** using Web Workers and WASM. This ensures zero-latency feedback and maximum privacy.

![System Architecture](docs/diagrams/system-architecture.jpg)

### Core Components

*   **Next.js 16 (App Router)**: Central hub for UI, API, and SSR.
*   **Client-Side AI Engine**:
    *   **Text**: `valuation.worker.ts` running `@xenova/transformers` (all-MiniLM-L6-v2).
    *   **Image**: `imageQualityUtils.ts` using Canvas API for pixel-level analysis.
*   **Supabase Auth**: Secure user authentication and sessions.
*   **PostgreSQL DB**: Relational data store with RLS policies.
*   **Middleware**: Edge-based route protection and RBAC.
*   **Payment Gateway**: Handles license fees and contributor payouts.

 ### Request Flow

**Client (Browser)** → **AI Validation (Worker)** → **Auth (Supabase)** → **DB Storage** → **Payment**

---

## 🧠 AI Quality Engines ("Project Vector")

DataUnion employs two distinct client-side engines to validate data *before* it leaves the user's device.

### 1. Text Valuation Engine (V4)
Running in a dedicated Web Worker to prevent UI freezing.
*   **Model**: Quantized `all-MiniLM-L6-v2` (23MB).
*   **The 4 Pillars of Quality**:
    1.  **Domain Relevance (35%)**: Cosine similarity against target domain vectors (Medical, Legal, Tech).
    2.  **Semantic Coherence (35%)**: Logical flow analysis between chunks.
    3.  **Entity Density (20%)**: Named Entity Recognition (NER) frequency.
    4.  **Novelty (10%)**: Uniqueness compared to common corpus patterns.
*   **Veto System**:
    *   **Spam Veto**: 90% penalty if spam probability > 65%.
    *   **Repetition Veto**: 80% penalty if >50% of content is repetitive.

### 2. Image Analysis Engine
Pixel-level analysis using the HTML5 Canvas API.
*   **Resolution**: Megapixel scoring (8MP+ = 100).
*   **Sharpness**: Laplacian edge detection.
*   **Exposure**: Luminance histogram analysis (detects clipping).
*   **Contrast**: RMS contrast measurement.

---

## 🎨 Design System: "The Edge"

The UI follows a strict "Edge Gradient" philosophy, avoiding generic full-screen backgrounds in favor of subtle, localized energy sources.

### Visual Architecture
*   **Contributor Portal**: **"Emerald Edge"** Theme.
    *   Deep black backgrounds with a subtle emerald gradient blob in the bottom-left.
    *   `NoiseOverlay` for texture and depth.
*   **Company Portal**: **"Blue Edge"** Theme.
    *   Deep black backgrounds with a subtle blue gradient blob in the bottom-right.
    *   Glassmorphism cards for login and dashboards.
*   **Typography**: `Space Grotesk` for headings, `Inter` for body text.
*   **Styling**: Tailwind CSS v4.

---

## 🔄 Data Lifecycle Flow

### Complete Journey: From Contribution to Payout

![Data Lifecycle](docs/diagrams/data-lifecycle.jpg)

### The Journey

1.  **Pre-Ingestion (Client)**: User selects file.
2.  **Instant Validation**:
    *   Browser loads AI model.
    *   File analyzed locally.
    *   Quality Score (0-100) returned immediately.
3.  **Submission**: Only high-quality data is signed and uploaded.
4.  **Aggregation**: Data pooled into licensable datasets.
5.  **Licensing**: Company purchases access.
6.  **Distribution**: Revenue split & paid to contributors.

**Key Traits**: Privacy-Preserving, Zero-Latency, High-Fidelity.

> [!NOTE]
> **Security Note**: Client-side validation is primarily for user privacy and instant feedback. In a production environment, cryptographic proofs or a lightweight server-side re-verification step would be employed to prevent spoofed quality scores.

---

## 🗄️ Database Schema

### Entity-Relationship Diagram

![Database Schema](docs/diagrams/database-schema.jpg)

*   **Companies**: Organizations purchasing data.
*   **Contributors**: Users providing data.
*   **Datasets**: Aggregated, licensable pools.
*   **DataContributions**: Individual data items with quality scores.
*   **Licenses**: Purchase records linking Company & Dataset.
*   **PayoutRecords**: Financial logs linking License & Contributor.

### Schema Definition

### Schema Definition

#### `companies`
| Column | Type | Description |
| :--- | :--- | :--- |
| `company_id` | UUID | Primary Key (Default: `gen_random_uuid()`) |
| `name` | Text | Company Name |
| `industry` | Text | Industry Sector |
| `total_spend` | Numeric | Total amount spent on licenses |
| `auth_user_id` | UUID | Link to Supabase Auth User (Unique) |
| `org_type` | Text | Organization Type |

#### `contributors`
| Column | Type | Description |
| :--- | :--- | :--- |
| `contributor_id` | UUID | Primary Key (Default: `gen_random_uuid()`) |
| `name` | Text | Contributor Name |
| `total_earnings` | Numeric | Total earnings from data sales |
| `auth_user_id` | UUID | Link to Supabase Auth User (Unique) |
| `wallet_address` | Text | Crypto wallet for payouts |

#### `datasets`
| Column | Type | Description |
| :--- | :--- | :--- |
| `dataset_id` | UUID | Primary Key |
| `name` | Text | Dataset Name |
| `domain` | Text | Domain (Medical, Legal, Tech, etc.) |
| `quality_score` | Numeric | Aggregated Quality Score (0-100) |
| `price_per_license` | Numeric | Cost for a company to license |
| `total_contributions` | Integer | Number of data items included |

#### `data_contributions`
| Column | Type | Description |
| :--- | :--- | :--- |
| `contribution_id` | UUID | Primary Key |
| `contributor_id` | UUID | Foreign Key -> `contributors` |
| `dataset_id` | UUID | Foreign Key -> `datasets` |
| `quality_score` | Numeric | AI-Assigned Quality Score |
| `contribution_value` | Numeric | Calculated monetary value |
| `sample_data` | Text | Preview/Sample of the data |

#### `licenses`
| Column | Type | Description |
| :--- | :--- | :--- |
| `license_id` | UUID | Primary Key |
| `company_id` | UUID | Foreign Key -> `companies` |
| `dataset_id` | UUID | Foreign Key -> `datasets` |
| `price_paid` | Numeric | Amount paid for this license |
| `intended_use` | Text | Stated purpose of use |

#### `payout_records`
| Column | Type | Description |
| :--- | :--- | :--- |
| `payout_id` | UUID | Primary Key |
| `contributor_id` | UUID | Foreign Key -> `contributors` |
| `license_id` | UUID | Foreign Key -> `licenses` |
| `amount` | Numeric | Amount paid to contributor |
| `payout_date` | Timestamp | Date of payout processing |

### Design Principles

**Normalization** (3NF), **RLS Security**, **Immutable Audits**, **Referential Integrity**.

---

## ⚡ Transaction Sequence: Company License Purchase

### Detailed Interaction Flow

![Sequence Diagram](docs/diagrams/sequence-diagram.jpg)

### The Flow

1.  **Initiation**: Company requests license via API.
2.  **Validation**: System checks balance & auth.
3.  **Execution**:
    *   Create `License` record.
    *   Calculate payouts for *all* contributors.
    *   Commit transaction atomically.
4.  **Completion**: Access token issued.

### Payment Formula

```text
1. Contribution Weight = Quality Score * Base Value
2. Total Weight = Sum(All Contribution Weights)
3. Contributor Share = (Contribution Weight / Total Weight) * (License Fee * 0.90)
4. Platform Fee = License Fee * 0.10
```

**Tech Specs**: Atomic Transactions, <2s latency, Rollback on failure.

---


## 🔒 Security & Compliance

### Middleware Protection
`middleware.ts` acts as the first line of defense:
*   **Session Validation**: Intercepts requests to verify Supabase Auth tokens.
*   **Role-Based Access Control (RBAC)**:
    *   `/company/*` routes restricted to Company accounts.
    *   `/contributor/*` routes restricted to Contributor accounts.
*   **Redirects**: Automatically routes unauthenticated users to the correct login page.

### Authentication & Authorization

- **Supabase Auth** with JWT tokens
- **Row Level Security (RLS)** in PostgreSQL
- **API rate limiting:** 100 requests/minute per user
- **Session expiration:** 24 hours

### Data Protection

- **Encryption at rest:** AES-256 for sensitive fields
- **Encryption in transit:** TLS 1.3 for all connections
- **PII handling:** Pseudonymization of wallet addresses/IDs
- **Audit logs:** Immutable, append-only

### Regulatory Compliance

**GDPR Compliance:**
- Right to access (data export)
- Right to deletion (soft delete with anonymization)
- Consent management built-in
- Data portability supported

**AI Act Compliance:**
- Training data transparency
- Audit trail for all usage
- Human-in-the-loop for disputes

### Failure Handling

**Database Failure:**
- Automatic failover to read replica
- 30-second recovery time

**Payment Failure:**
- Retry mechanism (3 attempts)
- Manual reconciliation queue
- Email notification to admin

**Quality Engine Downtime:**
- Fallback to basic validation
- Queue for re-processing when back online

---

## 🛠️ Technology Decisions

### Why Next.js 16?
- App Router for improved performance
- Server Components reduce client-side JavaScript
- Built-in API routes eliminate separate backend
- Excellent developer experience

### Why Supabase?
- PostgreSQL (proven, scalable database)
- Built-in authentication
- Real-time subscriptions
- Row Level Security (critical for multi-tenant)

### Why Tailwind CSS v4?
- Utility-first styling
- Small bundle size
- Dark mode support out of the box
- Faster development

---

## 📊 Monitoring & Observability

**Metrics Tracked:**
- API response times
- Database query performance
- Error rates by endpoint
- User engagement metrics

**Logging & Observability:**
- **Vercel Analytics**: Real-time performance metrics and web vitals.
- **Supabase Logs**: Database query analysis and auth logs.
- **Runtime Logs**: Server-side application logs via Vercel.

---

**Back to:** [Main README](README.md) | [Research](RESEARCH.md) | [Phase 2 Implementation Plan](Phase2_Implementation_Plan.md)
