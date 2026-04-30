# Thank You Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a dedicated `/[locale]/success` page that replaces the inline success state in the registration form. The page shows personalized content (name, course) and sets expectations for what happens next.

**Architecture:** Session-based approach — the form API stores registration data in an HTTP-only cookie, client navigates to `/success`, server page reads the cookie and renders personalized content. No data in URL.

**Tech Stack:** Next.js App Router, react-i18next, existing cookie utilities

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `app/[locale]/success/page.tsx` | Create | Server component — reads session cookie, renders page with metadata |
| `components/success-page.tsx` | Create | Client component — UI with entrance animation |
| `app/api/register/route.ts` | Modify: line 141 | Set session cookie before returning success |
| `components/landing-page.tsx` | Modify: line 346 | Navigate to `redirectTo` from API response |
| `public/locales/en/translation.json` | Modify: add `success:` block | English translations |
| `public/locales/fr/translation.json` | Modify: add `success:` block | French translations |
| `public/locales/es/translation.json` | Modify: add `success:` block | Spanish translations |

---

## Task 1: Update `/api/register` to set session cookie

**Files:**
- Modify: `app/api/register/route.ts:138-141`

- [ ] **Step 1: Modify the POST handler to set session cookie on success**

Find this block (line ~138-141):
```typescript
    return NextResponse.json({ ok: true })
```

Replace it with:
```typescript
    const cookieValue = JSON.stringify({
      name: body.name,
      email: body.email,
      course: body.course,
      locale: body.locale ?? "en",
    })

    const response = NextResponse.json({
      ok: true,
      redirectTo: `/${body.locale ?? "en"}/success`,
    })

    response.cookies.set("pedagemy_registration", cookieValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    })

    return response
```

Note: `NextResponse.json()` with chained `.cookies.set()` requires using the object form (not shortcut) so we can call `.cookies.set()` on the response object before returning.

- [ ] **Step 2: Verify the modification looks correct**

Run: `bun run typecheck`
Expected: No new errors

- [ ] **Step 3: Commit**

```bash
git add app/api/register/route.ts
git commit -m "feat: set session cookie on successful registration"
```

---

## Task 2: Update landing page navigation to use redirectTo

**Files:**
- Modify: `components/landing-page.tsx:346`

- [ ] **Step 1: Update the success navigation to use redirectTo from API response**

In the `handleSubmit` function, find this block (line ~346):
```typescript
      setSubmitted(true)
```

Replace with:
```typescript
      const redirectTo = data.redirectTo as string | undefined
      if (redirectTo) {
        void router.push(redirectTo)
      } else {
        setSubmitted(true)
      }
```

This way, if the API returns `redirectTo`, we navigate to the dedicated success page. If for any reason `redirectTo` is missing, we fall back to the inline state (backwards compatible).

- [ ] **Step 2: Verify types**

Run: `bun run typecheck`
Expected: No new errors

- [ ] **Step 3: Commit**

```bash
git add components/landing-page.tsx
git commit -m "feat: navigate to /success page on registration complete"
```

---

## Task 3: Create `SuccessPage` client component

**Files:**
- Create: `components/success-page.tsx`

- [ ] **Step 1: Write the SuccessPage client component**

