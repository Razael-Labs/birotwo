# Design Document: AI Model Tiers for OpenRouter, Groq, and Gemini

## Objective
Support two tiers of AI models (Free and Paid) for the OpenRouter, Groq, and Gemini providers in Biro2. This allows users to easily switch between cost-effective free models and high-performance paid models.

## Proposed Changes

### 1. Environment Configuration (`.env`)
Introduce a new environment variable `AI_TIER` to toggle between free and paid models.
- `AI_TIER=1`: Use free models (default).
- `AI_TIER=2`: Use paid models.

Update `.env.example` to include this variable and document the models for each provider.

### 2. AI Utility (`src/utils/ai.ts`)
Modify the `fetchSarcasm` function and provider-specific calls to respect the `AI_TIER` setting.

#### Default Models per Provider & Tier

| Provider | Tier 1 (Free) | Tier 2 (Paid) |
| :--- | :--- | :--- |
| **OpenRouter** | `openrouter/mimo-v2-pro:free` | `anthropic/claude-3.5-sonnet` |
| **Groq** | `llama-3.3-70b-versatile` | `llama-3.1-405b-reasoning` |
| **Gemini** | `gemini-1.5-flash` | `gemini-1.5-pro` |

#### Logic Flow
1. Read `PROVIDER` and `AI_TIER` from `process.env`.
2. Determine the default model based on the selected provider and tier.
3. Allow overrides via existing `*_MODEL` environment variables if they are set.

### 3. User Interface
No changes are required to the UI, as it already displays the provider name. The `Footer` component will automatically use the configured tier.

## Verification Plan
1. Set `AI_TIER=1` and verify that free models are used (check via logs or behavior if possible).
2. Set `AI_TIER=2` and verify that paid models are used.
3. Verify that manual overrides (`OPENROUTER_MODEL`, etc.) still work and take precedence.
