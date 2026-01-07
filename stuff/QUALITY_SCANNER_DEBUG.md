# Testing Quality Scanner Integration

## Issue
The quality breakdown is not showing on the contribution confirmation page after submitting custom text.

## Expected Behavior
When a user submits custom text data:
1. The V4 Bulletproof semantic valuation should run
2. The confirmation page should show the 4-pillar breakdown
3. Tags, warnings, and transparency formula should be displayed

## Current Behavior
Only showing simple quality score (96%) without the detailed breakdown.

## Debugging Steps

### 1. Check Browser Console
Open browser DevTools (F12) and look for:
- "Starting semantic valuation..." log
- "Waiting for quality result..." logs
- "Quality result received:" log
- Any errors

### 2. Test the Quality Scanner Directly
Navigate to `/quality-scanner` and test with sample text to verify the engine works standalone.

### 3. Check State Updates
The issue is likely that `qualityResult` from `useTextValuation` hook is not updating in time.

## Potential Fixes

### Option A: Use Callback Pattern
Instead of polling for `qualityResult`, modify the hook to accept a callback:

```typescript
const { valuate } = useTextValuation({
  onComplete: (result) => {
    // Handle result here
  }
});
```

### Option B: Return Promise from valuate
Make `valuate` return a promise that resolves when complete:

```typescript
const result = await valuate(sampleData);
// Use result directly
```

### Option C: Use Separate Analysis Step
Add a "Step 3.5: Analyzing" between terms review and confirmation where the quality analysis happens with visible progress.

## Recommended Solution
**Option C** - Add explicit analysis step:
1. User accepts terms
2. Show "Analyzing Quality..." modal
3. Run semantic valuation
4. When complete, show confirmation with breakdown

This provides better UX and clearer state management.
