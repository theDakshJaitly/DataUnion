# Project Vector - Semantic Valuation Engine

## 🎯 Overview

Project Vector is a client-side AI module that analyzes text quality using semantic embeddings, running entirely in the browser without sending data to servers.

## 🏗️ Architecture

### Core Components

1. **Web Worker (`lib/ai/valuation.worker.ts`)**
   - Runs AI inference off the main thread
   - Uses transformers.js with Xenova/all-MiniLM-L6-v2 (quantized)
   - Generates 384-dimensional embeddings
   - Implements 4-pillar scoring system

2. **React Hook (`lib/hooks/useTextValuation.ts`)**
   - Manages worker lifecycle
   - Handles state management
   - Provides progress updates
   - Manages cold start (initial model download)

3. **UI Component (`components/quality/QualityScanner.tsx`)**
   - File upload and text input
   - Brain scan animation during processing
   - Transparency card with score breakdown
   - Export functionality

### Helper Modules

- **Vector Utils (`lib/ai/vectorUtils.ts`)**: Math operations (cosine similarity, chunking, variance)
- **Anchors (`lib/ai/anchors.ts`)**: Domain-specific centroids (Medical, Legal, Tech, Spam, Common)

## 📊 4-Pillar Scoring System

### Pillar A: Domain Relevance (35%)
- Compares document vector against Medical, Legal, and Tech anchors
- Uses cosine similarity
- **Scoring Logic**:
  - MaxSim > 0.6 → 100 points
  - MaxSim < 0.3 → Scaled 0-50
  - MaxSim 0.3-0.6 → Scaled 50-100

### Pillar B: Semantic Coherence (35%)
- Sliding window analysis between consecutive chunks
- Calculates flow score (average similarity)
- **Anti-Gaming**:
  - High variance (>0.15) → Score = 0
  - Repetitive content (>0.98 similarity) → Score = 0
  - Low coherence (<0.2) → 50% penalty

### Pillar C: Entity Density (20%)
- Counts capitalized words, dates, numbers
- Calculates uniqueness ratio
- Formula: `(TotalEntities / WordCount) × UniqueRatio × 100`

### Pillar D: Novelty (10%)
- Measures distance from Spam and Common anchors
- **Immediate Reject**: SpamDistance > 0.7
- Novelty = `1.0 - CommonSimilarity`

### Final Score
```
FinalScore = (Domain × 0.35) + (Coherence × 0.35) + (Entities × 0.20) + (Novelty × 0.10)
```

## 🚀 Usage

### Basic Usage

```tsx
import { QualityScanner } from '@/components/quality/QualityScanner';

export default function Page() {
  return <QualityScanner />;
}
```

### Using the Hook Directly

```tsx
import { useTextValuation } from '@/lib/hooks/useTextValuation';

function MyComponent() {
  const { isReady, isProcessing, result, valuate } = useTextValuation();

  const handleAnalyze = async () => {
    await valuate("Your text here...");
  };

  return (
    <div>
      {isReady ? (
        <button onClick={handleAnalyze} disabled={isProcessing}>
          Analyze
        </button>
      ) : (
        <p>Loading model...</p>
      )}
      
      {result && (
        <div>
          <h3>Score: {result.score}/100</h3>
          <p>Domain: {result.metadata.dominantDomain}</p>
        </div>
      )}
    </div>
  );
}
```

## 🔧 Configuration

### Model Settings

The worker uses `Xenova/all-MiniLM-L6-v2` (quantized) by default. To change:

```typescript
// In valuation.worker.ts
embeddingPipeline = await pipeline(
    'feature-extraction',
    'YOUR_MODEL_NAME',
    { quantized: true }
);
```

### Chunking Parameters

```typescript
// In vectorUtils.ts
chunkText(text, 512, 50); // chunkSize=512, overlap=50
```

### Anchor Centroids

**IMPORTANT**: The current anchors are mock data. Replace with real centroids:

1. Collect 100+ samples per domain
2. Generate embeddings using the same model
3. Calculate mean vector for each domain
4. Update `lib/ai/anchors.ts`

## 📱 Mobile Optimization

The system includes mobile fallback logic:

```typescript
// Check hardware
if (navigator.hardwareConcurrency < 4) {
  // Simplified processing:
  // - Skip chunking
  // - Analyze only first/last 500 tokens
  // - Reduce precision
}
```

## 🛡️ Edge Cases Handled

1. **Cipher Attack**: Returns NaN or low confidence → Flagged as "Noise"
2. **Empty Text**: Error message shown
3. **Repetitive Content**: Detected via variance check
4. **Spam Detection**: Immediate rejection if similarity > 0.7
5. **Model Loading Failure**: Graceful error handling

## 🎨 UI States

1. **Cold Start**: "Downloading Neural Engine (23MB)..."
2. **Processing**: Brain scan animation + progress bar
3. **Result**: Transparency card with breakdown
4. **Error**: Clear error message with retry button

## 📦 Dependencies

```json
{
  "@xenova/transformers": "^2.x",
  "compromise": "^14.x"
}
```

## 🔍 Transparency

All calculations are shown to users:
- Formula displayed in footer
- Individual pillar scores visible
- Metadata (chunks, similarity, flags) exposed
- No hidden scoring factors

## 🚧 Future Enhancements

1. **Real Centroids**: Replace mock anchors with trained centroids
2. **Custom Domains**: Allow users to define custom domain anchors
3. **Batch Processing**: Analyze multiple files simultaneously
4. **Advanced NLP**: Integrate compromise for better entity extraction
5. **PDF Support**: Add client-side PDF parsing
6. **Caching**: Cache embeddings for repeated analysis

## 📊 Performance

- **Cold Start**: 3-5s (model download, one-time)
- **Processing**: ~1-2s per 1000 words
- **Memory**: ~150MB (model + embeddings)
- **Thread**: Runs on Web Worker (non-blocking)

## 🔗 Demo

Access the demo at: `/quality-scanner`

## 📝 License

Part of the DataUnion V4 platform.
