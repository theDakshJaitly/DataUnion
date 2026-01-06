// Vector Math Utilities for Semantic Valuation Engine
// Optimized for performance with typed arrays where possible

/**
 * Calculate cosine similarity between two vectors
 * Returns value between -1 and 1 (1 = identical, 0 = orthogonal, -1 = opposite)
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) {
        throw new Error('Vectors must have the same dimension');
    }

    let dotProduct = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;

    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        magnitudeA += vecA[i] * vecA[i];
        magnitudeB += vecB[i] * vecB[i];
    }

    magnitudeA = Math.sqrt(magnitudeA);
    magnitudeB = Math.sqrt(magnitudeB);

    if (magnitudeA === 0 || magnitudeB === 0) {
        return 0;
    }

    return dotProduct / (magnitudeA * magnitudeB);
}

/**
 * Calculate mean vector from array of vectors
 */
export function meanVector(vectors: number[][]): number[] {
    if (vectors.length === 0) return [];

    const dimension = vectors[0].length;
    const mean = new Array(dimension).fill(0);

    for (const vec of vectors) {
        for (let i = 0; i < dimension; i++) {
            mean[i] += vec[i];
        }
    }

    for (let i = 0; i < dimension; i++) {
        mean[i] /= vectors.length;
    }

    return mean;
}

/**
 * Calculate variance of an array of numbers
 */
export function variance(values: number[]): number {
    if (values.length === 0) return 0;

    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));

    return squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
}

/**
 * Chunk text into segments with overlap
 * @param text Input text
 * @param chunkSize Size of each chunk in tokens (approximate)
 * @param overlap Number of overlapping tokens between chunks
 */
export function chunkText(
    text: string,
    chunkSize: number = 512,
    overlap: number = 50
): string[] {
    // Simple word-based chunking (tokens ≈ words for English)
    const words = text.split(/\s+/).filter(w => w.length > 0);

    if (words.length === 0) return [];
    if (words.length <= chunkSize) return [text];

    const chunks: string[] = [];
    let start = 0;

    while (start < words.length) {
        const end = Math.min(start + chunkSize, words.length);
        const chunk = words.slice(start, end).join(' ');
        chunks.push(chunk);

        // Move forward by (chunkSize - overlap)
        start += chunkSize - overlap;

        // Prevent infinite loop
        if (start >= words.length) break;
    }

    return chunks;
}

/**
 * Normalize vector to unit length
 */
export function normalizeVector(vec: number[]): number[] {
    const magnitude = Math.sqrt(vec.reduce((sum, val) => sum + val * val, 0));

    if (magnitude === 0) return vec;

    return vec.map(val => val / magnitude);
}

/**
 * Calculate Euclidean distance between two vectors
 */
export function euclideanDistance(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) {
        throw new Error('Vectors must have the same dimension');
    }

    let sum = 0;
    for (let i = 0; i < vecA.length; i++) {
        sum += Math.pow(vecA[i] - vecB[i], 2);
    }

    return Math.sqrt(sum);
}
