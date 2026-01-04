# Execution Plan - Data Union Prototype

## Tech Stack Recommendation

### Frontend
**Next.js 14+ (App Router)**
- ✅ Production-ready structure
- ✅ Built-in routing
- ✅ Server and client components
- ✅ Easy deployment (Vercel)
- ✅ TypeScript support

### Styling
**Tailwind CSS**
- ✅ Rapid development
- ✅ Modern, premium aesthetics
- ✅ Consistent design system
- ✅ Dark mode support

### State Management
**React Context + Supabase**
- ✅ Real-time state updates
- ✅ Type-safe queries
- ✅ Easy to seed with mock data
- ✅ Persistent across devices/sessions

### Data Storage
**Supabase (PostgreSQL)**
- ✅ Production-ready database
- ✅ Free tier (generous limits)
- ✅ Auto-generated TypeScript types
- ✅ RESTful API + real-time subscriptions
- ✅ Easy seeding with SQL scripts
- ✅ Supports custom uploads from judges
- ✅ Row-level security (if needed)

### Backend
**Next.js API Routes + Supabase Client**
- ✅ Same codebase
- ✅ Server-side Supabase queries
- ✅ Client-side Supabase queries
- ✅ Type-safe with auto-generated types

---

## Phased Development Approach

### Phase 1: Foundation & Landing
**Goal**: Create entry point and set up project structure

#### Tasks:
1. ✅ Initialize Next.js project with TypeScript + Tailwind
2. ✅ Set up project structure and routing
3. ✅ Define TypeScript interfaces for all 7 data models
4. ✅ Create mock data seed files
5. ✅ Build Landing Page:
   - Problem statement section
   - Data union explanation
   - Three CTAs: Contributor / Company / Demo Walkthrough
   - Premium, modern design with animations

**Deliverable**: Self-explanatory landing page with routing to main flows

---

### Phase 2: Contributor Flow
**Goal**: Complete contributor experience from onboarding to transparency

#### Tasks:
1. **Contributor Login Screen** (simple name entry)
2. **Onboarding Flow** (4 steps):
   - What is a Data Union?
   - What Data Can Be Contributed?
   - How Consent Works
   - How You're Compensated
3. **Contributor Dashboard**:
   - Total datasets contributed
   - Average quality score
   - Total earnings (simulated)
   - Quick actions (contribute more, view logs)
4. **Data Contribution Flow**:
   - Choose: Demo Contribution vs Custom Upload
   - Select data type and domain
   - Review usage terms
   - Explicit consent screen
   - Confirmation and dataset creation
5. **Transparency Log**:
   - List of contributor's datasets
   - Licensing events (who, when, why)
   - Quality scores
   - Payout records

**Deliverable**: Fully functional contributor experience

---

### Phase 3: Company Flow
**Goal**: Complete company experience from onboarding to licensing

#### Tasks:
1. **Company Login Screen** (simple company name entry)
2. **Company Onboarding Flow** (3 steps):
   - How Datasets Are Structured
   - How Licensing Works
   - How Consent & Compliance Work
3. **Dataset Marketplace**:
   - Grid/list view of all datasets
   - Filterable by domain, data type, price
   - Key metadata visible (quality, price, consent scope)
4. **Dataset Detail Page**:
   - Full metadata display
   - Dataset composition
   - Licensing terms
   - Auditability guarantees
   - "License This Dataset" CTA
5. **License Simulation Flow**:
   - Select intended use
   - Review pricing breakdown
   - See payout distribution to contributors
   - Confirm license
   - Generate license record + audit ID
6. **Company Dashboard**:
   - Licensed datasets list
   - Usage history timeline
   - Consent scope summary
   - Audit reference IDs
   - Aggregate spend and payouts

**Deliverable**: Fully functional company experience

---

### Phase 4: Cross-System Integration
**Goal**: Connect contributor and company flows with live updates

#### Tasks:
1. **State Management**:
   - Set up global context for all data models
   - Implement create/read/update operations
   - Sync to localStorage for persistence
2. **Licensing Side Effects**:
   - When company licenses dataset:
     - Create License record
     - Create UsageLog entry
     - Create PayoutRecords for all contributors
     - Update contributor totalEarnings
     - Update company totalSpend
3. **Cross-Flow Visibility**:
   - Contributor sees new licensing events in transparency log
   - Company sees updated spend/audit trails
   - Dataset shows updated stats (times licensed, etc.)

**Deliverable**: Fully connected system with data flowing between roles

---

### Phase 5: Demo Walkthrough Mode
**Goal**: Guided tour of the entire system for judges

#### Tasks:
1. **Walkthrough Shell**:
   - Step-by-step guided tour
   - Progress indicator
   - Narrative explanations
   - "Next" / "Previous" navigation