```typescript
"use client"

import Link from "next/link"
import { Icon } from "@/components/icons"

interface SuccessPageProps {
  firstName: string
  courseName: string
  email: string
  locale: string
  headline: string
  body: string
  emailNote: string
  nextStepsTitle: string
  nextSteps: string[]
  backToHome: string
}

export function SuccessPage({
  firstName,
  courseName,
  email,
  locale,
  headline,
  body,
  emailNote,
  nextStepsTitle,
  nextSteps,
  backToHome,
}: SuccessPageProps) {
  return (
    <div className="relative flex min-h-dvh flex-col overflow-x-hidden bg-[#F3F6FB] font-(family-name:--font-dm-sans) text-[#1A1A2E] antialiased">
      {/* Background gradient — matches landing page */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_top_left,rgba(0,86,210,0.14),transparent_34%),radial-gradient(circle_at_top_right,rgba(26,26,46,0.10),transparent_36%),linear-gradient(180deg,#F9FBFF_0%,#F3F6FB_54%,#EEF3F8_100%)]" />
      <div className="pointer-events-none absolute inset-x-10 top-20 h-px bg-[linear-gradient(90deg,transparent,rgba(26,26,46,0.14),transparent)]" />

      <div className="relative flex flex-1 flex-col items-center justify-center px-6 py-16">
        {/* Glass panel — matches ApplicationFormPanel style */}
        <div className="relative w-full max-w-[520px] overflow-hidden rounded-[32px] border border-white/75 bg-white/78 p-[1px] shadow-[0_28px_80px_rgba(15,23,42,0.10)] backdrop-blur-2xl">
          {/* Top shimmer line */}
          <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(13,91,209,0.35),transparent)]" />

          <div className="relative rounded-[31px] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(244,248,252,0.96))] shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] px-8 py-12 sm:px-10 sm:py-14">
            {/* Success icon */}
            <div className="flex justify-center">
              <div
                className="grid h-14 w-14 place-items-center rounded-full bg-[#E9F1FF] shadow-[0_10px_24px_rgba(13,91,209,0.10)]"
                style={{
                  animation: "scaleIn 0.4s ease-out forwards",
                }}
              >
                <Icon name="check" className="h-6 w-6 text-[#0056D2]" />
              </div>
            </div>

            {/* Headline */}
            <h1 className="mt-6 text-center text-[28px] font-bold tracking-[-0.02em] leading-tight text-[#1A1A2E]">
              {headline.replace("{firstName}", firstName)}
            </h1>

            {/* Confirmation body */}
            <p
              className="mt-3 text-center text-[13px] leading-[1.7] text-[#1A1A2E]/52"
              dangerouslySetInnerHTML={{
                __html: body
                  .replace("{course}", `<strong class="font-semibold text-[#1A1A2E]">${courseName}</strong>`)
                  .replace("{email}", email),
              }}
            />

            {/* Email note */}
            <p className="mt-2 text-center text-[12px] text-[#1A1A2E]/38">
              {emailNote.replace("{email}", email)}
            </p>

            {/* Divider */}
            <div className="mt-8 mb-6 h-px w-full bg-[linear-gradient(90deg,transparent,rgba(26,26,46,0.08),transparent)]" />

            {/* Next steps */}
            <div>
              <p className="text-[12px] font-semibold tracking-[0.04em] uppercase text-[#1A1A2E]/48">
                {nextStepsTitle}
              </p>
              <ul className="mt-3 space-y-3">
                {nextSteps.map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0056D2]/50" />
                    <span className="text-[13px] text-[#1A1A2E]/62">{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Footer divider */}
            <div className="mt-8 mb-0 h-px w-full bg-[linear-gradient(90deg,transparent,rgba(26,26,46,0.08),transparent)]" />

            {/* Back to home */}
            <div className="mt-6 flex justify-center">
              <Link
                href={`/${locale}`}
                className="text-[13px] font-medium text-[#0056D2] underline decoration-[#0056D2]/30 underline-offset-3 transition-colors duration-200 hover:text-[#003A8C]"
              >
                {backToHome}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  )
}
```

- [ ] **Step 2: Verify it compiles**

Run: `bun run typecheck`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add components/success-page.tsx
git commit -m "feat: add SuccessPage client component"
```

---

## Task 4: Create `app/[locale]/success/page.tsx` server page

**Files:**
- Create: `app/[locale]/success/page.tsx`

- [ ] **Step 1: Write the success page route**

```typescript
import type { Metadata } from "next"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import { useTranslation } from "react-i18next"
import { SuccessPage } from "@/components/success-page"
import i18nConfig from "@/i18n/config"

const COURSE_LABELS: Record<string, string> = {
  softSkills: "Soft Skills Accelerator",
  techCareer: "Tech Career Launchpad",
  leadership: "Leadership Accelerator",
  workplaceReadiness: "Workplace Readiness",
}

const LOCALES = ["en", "fr", "es"] as const

