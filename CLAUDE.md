# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run dev          # Start development server (localhost:3000)
npm run build        # Production build
npm run lint         # Run ESLint
npm test             # Run all tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
npx prisma generate  # Generate Prisma client after schema changes
npx prisma db push   # Push schema to database
```

Run a single test file:
```bash
npm test -- __tests__/unit/data/prefectures.test.ts
```

## Architecture Overview

This is a Japanese election prediction system using a **3-AI pipeline**:

```
Perplexity (news/polls) → Grok (X/Twitter sentiment) → Gemini (structured JSON)
```

### Data Flow

1. **Cron trigger** (`/api/cron/update`) initiates update cycle
2. **Orchestrator** (`src/lib/analysis/orchestrator.ts`) coordinates ~177 API calls with 5-concurrent limit
3. **Analysis modules** process:
   - 1 national analysis (`overall.ts`)
   - 47 prefecture analyses (`prefecture.ts`)
   - 11 proportional block analyses (`proportional.ts`)
4. **Gemini** synthesizes AI outputs into validated JSON using Zod schemas
5. Results stored via Prisma to PostgreSQL

### Key Abstractions

- **AI Clients** (`src/lib/ai/`): Perplexity, Grok, Gemini wrappers with typed responses
- **Prompt Templates** (`src/lib/prompts/templates/`): 9 templates (3 per analysis type × 3 AI stages)
- **Template Engine** (`src/lib/prompts/engine.ts`): Variable substitution for prompts
- **Static Data** (`src/data/`): 47 prefectures, 289+ districts, 11 blocks, 10 parties

### Election Data Model

- **465 total seats**: 289 single-member districts + 176 proportional representation
- **233 seats** needed for majority
- Districts are generated from prefecture `districtCount` values
- Proportional blocks map to multiple prefectures

## Testing

Tests use **Vitest** with mocked fetch - no real API calls. Mocks are in `__tests__/mocks/`:
- `ai-responses.ts`: Mock AI API responses
- `prisma.ts`: Mock Prisma client

Path alias `@/` maps to `src/` in both source and tests.

## Environment Variables

Required for runtime (not tests):
- `PERPLEXITY_API_KEY`, `XAI_API_KEY`, `GEMINI_API_KEY`
- `DATABASE_URL` (PostgreSQL)
- `CRON_SECRET` (for `/api/cron/update` auth)

## Important Patterns

- **Zod schemas** in `src/lib/ai/gemini.ts` define AI output structure
- **Server Components** by default; pages fetch data server-side
- **Dynamic routes**: `/prefecture/[id]` generates 47 static pages via `generateStaticParams`
- Japanese text throughout UI components and prompts
