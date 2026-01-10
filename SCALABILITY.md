# 🚀 Scalability & Performance Strategy

This document outlines how DataUnion's specific architecture evolves to handle increasing loads, ensuring performance remains stable as we grow from a pilot to a global platform.

---

## 🐣 Phase 1: Launch (0 - 100 Users)
**Focus:** Functionality, Security, and Core Logic.

*   **Architecture:** Single Supabase Instance (PostgreSQL).
*   **Compute:** Next.js Serverless Functions (Vercel) handling API routes like `/api/payouts`.
*   **AI Inference (The Secret Weapon):**
    *   **Specifics:** `valuation.worker.ts` runs `@xenova/transformers` locally.
    *   **Impact:** We handle 100 concurrent uploads with **0% server CPU increase**, as all vector embeddings happen on the user's device.

    ```mermaid
    sequenceDiagram
        participant User as User Device (Browser)
        participant Worker as Web Worker (AI)
        participant Server as Next.js Server
        participant DB as Supabase DB

        User->>Worker: Send File
        Note over Worker: Heavy Vector Embedding (Client CPU)
        Worker-->>User: Quality Score (95/100)
        User->>Server: Submit Metadata Only
        Server->>DB: Save Record
        Note over Server: Zero Inference Load
    ```
*   **Bottleneck Management:**
    *   Direct queries to `data_contributions` table.
    *   Basic RLS policies on `contributors` table.

---

## 📈 Phase 2: Growth (100 - 1,000 Users)
**Focus:** Optimization, Caching, and Connection Management.

*   **Database (Supabase):**
    *   Enable **Supavisor** (Connection Pooling) to manage concurrent writes to `payout_records` during license purchases.
*   **Caching:**
    *   Implement **Edge Caching** for the `Marketplace` page (`/company/marketplace`).
    *   Cache `datasets` queries for 60 seconds (ISR) since they don't change every second.
*   **API:**
    *   Rate limiting (100 req/min) on `/api/contribute` to prevent bot spam.

---

## 🚀 Phase 3: Scale (1,000 - 10,000 Users)
**Focus:** Read Replicas, Indexing, and Asset Delivery.

*   **Database:**
    *   **Read Replicas:** Route all `SELECT` queries from the `Marketplace` to a read-only replica, freeing the primary DB for `INSERT` operations (Contributions/Payouts).
    *   **Indexing:** Add composite indices on `datasets(domain, quality_score)` to speed up filtering.

    ```mermaid
    graph TD
        Users[10,000 Users]
        LB[Load Balancer]
        Primary[(Primary DB)]
        Replica[(Read Replica)]

        Users --> LB
        LB -- "Writes (Contributions/Payouts)" --> Primary
        LB -- "Reads (Marketplace/Browsing)" --> Replica
        Primary -. "Replication (WAL)" .-> Replica
    ```
*   **Storage:**
    *   Serve `sample_data` JSON/Images via a Global CDN to reduce latency for international buyers.

---

## 🪐 Phase 4: Hyper-Scale (10,000+ Users)
**Focus:** Sharding, Multi-Region, and Eventual Consistency.

*   **Database:**
    *   **Sharding:** Partition the `data_contributions` table (the fastest growing table) by `dataset_id` or `created_at` date.
    *   **Geo-Replication:** Replicate `companies` and `licenses` tables to EU/US regions for faster corporate access.
*   **Architecture:**
    *   **Async Payouts:** Move the "Calculate Payouts" logic (currently atomic) to a background job queue (BullMQ) to prevent timeouts during massive license purchases.

    ![Async Payout Pipeline](docs/diagrams/Untitled-5.jpg)