2. **Walkthrough Steps**:
   - **Step 1**: Problem Introduction
   - **Step 2**: Solution Overview (Data Union concept)
   - **Step 3**: Contributor Journey
     - Show onboarding
     - Demo data contribution
     - Show consent mechanism
   - **Step 4**: Dataset Marketplace
     - Browse datasets
     - View metadata and pricing
   - **Step 5**: Company Licensing
     - Select dataset
     - Review terms
     - Simulate license
   - **Step 6**: Transparency & Audit
     - Show contributor seeing payout
     - Show company audit trail
     - Show complete data flow
   - **Step 7**: Call to Action
     - Try as Contributor
     - Try as Company
     - View GitHub
3. **Embedded Screenshots/Previews**:
   - Show actual UI components
   - Highlight key features
   - Use real mock data

**Deliverable**: Complete guided walkthrough accessible from landing page

---

### Phase 6: Polish & Documentation
**Goal**: Production-ready presentation for judges

#### Tasks:
1. **UI/UX Polish**:
   - Consistent spacing and typography
   - Smooth transitions and animations
   - Responsive design (desktop + tablet)
   - Dark mode theming
   - Loading states and error handling
2. **README.md**:
   - Project overview
   - How to run locally
   - Architecture overview
   - Tech stack explanation
   - Screenshots and walkthrough
3. **Code Quality**:
   - Clean up console logs
   - Add comments for clarity
   - Consistent naming conventions
   - Remove unused code
4. **Deployment**:
   - Deploy to Vercel
   - Test deployed version
   - Ensure all flows work in production

**Deliverable**: Polished, deployable prototype with excellent documentation

---

## Folder Structure

```
/DataUnion
├── /app
│   ├── page.tsx                    # Landing page
│   ├── layout.tsx                  # Root layout
│   ├── /contributor
│   │   ├── login/page.tsx
│   │   ├── onboarding/page.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── contribute/page.tsx
│   │   └── transparency/page.tsx
│   ├── /company
│   │   ├── login/page.tsx
│   │   ├── onboarding/page.tsx
│   │   ├── marketplace/page.tsx
│   │   ├── dataset/[id]/page.tsx
│   │   └── dashboard/page.tsx
│   └── /walkthrough
│       └── page.tsx
├── /components
│   ├── /contributor
│   ├── /company
│   ├── /shared
│   └── /walkthrough
├── /lib
│   ├── types.ts                    # TypeScript interfaces for data models
│   ├── mockData.ts                 # Seed data
│   ├── context.tsx                 # Global state management
│   └── utils.ts                    # Helper functions
├── /public
│   └── /assets
├── SYSTEM_CONTEXT.md
├── DATA_MODELS.md
├── CONTRIBUTOR_SPEC.md
├── COMPANY_SPEC.md
├── EXECUTION_PLAN.md
└── README.md
```

---

## Key Design Principles for Each Phase

### Visual Excellence
- **Premium aesthetics**: Modern gradients, glassmorphism, smooth animations
- **Dark mode first**: Professional, reduces eye strain
- **Micro-interactions**: Hover effects, transitions, loading states
- **Typography**: Modern fonts (Inter, Outfit) not browser defaults

### User Experience
- **Self-explanatory**: No instructions needed
- **Progressive disclosure**: Don't overwhelm with information
- **Clear CTAs**: Always obvious what to do next
- **Feedback loops**: Confirm actions, show success states

### Data Integrity
- **Type safety**: TypeScript everywhere
- **Validation**: Ensure data conforms to models
- **Consistency**: Same data structure throughout app
- **Traceability**: Every action creates audit trail

---

## Development Commands

```bash
# Initialize project
npx create-next-app@latest DataUnion --typescript --tailwind --app

# Run development server
npm run dev

# Build for production
npm run build

# Deploy to Vercel
vercel deploy
```

---

## Success Metrics

Before considering a phase complete, verify:

✅ **Functionality**: All interactions work as expected  
✅ **Visual Quality**: Looks premium and modern  
✅ **Clarity**: Purpose is immediately obvious  
✅ **Data Flow**: Changes propagate correctly across system  
✅ **Type Safety**: No TypeScript errors  
✅ **Responsiveness**: Works on different screen sizes  
✅ **Performance**: Fast page loads, smooth animations  

---

## Timeline Estimate

- **Phase 1** (Foundation & Landing): 2-3 hours
- **Phase 2** (Contributor Flow): 4-5 hours
- **Phase 3** (Company Flow): 4-5 hours
- **Phase 4** (Integration): 2-3 hours
- **Phase 5** (Walkthrough): 3-4 hours
- **Phase 6** (Polish): 2-3 hours

**Total**: ~20-25 hours for complete prototype

---

## What Makes This Excellent

1. **Clear Narrative**: Problem → Solution → Demonstration
2. **System Thinking**: Not just UI, but complete data model
3. **Judge-Friendly**: Self-explanatory with guided walkthrough
4. **Production-Ready Structure**: Scalable, clean, professional
5. **Ethical Focus**: Consent, transparency, fair value distribution
6. **Technically Sound**: Type-safe, well-architected, documented
