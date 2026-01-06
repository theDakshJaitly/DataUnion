// V4 Bulletproof Semantic Valuation Worker
// Implements strict non-linear scoring with veto penalties

import { pipeline, env } from '@xenova/transformers';

// Configure transformers.js environment
// Must be done before any pipeline creation
try {
    if (env) {
        env.allowLocalModels = false;
        env.allowRemoteModels = true;
        // Set cache directory for browser
        env.useBrowserCache = true;
        env.allowRemoteModels = true;
    }
} catch (error) {
    console.warn('Failed to configure transformers.js env:', error);
}

// Types for worker communication
export interface ValuationRequest {
    text: string;
    requestId: string;
}

export interface ValuationProgress {
    type: 'progress';
    requestId: string;
    progress: number;
    message: string;
}

export interface ValuationResult {
    type: 'result';
    requestId: string;
    score: number;
    breakdown: {
        domain: number;
        coherence: number;
        entityDensity: number;
        novelty: number;
    };
    metadata: {
        dominantDomain: string;
        tags: string[];
        warnings: string[];
        chunkCount: number;
        isSpam: boolean;
        isRepetitive: boolean;
    };
}

export interface ValuationError {
    type: 'error';
    requestId: string;
    error: string;
}

export interface ModelReady {
    type: 'ready';
}

type WorkerMessage = ValuationProgress | ValuationResult | ValuationError | ModelReady;

// Global pipeline instance
let embeddingPipeline: any = null;
let isInitialized = false;

/**
 * Generate deterministic mock vector for anchors
 * Uses LCG (Linear Congruential Generator) for reproducibility
 */
function generateMockVector(seed: number): number[] {
    const DIMENSION = 384;
    const vector: number[] = [];
    let random = seed;

    for (let i = 0; i < DIMENSION; i++) {
        random = (random * 1103515245 + 12345) & 0x7fffffff;
        vector.push((random / 0x7fffffff) * 2 - 1);
    }

    // Normalize to unit vector
    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    return vector.map(val => val / magnitude);
}

// Mock Anchors (Deterministic)
const ANCHOR_MEDICAL = generateMockVector(1);
const ANCHOR_LEGAL = generateMockVector(2);
const ANCHOR_TECH = generateMockVector(3);
const ANCHOR_SPAM = generateMockVector(4);

/**
 * Strict Curve Helper
 * Forces mediocre matches to have very low scores
 * Baseline: sim < 0.6 → 0
 * Curve: 0.6-1.0 → 0-1 using squared curve
 */
function distinctCurve(similarity: number): number {
    if (similarity < 0.6) return 0;
    return Math.pow((similarity - 0.6) / 0.4, 2);
}

/**
 * Cosine Similarity
 */
function cosineSimilarity(vecA: number[], vecB: number[]): number {
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

    if (magnitudeA === 0 || magnitudeB === 0) return 0;

    return dotProduct / (magnitudeA * magnitudeB);
}

/**
 * Mean Vector
 */
function meanVector(vectors: number[][]): number[] {
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
 * Chunk text into 512-token segments
 */
function chunkText(text: string, chunkSize: number = 512): string[] {
    const words = text.split(/\s+/).filter(w => w.length > 0);

    if (words.length === 0) return [];
    if (words.length <= chunkSize) return [text];

    const chunks: string[] = [];
    for (let i = 0; i < words.length; i += chunkSize) {
        const chunk = words.slice(i, i + chunkSize).join(' ');
        chunks.push(chunk);
    }

    return chunks;
}

/**
 * Initialize the embedding model
 */
async function initializeModel() {
    if (isInitialized) return;

    try {
        console.log('[Worker] Initializing transformers.js model...');
        console.log('[Worker] Environment configured:', {
            allowLocalModels: env?.allowLocalModels,
            allowRemoteModels: env?.allowRemoteModels,
        });

        embeddingPipeline = await pipeline(
            'feature-extraction',
            'Xenova/all-MiniLM-L6-v2',
            { quantized: true }
        );

        console.log('[Worker] Model loaded successfully');
        isInitialized = true;
        postMessage({ type: 'ready' } as ModelReady);
    } catch (error) {
        console.error('[Worker] Failed to initialize model:', error);
        console.error('[Worker] Error details:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
        });

        // Send error message back to main thread
        postMessage({
            type: 'error',
            requestId: 'init',
            error: `Failed to load model: ${error instanceof Error ? error.message : 'Unknown error'}`,
        } as ValuationError);

        throw error;
    }
}

