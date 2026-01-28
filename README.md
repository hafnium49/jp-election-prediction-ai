# Japan Election Prediction System

> **DISCLAIMER:** This project is an unofficial, open-source implementation of an election prediction pipeline. It is **not** affiliated with, endorsed by, or connected to Horiemon AI Gakko KK or the official vote.horiemon.ai project. All code and prompts in this repository are original implementations.

Japanese House of Representatives election prediction system using a 3-AI pipeline (Perplexity + Grok + Gemini).

## Overview

This system predicts outcomes for the 2026 Japanese general election (第51回衆議院議員総選挙) by analyzing:
- **289 single-member districts** across 47 prefectures
- **176 proportional representation seats** across 11 regional blocks
- **465 total seats** (233 needed for majority)

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma 6
- **Testing**: Vitest
- **Deployment**: Vercel
- **AI APIs**: Perplexity, Grok (xAI), Gemini

## How It Works

The prediction pipeline runs 3x daily and processes each analysis target through three AI stages:

1. **Perplexity** - Searches news and polling data for factual context
2. **Grok** - Analyzes X/Twitter sentiment and social trends
3. **Gemini** - Synthesizes inputs into structured JSON predictions

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Perplexity │────▶│    Grok     │────▶│   Gemini    │
│  (News/Polls)│     │ (X Sentiment)│     │ (Synthesis) │
└─────────────┘     └─────────────┘     └─────────────┘
```

**Per update cycle:**
- 1 national analysis
- 47 prefecture analyses
- 11 proportional block analyses
- ~177 total API calls (5 concurrent)

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- API keys for Perplexity, xAI (Grok), and Google (Gemini)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/jp-election-prediction-ai.git
cd jp-election-prediction-ai

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys and database URL

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# Start development server
npm run dev
```

### Environment Variables

```bash
# AI API Keys (required)
PERPLEXITY_API_KEY=pplx-xxxx
XAI_API_KEY=xai-xxxx
GEMINI_API_KEY=AIza-xxxx

# Database (required)
DATABASE_URL=postgresql://user:password@localhost:5432/election_prediction

# Cron Security (required for production)
CRON_SECRET=your-secret-token

# Optional
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

## Project Structure

```
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── page.tsx              # Homepage - seat overview
│   │   ├── prefecture/[id]/      # 47 prefecture pages
│   │   ├── proportional/         # PR block breakdown
│   │   ├── how-it-works/         # Methodology
│   │   └── api/
│   │       ├── predictions/      # Fetch predictions
│   │       └── cron/update/      # Trigger updates
│   │
│   ├── lib/
│   │   ├── ai/                   # API clients
│   │   ├── analysis/             # Prediction pipelines
│   │   ├── prompts/templates/    # 9 prompt templates
│   │   └── db/                   # Prisma queries
│   │
│   ├── data/                     # Static election data
│   │   ├── prefectures.ts        # 47 prefectures
│   │   ├── districts.ts          # 289 districts
│   │   ├── blocks.ts             # 11 PR blocks
│   │   └── parties.ts            # 10 parties
│   │
│   └── components/               # React components
│       ├── layout/               # Header, Footer
│       ├── map/                  # Japan map
│       ├── charts/               # Visualizations
│       └── cards/                # Prediction cards
│
├── __tests__/                    # Unit tests (Vitest)
│   ├── mocks/                    # Mock AI responses & Prisma
│   └── unit/                     # Test files
│
└── prisma/                       # Database schema
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/predictions` | GET | Fetch latest prediction data |
| `/api/cron/update` | GET | Trigger full update (requires auth) |

### Triggering Manual Update

```bash
curl -H "Authorization: Bearer YOUR_CRON_SECRET" \
  https://your-domain.vercel.app/api/cron/update
```

## Pages

- `/` - Homepage with national seat projection and map
- `/prefecture/[id]` - Prefecture detail (e.g., `/prefecture/tokyo`)
- `/proportional` - 11 proportional block breakdown
- `/how-it-works` - Full methodology explanation

## Database Schema

- **Prediction** - Raw AI responses and parsed JSON
- **DistrictPrediction** - Per-district winner predictions
- **ProportionalPrediction** - Per-block seat allocations
- **OverallAnalysis** - National trends and projections
- **UpdateLog** - Cron run tracking

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Lint code
npm run lint
```

## Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

**Test Coverage:** 148 tests across 8 test files

| Test Suite | Tests |
|------------|-------|
| Data utilities (prefectures, districts, parties, blocks) | 79 |
| Prompt engine | 26 |
| AI clients (Perplexity, Grok, Gemini) | 43 |

All tests use mocked API responses - zero external API calls.

## Deployment

Deploy to Vercel with automatic cron scheduling:

```bash
vercel deploy
```

The `vercel.json` configures updates at:
- 06:00 JST (21:00 UTC)
- 12:00 JST (03:00 UTC)
- 18:00 JST (09:00 UTC)

## Cost Estimates

- ~177 API calls per update
- 3x daily = ~531 calls/day
- Estimated: $18-33/day depending on API pricing

## License

MIT

