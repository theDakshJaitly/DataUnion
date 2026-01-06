// Anchor Centroid Definitions for Semantic Valuation
// These are 384-dimensional vectors representing domain-specific "semantic centers"

/**
 * IMPORTANT: These are MOCK centroids for development purposes.
 * In production, these should be replaced with real centroids generated from:
 * 1. Collecting representative samples from each domain
 * 2. Generating embeddings using the same model (all-MiniLM-L6-v2)
 * 3. Computing the mean vector for each domain
 * 
 * To generate real centroids:
 * - Medical: 100+ medical research papers/clinical notes
 * - Legal: 100+ legal documents/contracts
 * - Tech: 100+ technical documentation/code comments
 * - Spam: 100+ spam/junk text samples
 * - Common: 100+ generic web content samples
 */

const EMBEDDING_DIMENSION = 384; // all-MiniLM-L6-v2 output dimension

/**
 * Generate a deterministic pseudo-random vector for development
 * Uses a seed to ensure consistency across runs
 */
function generateMockCentroid(seed: number): number[] {
    const vector: number[] = [];
    let random = seed;

    for (let i = 0; i < EMBEDDING_DIMENSION; i++) {
        // Simple LCG (Linear Congruential Generator)
        random = (random * 1103515245 + 12345) & 0x7fffffff;
        vector.push((random / 0x7fffffff) * 2 - 1); // Normalize to [-1, 1]
    }

    // Normalize to unit vector
    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    return vector.map(val => val / magnitude);
}

// Medical Domain Anchor
// Represents: Clinical notes, research papers, medical terminology
export const ANCHOR_MEDICAL = generateMockCentroid(42);

// Legal Domain Anchor
// Represents: Contracts, legal briefs, regulatory documents
export const ANCHOR_LEGAL = generateMockCentroid(1337);

// Tech Domain Anchor
// Represents: Technical documentation, code comments, API specs
export const ANCHOR_TECH = generateMockCentroid(9001);

// Spam/Junk Anchor
// Represents: Spam emails, gibberish, promotional junk
export const ANCHOR_SPAM = generateMockCentroid(666);

// Common/Generic Anchor
// Represents: Generic web content, social media posts, casual text
export const ANCHOR_COMMON = generateMockCentroid(2023);

export const ANCHORS = {
    medical: ANCHOR_MEDICAL,
    legal: ANCHOR_LEGAL,
    tech: ANCHOR_TECH,
    spam: ANCHOR_SPAM,
    common: ANCHOR_COMMON,
} as const;

export type AnchorType = keyof typeof ANCHORS;