/**
 * Generate embedding for text
 */
async function generateEmbedding(text: string): Promise<number[]> {
    if (!embeddingPipeline) {
        throw new Error('Model not initialized');
    }

    const output = await embeddingPipeline(text, {
        pooling: 'mean',
        normalize: true,
    });

    return Array.from(output.data);
}

/**
 * Pillar A: Domain Relevance (40%)
 */
function calculateDomainScore(docVector: number[]): {
    score: number;
    dominantDomain: string;
} {
    const similarities = {
        medical: cosineSimilarity(docVector, ANCHOR_MEDICAL),
        legal: cosineSimilarity(docVector, ANCHOR_LEGAL),
        tech: cosineSimilarity(docVector, ANCHOR_TECH),
    };

    const maxSim = Math.max(...Object.values(similarities));
    const dominantDomain = Object.entries(similarities).find(
        ([_, sim]) => sim === maxSim
    )?.[0] || 'unknown';

    // Apply strict curve
    const curveScore = distinctCurve(maxSim);
    const score = Math.round(curveScore * 100);

    return { score, dominantDomain };
}

/**
 * Pillar B: Coherence (40%)
 */
function calculateCoherenceScore(chunkVectors: number[][]): {
    score: number;
    isRepetitive: boolean;
} {
    if (chunkVectors.length < 2) {
        return { score: 100, isRepetitive: false };
    }

    const similarities: number[] = [];
    let highSimilarityCount = 0;

    // Calculate similarity between consecutive chunks
    for (let i = 0; i < chunkVectors.length - 1; i++) {
        const sim = cosineSimilarity(chunkVectors[i], chunkVectors[i + 1]);
        similarities.push(sim);

        // Count chunks with very high similarity (repetition trap)
        if (sim > 0.95) {
            highSimilarityCount++;
        }
    }

    const avgFlow = similarities.reduce((sum, sim) => sum + sim, 0) / similarities.length;

    // Check if repetitive (>50% of pairs have sim > 0.95)
    const isRepetitive = highSimilarityCount > similarities.length * 0.5;

    // Apply strict curve
    const curveScore = distinctCurve(avgFlow);
    const score = Math.round(curveScore * 100);

    return { score, isRepetitive };
}

/**
 * Pillar C: Entity Density (20% - Proxy)
 */
function calculateEntityDensity(text: string): number {
    const words = text.split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;

    if (wordCount === 0) return 0;

    // Count capitalized words and numbers
    const capitalizedWords = words.filter(w => /^[A-Z][a-z]+/.test(w));
    const numbers = text.match(/\b\d+\b/g) || [];

    const totalEntities = capitalizedWords.length + numbers.length;
    const uniqueEntities = new Set([...capitalizedWords, ...numbers]).size;

    // Calculate unique ratio
    const uniqueRatio = totalEntities > 0 ? uniqueEntities / totalEntities : 0;

    // Calculate density
    const density = totalEntities / wordCount;

    // Score = Density * 500
    let score = density * 500;

    // Penalty if unique ratio < 0.4
    if (uniqueRatio < 0.4) {
        score *= 0.2;
    }

    return Math.min(Math.round(score), 100);
}

/**
 * Pillar D: Novelty/Spam Check
 */
function checkSpam(docVector: number[]): boolean {
    const spamSimilarity = cosineSimilarity(docVector, ANCHOR_SPAM);
    return spamSimilarity > 0.65;
}

