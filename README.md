# Rift Rewind — League Player Insights Agent (AWS Bedrock)

Rift Rewind turns League end-of-game match data into personal, actionable, and shareable end‑of‑year recaps using AWS Bedrock. It surfaces strengths, flags growth areas, visualizes progress, and generates a narrative recap players love to share.

## Quickstart

1) Install deps and build all

```bash
npm install
npm -w @rr/insights run build
npm -w @rr/api run build
npm -w @rr/web run build
```

2) Configure environment

Copy `.env.example` to `.env` at repo root and edit as needed. For web, copy `apps/web/.env.local.example` to `apps/web/.env.local`.

Key vars:
- `AWS_REGION` — e.g. `us-east-1`
- `BEDROCK_MODEL_ID` — e.g. `anthropic.claude-3-5-sonnet-20240620-v1:0`
- Standard AWS credentials apply (env vars, profiles, or instance roles)

3) Run services (two terminals)

```bash
# Terminal A: API
npm -w @rr/api run dev

# Terminal B: Web
npm -w @rr/web run dev
```

Open the web at http://localhost:3000. Set `MOCK=1` in `apps/web/.env.local` to load `public/sample-season.json`.

## How it works

- `packages/insights`: deterministic analysis of Full‑Year Match History. Computes season aggregates, champion and role breakdowns, and weekly KDA trend; returns insight cards.
- `services/api`: Express service that accepts a dataset (`/insights`) and optionally calls Amazon Bedrock to generate a recap (`/recap`).
- `apps/web`: Next.js UI to upload JSON, preview insights, get a Bedrock recap, and share.

### Core insight categories
- Season overview: games, win rate, KDA, averages
- Favorite champion: most‑played with win rate and KDA
- Best role: top win‑rate role
- Weekly trend: KDA time‑series

### Recap generation (AWS Bedrock)
`/recap` sends the cards to Bedrock (Claude 3.5 Sonnet by default) via `Converse`, with a system prompt tuned for empathetic coaching and 2–3 specific improvement tips.

## Submission checklist
- Public URL to app (deploy API and web to your infra)
- Public repo with MIT license
- 3‑minute demo video
- Methodology write‑up: see below

## Methodology write‑up

Approach: Start with reliable, interpretable metrics (win rate, KDA, champion/role mix, trend). Convert to insight cards with clear, player‑facing language. Use Bedrock to weave a narrative recap that emphasizes strengths and targeted improvements.

Data: Uses the provided Full‑Year Match History (end‑of‑game stats per match, single participant). No PII beyond `puuid` and summoner name; client upload keeps user in control.

Insight logic highlights:
- Guarded denominators (no div‑by‑zero) and weekly bucketing for trend stability
- Champion/role aggregation sorted by volume; best role by win rate
- Share‑ready strings that compress key takeaways

AWS services:
- Amazon Bedrock (Claude 3.5 Sonnet) for recap text via `Converse`
- Optional: Host API on AWS (App Runner/Lambda + API Gateway) and front‑end on Amplify or S3+CloudFront

## Dev notes
- Type‑safe schemas with `zod` in API
- Build order: `@rr/insights` → API → Web
- Mock mode for offline demo

## License
MIT
