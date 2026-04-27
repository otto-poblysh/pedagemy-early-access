# Pedagemy Early Access

A simple Next.js app for the Pedagemy early access landing page, registration flow, and private admin export view.

## Environment

Copy `.env.example` to `.env.local` and fill in the secrets before running the app:

```bash
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
PEDAGEMY_ADMIN_EMAIL=admin@pedagemy.com
PEDAGEMY_ADMIN_PASSWORD=change-this-password
RESEND_API_KEY=optional-for-confirmation-emails
```

The app now stores registrations in Supabase. The admin login remains app-managed and reads the admin credentials from `PEDAGEMY_ADMIN_EMAIL` and `PEDAGEMY_ADMIN_PASSWORD`, defaulting to the previous local credentials if you do not override them. `SUPABASE_URL` falls back to `NEXT_PUBLIC_SUPABASE_URL` when needed, but `SUPABASE_SERVICE_ROLE_KEY` must be set for server-side writes.

## Supabase Schema

Apply the SQL in [supabase/registrations.sql](/Users/akamaotto/code/pedagemy-early-access/supabase/registrations.sql) to your Supabase project before submitting registrations. It creates the `registrations` table, enforces unique emails, and enables RLS on the exposed table.

## Development

```bash
bun install
bun dev
```

The app runs from the project root. Common checks:

```bash
bun run lint
bun run typecheck
bun run test
bun run build
```