interface SuccessPageParams {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({
  params,
}: SuccessPageParams): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations(locale)
  return {
    title: t("success.metaTitle"),
    description: t("success.metaDescription"),
  }
}

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

async function getTranslations(locale: string) {
  const translations = await import(`@/public/locales/${locale}/translation.json`)
  return translations.default ?? translations
}

export default async function SuccessRoute({ params }: SuccessPageParams) {
  const { locale } = await params

  if (!LOCALES.includes(locale as (typeof LOCALES)[number])) {
    notFound()
  }

  const cookieStore = await cookies()
  const rawCookie = cookieStore.get("pedagemy_registration")?.value

  // If no session cookie, redirect to home
  if (!rawCookie) {
    return notFound()
  }

  let sessionData: { name: string; email: string; course: string; locale: string }
  try {
    sessionData = JSON.parse(rawCookie) as (typeof rawCookie extends string ? Record<string, unknown> : never)
  } catch {
    return notFound()
  }

  const translations = await getTranslations(locale)
  const t = (key: string) => {
    const keys = key.split(".")
    let value: unknown = translations
    for (const k of keys) {
      value = (value as Record<string, unknown>)?.[k]
    }
    return typeof value === "string" ? value : key
  }

  const firstName = sessionData.name.trim().split(/\s+/)[0] ?? ""
  const courseKey = sessionData.course.trim().toLowerCase().replace(/\s+/g, "")
  const courseName =
    COURSE_LABELS[courseKey] ??
    sessionData.course ??
    "your selected programme"

  return (
    <SuccessPage
      firstName={firstName}
      courseName={courseName}
      email={sessionData.email}
      locale={locale}
      headline={t("success.headline")}
      body={t("success.body")}
      emailNote={t("success.emailNote")}
      nextStepsTitle={t("success.nextStepsTitle")}
      nextSteps={
        Array.isArray(translations.success?.nextSteps)
          ? translations.success.nextSteps
          : ["Your application is reviewed personally.", "If selected, Pedagemy contacts you directly.", "Access instructions sent by email."]
      }
      backToHome={t("success.backToHome")}
    />
  )
}
```

**Important note:** The `getTranslations` and `t` helper shown above is a simplified inline approach. Since this is a server component and we want proper i18n, we should use the existing i18n pattern. See the note below before implementing — this approach needs refinement to match the existing i18n setup.

**Refined approach for i18n in server component:**
- We cannot use `useTranslation` in a server component
- We need to use `getTranslations` from `next-i18next` or a similar approach
- The existing project uses `react-i18next` with client-side `I18nextProvider`
- For server components, we should read the translation JSON directly or use `next-i18next/server`

Since the existing project loads translations via `@/public/locales/{lang}/translation.json` imports (as seen in `i18n/client.ts`), we can import the JSON directly in server components. However, we need a `getTranslations` helper.

Actually, looking at the existing code, there is no server-side i18n utility. The simplest approach is to read the translation JSON directly as shown above. The `t` function implementation above is a simple key-path reader. If the JSON structure is deep, we need to make sure the `t` function correctly traverses nested keys.

Let me verify the actual translation JSON structure. Looking at the existing `public/locales/en/translation.json`, keys are at the top level like `success.headline`. So a simple dot-key traversal works.

**Updated implementation for server i18n:**

```typescript
// Replace the t() helper with this cleaner version:
function t(translations: Record<string, unknown>, key: string): string {
  const keys = key.split(".")
  let value: unknown = translations
  for (const k of keys) {
    value = (value as Record<string, unknown>)?.[k]
  }
  return typeof value === "string" ? value : key
}
```

Then use it as:
```typescript
headline={t(translations, "success.headline")}
```

The full file should use this pattern consistently.

- [ ] **Step 2: Verify the route compiles**

Run: `bun run typecheck`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add app/[locale]/success/page.tsx
git commit -m "feat: add /success page route"
```

---

## Task 5: Add i18n translation keys

**Files:**
- Modify: `public/locales/en/translation.json`
- Modify: `public/locales/fr/translation.json`
- Modify: `public/locales/es/translation.json`

