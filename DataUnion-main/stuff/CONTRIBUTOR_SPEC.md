# Contributor Side Specification

## Overview
The contributor side of the Data Union platform enables individuals to contribute datasets under explicit, revocable consent, with full transparency into how their data is used and how value is distributed back to them.

## User Flow

### 1. Entry Point
- **Contributor Login** (no real authentication required for prototype)
- Simple entry screen to identify as a contributor

### 2. Onboarding Flow
A short, educational flow that covers:
- **What is a Data Union?** - Explanation of the concept
- **What Data Can Be Contributed?** - Types of acceptable datasets
- **How Consent Works** - Clear explanation of consent mechanisms
- **How Contributors Are Compensated** - Value distribution model

### 3. Contributor Dashboard
Main hub showing:
- **Contribution Status** - Overview of active contributions
- **Total Contributed Datasets** - Count of datasets shared
- **Quality Scores** - Assessment of data quality
- **Simulated Earnings** - Mock payout calculations

### 4. Data Contribution Flow

#### Two Contribution Modes:
1. **Guided Demo Contribution** (Primary for prototype)
   - Uses preloaded sample data
   - Demonstrates end-to-end process clearly
   - Shows best-case scenario flow

2. **Custom Upload** (Optional)
   - Allows flexibility
   - Shows system can handle various inputs
   - Demonstrates extensibility

#### Contribution Steps:
1. **Select Data Type** - Choose category/domain of data
2. **Review Usage Terms** - See how data may be used
3. **Explicit Consent Approval** - Dedicated consent screen with clear opt-in

### 5. Transparency Log
After licensing events occur on the company side, contributors can view:
- **Which datasets were licensed** - Specific dataset identifiers
- **Licensed by whom** - Which company/organization
- **For what purpose** - Intended use case
- **Quality Scoring** - Assessment metrics
- **Payout Calculations** - Simulated value distribution

## Core Principles

### Legibility
- Make data ownership clear and understandable
- Avoid technical jargon
- Use clear, simple language

### Transparency
- Show complete lifecycle of data
- Full visibility into licensing events
- Clear audit trail

### Consent
- Explicit opt-in required
- Revocable at any time
- Clear explanation of usage scope

### Value Distribution
- Transparent payout calculations
- Show quality-based pricing
- Demonstrate fair compensation model

### Clarity Over Complexity
- Simple, intuitive interfaces
- Progressive disclosure of information
- Focus on understanding, not features

## Implementation Notes
- All data is **mock/simulated**
- No real authentication required
- No real payment processing
- Focus on demonstrating the **complete lifecycle**
- Should feel **production-ready** in structure but use simulated actions
