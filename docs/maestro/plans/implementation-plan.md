# Implementation Plan: AI Model Tiers

This plan implements support for free and paid model tiers for OpenRouter, Groq, and Gemini.

## Phases

### Phase 1: Environment Configuration
- **Task**: Update `.env.example` to include `AI_TIER` and updated model documentation.
- **Agent**: `technical_writer`
- **Files**: `.env.example`

### Phase 2: Logic Implementation
- **Task**: Update `src/utils/ai.ts` to implement tier-based model selection.
- **Agent**: `coder`
- **Files**: `src/utils/ai.ts`

### Phase 3: Validation
- **Task**: Create a test script to verify that the correct models are selected based on `AI_TIER`.
- **Agent**: `tester`
- **Files**: `src/utils/ai_test.ts` (new)