/**
 * Main valuation function with Veto System
 */
async function valuateText(text: string, requestId: string): Promise<void> {
    try {
        // Progress: Starting
        postMessage({
            type: 'progress',
            requestId,
            progress: 10,
            message: 'Chunking text...',
        } as ValuationProgress);

        // Chunk the text
        const chunks = chunkText(text, 512);

        if (chunks.length === 0) {
            throw new Error('No valid text to analyze');
        }

        // Progress: Generating embeddings
        postMessage({
            type: 'progress',
            requestId,
            progress: 30,
            message: `Generating embeddings for ${chunks.length} chunks...`,
        } as ValuationProgress);

        // Generate embeddings for all chunks
        const chunkVectors: number[][] = [];
        for (let i = 0; i < chunks.length; i++) {
            const embedding = await generateEmbedding(chunks[i]);
            chunkVectors.push(embedding);

            const progress = 30 + (i / chunks.length) * 40;
            postMessage({
                type: 'progress',
                requestId,
                progress: Math.round(progress),
                message: `Processing chunk ${i + 1}/${chunks.length}...`,
            } as ValuationProgress);
        }

        // Calculate mean document vector
        const docVector = meanVector(chunkVectors);

        // Progress: Calculating scores
        postMessage({
            type: 'progress',
            requestId,
            progress: 80,
            message: 'Calculating quality scores...',
        } as ValuationProgress);

        // Calculate all pillars
        const domainResult = calculateDomainScore(docVector);
        const coherenceResult = calculateCoherenceScore(chunkVectors);
        const entityScore = calculateEntityDensity(text);
        const isSpam = checkSpam(docVector);

        // Build tags
        const tags: string[] = [];
        if (domainResult.score > 70) {
            tags.push(`#${domainResult.dominantDomain.charAt(0).toUpperCase() + domainResult.dominantDomain.slice(1)}`);
        }
        if (coherenceResult.score > 80) {
            tags.push('#HighCoherence');
        }
        if (entityScore > 70) {
            tags.push('#InformationRich');
        }

        // Build warnings
        const warnings: string[] = [];
        if (isSpam) {
            warnings.push('⚠️ Spam Detected');
        }
        if (coherenceResult.isRepetitive) {
            warnings.push('⚠️ High Repetition Detected');
        }

        // Calculate Base Score
        let baseScore = (domainResult.score * 0.4) + (coherenceResult.score * 0.4) + 20;

        // Apply Veto Multipliers
        if (isSpam) {
            baseScore *= 0.1; // 90% penalty
        }
        if (coherenceResult.isRepetitive) {
            baseScore *= 0.2; // 80% penalty
        }

        // Boring Text Penalty
        if (domainResult.score < 10) {
            baseScore = Math.min(baseScore, 30);
        }

        const finalScore = Math.round(baseScore);

        // Send result
        postMessage({
            type: 'result',
            requestId,
            score: finalScore,
            breakdown: {
                domain: domainResult.score,
                coherence: coherenceResult.score,
                entityDensity: entityScore,
                novelty: isSpam ? 0 : 100,
            },
            metadata: {
                dominantDomain: domainResult.dominantDomain,
                tags,
                warnings,
                chunkCount: chunks.length,
                isSpam,
                isRepetitive: coherenceResult.isRepetitive,
            },
        } as ValuationResult);

    } catch (error) {
        postMessage({
            type: 'error',
            requestId,
            error: error instanceof Error ? error.message : 'Unknown error',
        } as ValuationError);
    }
}

// Worker message handler
self.onmessage = async (event: MessageEvent<ValuationRequest | { type: 'init' }>) => {
    const message = event.data;

    if ('type' in message && message.type === 'init') {
        await initializeModel();
    } else if ('text' in message && 'requestId' in message) {
        await valuateText(message.text, message.requestId);
    }
};

// Auto-initialize on worker start
initializeModel();
