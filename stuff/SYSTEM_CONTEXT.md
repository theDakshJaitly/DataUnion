# Full System + Hackathon Context

## Project Purpose
This is a **hackathon prototype** designed to demonstrate a transparent, consent-driven data economy between individual contributors and AI companies.

## Evaluation Context
- **Asynchronous review via GitHub submission** - No live demo
- **Self-explanatory** - Must be understandable without prior explanation
- **Judge-friendly** - Clean onboarding, guided walkthrough, intuitive dashboards

## Scope Boundaries

### ✅ In Scope
- Mock data and simulated actions
- Demo flows demonstrating end-to-end system
- Production-ready structure and flow
- Clean routing and stable APIs
- Consistent data models
- Clear narrative coherence

### ❌ Out of Scope
- Real authentication
- Real payments or payment processing
- Production-scale infrastructure
- Feature depth over clarity
- Complex user management

## Design Principles

### 1. Self-Explanatory System
- Clean onboarding flows
- Guided walkthrough mode
- Intuitive dashboards
- Clear visual hierarchy

### 2. Clarity and Traceability
Every screen should answer: **"Why does this exist in the system?"**

If a screen doesn't move data through this pipeline, it doesn't belong:
```
Contributor → Dataset → License → Log → Payout
```

### 3. Narrative Coherence
The system tells a story:
1. **Problem**: Opaque, non-consensual AI data sourcing
2. **Solution**: Data unions with consent and transparency
3. **Demonstration**: End-to-end flow from contribution to payout

### 4. Production-Ready Structure
- Feels like a real product
- Clean separation of concerns
- Scalable architecture (even if using mock data)
- Professional UI/UX

## Landing Page as Critical Entry Point

The landing page is **not marketing fluff** - it's part of the product logic.

### Must Include:
1. **Problem Statement** - Non-consensual data usage, legal risks for AI companies
2. **Solution Introduction** - What is a data union?
3. **Three Clear Paths**:
   - 👤 **Contributor** - I want to share data
   - 🏢 **AI Company** - I want to license data
   - 🎯 **Demo Walkthrough** - Show me how this works

### Purpose:
Sets expectations that this is a complete **system**, not a single app flow.

## Target Audience
Hackathon judges who will:
- Review the GitHub repository
- Explore the application independently
- Need to quickly understand the concept and execution
- May test functionality with their own uploads

## Success Criteria
Judges should be able to:
1. Understand the problem and solution within 2 minutes
2. Navigate both contributor and company flows independently
3. See the complete lifecycle: contribution → consent → licensing → audit → payout
4. Appreciate the system-level thinking around ethical AI data sourcing
5. Optionally test with their own uploads

## Development Guardrails

### Don't:
- Prematurely add authentication
- Implement real payment processing
- Over-optimize performance
- Build features that don't support the core narrative

### Do:
- Make everything explorable without instructions
- Use mock data that demonstrates best-case scenarios
- Keep flows simple and linear
- Focus on visual clarity and transparency
- Support custom uploads alongside demo flows
