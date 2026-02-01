# GitHub Actions: Ingest edX

## Manual run
- Go to **Actions** → **Ingest edX** → **Run workflow**.

## What it does
- Installs dependencies with pnpm.
- Runs `pnpm ingest:edx` to generate `data/normalized/courses.json`.
- Runs `pnpm validate:data` to validate the generated data against the schema.

## What it does NOT do
- It does **not** commit or push dataset changes back to the repository.
