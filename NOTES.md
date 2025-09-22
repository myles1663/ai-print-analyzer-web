# Project Notes

## Context
- Project: AI 2D Print Analyzer web app providing diagnostic feedback for 3D prints.
- Tech Stack: Next.js 14 (TypeScript, App Router), Tailwind CSS, Supabase (Postgres/Auth/Storage), background worker (Fly.io or Render) for queued analyses.
- AI Providers: Hugging Face Inference for vision models, Cohere/Mistral for text recommendations, with plan for future fine-tuned model.
- Monetization: Freemium tier, Square-powered subscriptions, optional credit packs, and light affiliate recommendations.

## Decisions & Assumptions
- Host Next.js app on Vercel with GitHub integration; use Supabase for data and storage.
- Manage uploads via Supabase Storage with signed URLs and resumable uploads (tus).
- Queue long-running analyses using Upstash/BullMQ or Supabase Edge Functions triggering workers.
- Version control: GitHub repository (trunk-based), protected `main`, feature branches merged via PR with CI (lint/test/build) before deploy.

## Checklists

### MVP Delivery
- [ ] Configure Supabase project (auth, Postgres schema, storage buckets).
- [ ] Build auth + printer profile capture UI.
- [ ] Implement image upload with metadata (printer model, settings).
- [ ] Connect baseline AI inference pipeline (vision + text suggestions).
- [ ] Display analysis results with actionable tips and history view.

### Square Integration
- [ ] Create Square developer application (sandbox & production keys).
- [ ] Implement subscription checkout flow and plan mapping.
- [ ] Store Square customer IDs and subscription status in Postgres.
- [ ] Process Square webhooks for subscription lifecycle events.
- [ ] Enforce usage limits / credits based on plan tier.

### Operational Readiness
- [ ] Set up GitHub Actions (lint, test, build) and Vercel preview deploys.
- [ ] Add monitoring/analytics (Vercel Analytics, Sentry, Supabase logs).
- [ ] Draft privacy policy & terms for image handling and data retention.
- [ ] Prepare marketing landing page and onboarding emails.
