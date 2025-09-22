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
- [x] Configure Supabase project (auth, Postgres schema, storage buckets).
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

## Supabase Schema Plan
- `profiles`: auth-linked user info (`id uuid primary key references auth.users.id`, `display_name`, `square_customer_id`, `subscription_tier`, timestamps).
- `printers`: per-user printer catalog (`id uuid pk`, `user_id` FK to profiles, manufacturer, model, nozzle_size, notes).
- `print_settings`: snapshot of slicer inputs (`id uuid pk`, `printer_id`, basic parameters like `material`, `layer_height`, `nozzle_temp`, `bed_temp`, `print_speed`, `infill`, `notes`).
- `print_jobs`: uploaded print instances (`id uuid pk`, `user_id`, optional `printer_id`, `settings_id`, `image_path`, `status`, `analysis_requested_at`, timestamps).
- `analysis_results`: AI output tied to `print_jobs` (`id uuid pk`, `print_job_id`, `vision_summary`, `recommendations`, `confidence_scores jsonb`, `model_version`, `duration_ms`).
- `usage_ledger`: tracks credits/subscription usage (`id uuid pk`, `user_id`, `change int`, `reason`, `square_invoice_id`, timestamps).
- `affiliate_links`: curated hardware adjustments (`id uuid pk`, `printer_match jsonb`, `title`, `url`, `notes`, `is_sponsored`).
- Policies: enable RLS; users can CRUD their own resources. Service role handles system writes (webhooks, workers). Public access limited to signed URLs for storage.
- Storage buckets: `print-uploads` (private, user-owned) and `analysis-reports` (private) with policies to allow read/write via signed URLs.