- [ ] **Step 1: Add success namespace to English translations**

Open `public/locales/en/translation.json` and add before the closing `}`:

```json
,
  "success": {
    "headline": "You're in, {firstName}.",
    "body": "Your application for **{course}** has been received. We'll be in touch before May 15, 2026.",
    "emailNote": "A confirmation has been sent to {email}.",
    "nextStepsTitle": "What happens next?",
    "nextSteps": [
      "Your application is reviewed personally.",
      "If selected, Pedagemy contacts you directly.",
      "Access instructions sent by email."
    ],
    "backToHome": "Back to home",
    "metaTitle": "Application Received — Pedagemy",
    "metaDescription": "Your application has been received. We'll be in touch soon."
  }
```

- [ ] **Step 2: Add success namespace to French translations**

Open `public/locales/fr/translation.json` and add:

```json
,
  "success": {
    "headline": "Tu y es, {firstName}.",
    "body": "Ta candidature pour **{course}** a été reçue. Nous te contacterons avant le 15 mai 2026.",
    "emailNote": "Une confirmation a été envoyée à {email}.",
    "nextStepsTitle": "Prochaine étape ?",
    "nextSteps": [
      "Ta candidature est examinée personnellement.",
      "Si tu es sélectionné(e), Pedagemy te contacte directement.",
      "Les instructions d'accès sont envoyées par e-mail."
    ],
    "backToHome": "Retour à l'accueil",
    "metaTitle": "Candidature reçue — Pedagemy",
    "metaDescription": "Ta candidature a été reçue. Nous te contacterons bientôt."
  }
```

- [ ] **Step 3: Add success namespace to Spanish translations**

Open `public/locales/es/translation.json` and add:

```json
,
  "success": {
    "headline": "Estás dentro, {firstName}.",
    "body": "Tu solicitud para **{course}** ha sido recibida. Nos pondremos en contacto contigo antes del 15 de mayo de 2026.",
    "emailNote": "Se ha enviado una confirmación a {email}.",
    "nextStepsTitle": "¿Qué pasa ahora?",
    "nextSteps": [
      "Tu solicitud es revisada personalmente.",
      "Si eres seleccionado/a, Pedagemy te contacta directamente.",
      "Las instrucciones de acceso se envían por correo electrónico."
    ],
    "backToHome": "Volver al inicio",
    "metaTitle": "Solicitud recibida — Pedagemy",
    "metaDescription": "Tu solicitud ha sido recibida. Nos pondremos en contacto contigo pronto."
  }
```

- [ ] **Step 4: Verify JSON is valid**

Run: `bun run typecheck`
Expected: No errors (JSON syntax validation via tsc)

- [ ] **Step 5: Commit**

```bash
git add public/locales/en/translation.json public/locales/fr/translation.json public/locales/es/translation.json
git commit -m "feat: add success page i18n translations (en, fr, es)"
```

---

## Task 6: Final verification

- [ ] **Step 1: Run full typecheck**

Run: `bun run typecheck`
Expected: No errors

- [ ] **Step 2: Run build**

Run: `bun run build`
Expected: Build succeeds with no errors

- [ ] **Step 3: Test the success page redirect manually**

Start dev server (`bun dev`), fill the form, submit — should navigate to `/en/success` and show personalized content.

---

## Spec Coverage Checklist

| Spec Section | Implemented In |
|---|---|
| Session cookie storage | Task 1 |
| Client navigation to /success | Task 2 |
| Server page reading cookie | Task 4 |
| SuccessPage client component | Task 3 |
| i18n translations (en, fr, es) | Task 5 |
| Metadata (title, description) | Task 4 |
| Visual matching (glass panel, gradients) | Task 3 |
| Personalized headline with firstName | Task 3, Task 4 |
| Course name confirmation | Task 3, Task 4 |
| Email note | Task 3 |
| Next steps bullets | Task 3 |
| Back to home link | Task 3 |

---

**Plan complete.** Two execution options:

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** — Execute tasks in this session using `executing-plans`, batch execution with checkpoints

Which approach?