# Registration Confirmation Email Localisation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Send the approved raffle confirmation email in English, French, or Spanish based on the form locale, interpolate the user’s selected programme into the outgoing email, and keep the Resend send path reliable and testable.

**Architecture:** Keep the existing landing-page payload shape, because it already posts both a locale and a locale-specific programme label. Move all transactional email copy and formatting out of `app/api/register/route.ts` into a dedicated server-side helper that owns locale normalisation, first-name extraction, selected-programme interpolation, and HTML/text generation. The API route remains responsible for validation, persistence, and the Resend send call, while tests split between pure builder tests and route-level send assertions.

**Tech Stack:** Next.js 16 App Router, TypeScript, react-i18next (existing locale selection), Resend Node SDK, node:test.

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `lib/registration-email.ts` | create | Server-only email copy, locale normalisation, first-name extraction, selected-programme interpolation, HTML + text builders |
| `lib/registration-email.test.ts` | create | Pure unit tests for approved copy in `en`, `fr`, and `es`, plus locale fallback and interpolation |
| `app/api/register/route.ts` | modify | Replace inline email copy with helper usage; send `html` + `text`; keep sender and contact settings |
| `app/api/route-handlers.test.ts` | modify | Verify outgoing email subject/body for `en`, `fr`, and `es`, including the selected programme variable |

**Current code facts this plan relies on:**

- `components/landing-page.tsx` already posts `locale: i18n.language` and `course: selectedCourseOption?.label`.
- `app/api/register/route.ts` already receives `locale` and `course` and already sends through Resend with an idempotency key.
- The current route hardcodes transactional copy inline; this plan extracts it instead of adding more copy inside the route.

---

### Task 1: Create a dedicated server-side registration email builder

**Files:**
- Create: `lib/registration-email.ts`
- Test: `lib/registration-email.test.ts`

- [ ] **Step 1: Write the failing unit tests for locale selection, first-name extraction, and selected-programme interpolation**

Create `lib/registration-email.test.ts` with these tests:

```ts
import assert from "node:assert/strict"
import test from "node:test"

import {
  buildRegistrationConfirmationEmail,
  extractFirstName,
  normalizeEmailLocale,
} from "./registration-email"

test("normalizeEmailLocale supports en, fr, and es and falls back to en", () => {
  assert.equal(normalizeEmailLocale("en"), "en")
  assert.equal(normalizeEmailLocale("fr"), "fr")
  assert.equal(normalizeEmailLocale("es-MX"), "es")
  assert.equal(normalizeEmailLocale("de"), "en")
  assert.equal(normalizeEmailLocale(undefined), "en")
})

test("extractFirstName returns the first token from a validated full name", () => {
  assert.equal(extractFirstName("Grace Hopper"), "Grace")
  assert.equal(extractFirstName("  Jean   Dupont  "), "Jean")
})

test("buildRegistrationConfirmationEmail returns the approved English copy", () => {
  const email = buildRegistrationConfirmationEmail({
    fullName: "Grace Hopper",
    locale: "en",
    selectedProgramme: "Leadership Accelerator Program",
  })

  assert.equal(email.locale, "en")
  assert.equal(email.subject, "You're In! Pedagemy Raffle Entry Confirmed")
  assert.match(email.text, /^Hi Grace,/)
  assert.match(email.text, /You’re officially in!/) 
  assert.match(email.text, /Your Selected Programme:\nLeadership Accelerator Program/)
  assert.match(email.text, /info@pedagemy\.com/)
  assert.match(email.html, /Leadership Accelerator Program/)
})

test("buildRegistrationConfirmationEmail returns the approved French copy", () => {
  const email = buildRegistrationConfirmationEmail({
    fullName: "Marie Curie",
    locale: "fr",
    selectedProgramme: "Accélérateur de leadership",
  })

  assert.equal(email.locale, "fr")
  assert.equal(
    email.subject,
    "Votre participation est confirmée ! Tirage Pedagemy"
  )
  assert.match(email.text, /^Bonjour Marie,/)
  assert.match(email.text, /Le programme que vous avez sélectionné :\nAccélérateur de leadership/)
  assert.match(email.html, /Accélérateur de leadership/)
})

test("buildRegistrationConfirmationEmail returns the approved Spanish copy", () => {
  const email = buildRegistrationConfirmationEmail({
    fullName: "Ada Lovelace",
    locale: "es",
    selectedProgramme: "Acelerador de liderazgo",
  })

  assert.equal(email.locale, "es")
  assert.equal(
    email.subject,
    "¡Ya estás dentro! Tu participación en el sorteo de Pedagemy está confirmada"
  )
  assert.match(email.text, /^Hola Ada,/)
  assert.match(email.text, /Tu programa seleccionado:\nAcelerador de liderazgo/)
  assert.match(email.html, /Acelerador de liderazgo/)
})

test("buildRegistrationConfirmationEmail escapes user-provided values in html output", () => {
  const email = buildRegistrationConfirmationEmail({
    fullName: "Grace <script>alert(1)</script> Hopper",
    locale: "en",
    selectedProgramme: "Leadership <b>Accelerator</b>",
  })

  assert.doesNotMatch(email.html, /<script>/)
  assert.doesNotMatch(email.html, /<b>Accelerator<\/b>/)
  assert.match(email.html, /Leadership &lt;b&gt;Accelerator&lt;\/b&gt;/)
})
```

- [ ] **Step 2: Run the new unit tests and verify they fail because the module does not exist yet**

Run: `bunx tsx --test lib/registration-email.test.ts`

Expected: FAIL with module-not-found or missing-export errors for `./registration-email`.

- [ ] **Step 3: Create `lib/registration-email.ts` with the approved transactional copy and builders**

Create `lib/registration-email.ts`:

```ts
export type SupportedEmailLocale = "en" | "fr" | "es"

type RegistrationConfirmationEmailInput = {
  fullName: string
  locale?: string
  selectedProgramme: string
}

type RegistrationConfirmationEmail = {
  html: string
  locale: SupportedEmailLocale
  subject: string
  text: string
}

type EmailCopy = {
  subject: string
  salutation: string
  headline: string
  thanks: string
  nextStepsLabel: string
  nextSteps: readonly [string, string, string]
  selectedProgrammeLabel: string
  benefit: string
  reminder: string
  questions: string
  closing: string
  team: string
  inquiriesLabel: string
  whatsappEnglishLabel: string
  whatsappFrenchSpanishLabel: string
}

const CONTACT_EMAIL = "info@pedagemy.com"
const WHATSAPP_ENGLISH = "+237 683 064 880"
const WHATSAPP_FRENCH_SPANISH = "+240 555 79 65 52"

const copyByLocale: Record<SupportedEmailLocale, EmailCopy> = {
  en: {
    subject: "You're In! Pedagemy Raffle Entry Confirmed",
    salutation: "Hi",
    headline: "You’re officially in!",
    thanks:
      "Thank you for entering the Pedagemy Raffle Draw. Your submission has been successfully received.",
    nextStepsLabel: "Here’s what happens next:",
    nextSteps: [
      "You’ve been entered into the raffle",
      "Your preferred course selection has been noted",
      "Winners will be selected and contacted after May 15, 2026",
    ],
    selectedProgrammeLabel: "Your Selected Programme:",
    benefit:
      "If selected, you’ll gain free access to a premium learning program curated by iCUBEFARM designed to help you build skills that matter in today’s job market.",
    reminder:
      "In the meantime, stay connected and keep an eye on your email; you won’t want to miss this.",
    questions: "If you have any questions, feel free to reach out.",
    closing: "Best regards,",
    team: "The Pedagemy Team",
    inquiriesLabel: "For inquiries, reach out to",
    whatsappEnglishLabel: "WhatsApp (English)",
    whatsappFrenchSpanishLabel: "WhatsApp (French/Spanish)",
  },
  fr: {
    subject: "Votre participation est confirmée ! Tirage Pedagemy",
    salutation: "Bonjour",
    headline: "Votre participation est bien confirmée !",
    thanks:
      "Merci d’avoir participé au tirage Pedagemy. Votre candidature a bien été reçue.",
    nextStepsLabel: "Voici la suite :",
    nextSteps: [
      "Votre participation au tirage a bien été enregistrée",
      "Le programme que vous avez choisi a bien été pris en compte",
      "Les gagnants seront sélectionnés et contactés après le 15 mai 2026",
    ],
    selectedProgrammeLabel: "Le programme que vous avez sélectionné :",
    benefit:
      "Si vous êtes sélectionné(e), vous bénéficierez d’un accès gratuit à un programme de formation premium conçu par iCUBEFARM pour vous aider à développer les compétences qui comptent sur le marché du travail actuel.",
    reminder:
      "D’ici là, restez connecté(e) et gardez un œil sur votre boîte mail : vous ne voudriez pas manquer cela.",
    questions: "Si vous avez des questions, n’hésitez pas à nous contacter.",
    closing: "Cordialement,",
    team: "L’équipe Pedagemy",
    inquiriesLabel: "Pour toute question, contactez-nous à",
    whatsappEnglishLabel: "WhatsApp (anglais)",
    whatsappFrenchSpanishLabel: "WhatsApp (français/espagnol)",
  },
  es: {
    subject: "¡Ya estás dentro! Tu participación en el sorteo de Pedagemy está confirmada",
    salutation: "Hola",
    headline: "¡Tu participación ya quedó confirmada!",
    thanks:
      "Gracias por participar en el sorteo de Pedagemy. Hemos recibido tu solicitud correctamente.",
    nextStepsLabel: "Esto es lo que sigue:",
    nextSteps: [
      "Tu participación en el sorteo ya quedó registrada",
      "Tu curso preferido ha sido tomado en cuenta",
      "Las personas ganadoras serán seleccionadas y contactadas después del 15 de mayo de 2026",
    ],
    selectedProgrammeLabel: "Tu programa seleccionado:",
    benefit:
      "Si resultas seleccionado(a), obtendrás acceso gratuito a un programa premium de aprendizaje curado por iCUBEFARM para ayudarte a desarrollar habilidades que realmente importan en el mercado laboral actual.",
    reminder:
      "Mientras tanto, mantente al tanto y revisa tu correo con atención; no querrás perderte esto.",
    questions: "Si tienes alguna pregunta, no dudes en escribirnos.",
    closing: "Saludos cordiales,",
    team: "El equipo de Pedagemy",
    inquiriesLabel: "Para consultas, escríbenos a",
    whatsappEnglishLabel: "WhatsApp (inglés)",
    whatsappFrenchSpanishLabel: "WhatsApp (francés/español)",
  },
}

export function normalizeEmailLocale(locale?: string): SupportedEmailLocale {
  const baseLocale = locale?.trim().toLowerCase().split("-")[0]

  if (baseLocale === "fr" || baseLocale === "es") {
    return baseLocale
  }

  return "en"
}

export function extractFirstName(fullName: string) {
  return fullName.trim().split(/\s+/).filter(Boolean)[0] ?? "there"
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}

export function buildRegistrationConfirmationEmail({
  fullName,
  locale,
  selectedProgramme,
}: RegistrationConfirmationEmailInput): RegistrationConfirmationEmail {
  const normalizedLocale = normalizeEmailLocale(locale)
  const copy = copyByLocale[normalizedLocale]
  const firstName = extractFirstName(fullName)
  const safeFirstName = escapeHtml(firstName)
  const safeSelectedProgramme = escapeHtml(selectedProgramme.trim())

  const text = [
    `${copy.salutation} ${firstName},`,
    copy.headline,
    copy.thanks,
    "",
    copy.nextStepsLabel,
    ...copy.nextSteps.map((step) => `- ${step}`),
    "",
    copy.selectedProgrammeLabel,
    selectedProgramme.trim(),
    "",
    copy.benefit,
    copy.reminder,
    copy.questions,
    "",
    copy.closing,
    copy.team,
    "",
    copy.inquiriesLabel,
    CONTACT_EMAIL,
    `${copy.whatsappEnglishLabel}: ${WHATSAPP_ENGLISH}`,
    `${copy.whatsappFrenchSpanishLabel}: ${WHATSAPP_FRENCH_SPANISH}`,
  ].join("\n")

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1A1A2E">
      <p>${copy.salutation} ${safeFirstName},</p>
      <p><strong>${copy.headline}</strong></p>
      <p>${copy.thanks}</p>
      <p>${copy.nextStepsLabel}</p>
      <ul>
        ${copy.nextSteps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}
      </ul>
      <p><strong>${copy.selectedProgrammeLabel}</strong><br/>${safeSelectedProgramme}</p>
      <p>${copy.benefit}</p>
      <p>${copy.reminder}</p>
      <p>${copy.questions}</p>
      <p>${copy.closing}<br/>${copy.team}</p>
      <p>${copy.inquiriesLabel}<br/>
        <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a><br/>
        ${copy.whatsappEnglishLabel}: <a href="https://wa.me/237683064880">${WHATSAPP_ENGLISH}</a><br/>
        ${copy.whatsappFrenchSpanishLabel}: <a href="https://wa.me/240555796552">${WHATSAPP_FRENCH_SPANISH}</a>
      </p>
    </div>
  `.trim()

  return {
    html,
    locale: normalizedLocale,
    subject: copy.subject,
    text,
  }
}
```

- [ ] **Step 4: Run the unit tests again and verify they pass**

Run: `bunx tsx --test lib/registration-email.test.ts`

Expected: PASS with 5/5 green tests.

- [ ] **Step 5: Commit the helper and its tests**

```bash
git add lib/registration-email.ts lib/registration-email.test.ts
git commit -m "feat: add localized registration confirmation email builder"
```

---

### Task 2: Refactor the register route to use the email builder and send both HTML and text

**Files:**
- Modify: `app/api/register/route.ts`
- Test: `app/api/route-handlers.test.ts`

- [ ] **Step 1: Write the failing route-level tests for English, French, and Spanish sends**

In `app/api/route-handlers.test.ts`, replace the current single send assertion with these three tests:

```ts
test("sends the approved English confirmation email with the selected programme", async () => {
  resetGlobalStore()
  seedStore()
  process.env.RESEND_API_KEY = "re_test_key"

  const originalFetch = globalThis.fetch
  let sentPayload: { from?: string; cc?: string[]; html?: string; subject?: string; text?: string } = {}

  globalThis.fetch = async (_input, init) => {
    sentPayload = JSON.parse(String(init?.body ?? "{}")) as typeof sentPayload

    return new Response(JSON.stringify({ id: "email_123" }), {
      status: 200,
      headers: { "content-type": "application/json" },
    })
  }

  try {
    const response = await registerPost(
      new Request("http://localhost/api/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: "Grace Hopper",
          phone: "+1 555 0100",
          email: "grace@example.com",
          course: "Leadership Accelerator Program",
          locale: "en",
          reason: "I want to get sharper at leading teams.",
        }),
      }) as never,
    )

    assert.equal(response.status, 200)
    assert.equal(sentPayload.from, "Pedagemy <info@pedagemy.com>")
    assert.deepEqual(sentPayload.cc, ["info@pedagemy.com"])
    assert.equal(sentPayload.subject, "You're In! Pedagemy Raffle Entry Confirmed")
    assert.match(sentPayload.text ?? "", /^Hi Grace,/)
    assert.match(sentPayload.text ?? "", /Your Selected Programme:\nLeadership Accelerator Program/)
    assert.match(sentPayload.html ?? "", /Leadership Accelerator Program/)
  } finally {
    globalThis.fetch = originalFetch
  }
})

test("sends the approved French confirmation email when locale is fr", async () => {
  resetGlobalStore()
  seedStore()
  process.env.RESEND_API_KEY = "re_test_key"

  const originalFetch = globalThis.fetch
  let sentPayload: { subject?: string; text?: string; html?: string } = {}

  globalThis.fetch = async (_input, init) => {
    sentPayload = JSON.parse(String(init?.body ?? "{}")) as typeof sentPayload

    return new Response(JSON.stringify({ id: "email_123" }), {
      status: 200,
      headers: { "content-type": "application/json" },
    })
  }

  try {
    const response = await registerPost(
      new Request("http://localhost/api/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: "Marie Curie",
          phone: "+237 600 111 222",
          email: "marie@example.com",
          course: "Accélérateur de leadership",
          locale: "fr",
          reason: "Je veux renforcer mon leadership.",
        }),
      }) as never,
    )

    assert.equal(response.status, 200)
    assert.equal(sentPayload.subject, "Votre participation est confirmée ! Tirage Pedagemy")
    assert.match(sentPayload.text ?? "", /^Bonjour Marie,/)
    assert.match(sentPayload.text ?? "", /Le programme que vous avez sélectionné :\nAccélérateur de leadership/)
    assert.match(sentPayload.html ?? "", /Accélérateur de leadership/)
  } finally {
    globalThis.fetch = originalFetch
  }
})

test("normalizes regional Spanish locales before sending the approved Spanish email", async () => {
  resetGlobalStore()
  seedStore()
  process.env.RESEND_API_KEY = "re_test_key"

  const originalFetch = globalThis.fetch
  let sentPayload: { subject?: string; text?: string; html?: string } = {}

  globalThis.fetch = async (_input, init) => {
    sentPayload = JSON.parse(String(init?.body ?? "{}")) as typeof sentPayload

    return new Response(JSON.stringify({ id: "email_123" }), {
      status: 200,
      headers: { "content-type": "application/json" },
    })
  }

  try {
    const response = await registerPost(
      new Request("http://localhost/api/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: "Ada Lovelace",
          phone: "+240 555 79 65 52",
          email: "ada@example.com",
          course: "Acelerador de liderazgo",
          locale: "es-MX",
          reason: "Quiero fortalecer mi perfil profesional.",
        }),
      }) as never,
    )

    assert.equal(response.status, 200)
    assert.equal(
      sentPayload.subject,
      "¡Ya estás dentro! Tu participación en el sorteo de Pedagemy está confirmada"
    )
    assert.match(sentPayload.text ?? "", /^Hola Ada,/)
    assert.match(sentPayload.text ?? "", /Tu programa seleccionado:\nAcelerador de liderazgo/)
    assert.match(sentPayload.html ?? "", /Acelerador de liderazgo/)
  } finally {
    globalThis.fetch = originalFetch
  }
})
```

- [ ] **Step 2: Run the route tests and verify they fail with the current inline copy**

Run: `bunx tsx --test app/api/route-handlers.test.ts`

Expected: FAIL because `app/api/register/route.ts` still sends the older inline subject/body copy and does not return `text`.

- [ ] **Step 3: Replace the inline email template logic in `app/api/register/route.ts` with the new builder**

Open `app/api/register/route.ts` and make these changes:

1. Remove `EmailContent`, `emailContent`, and `buildEmailHtml`.
2. Import the builder from `lib/registration-email.ts`.
3. Keep `body.course` as the selected-programme variable, because `components/landing-page.tsx` already posts the locale-specific programme label.
4. Persist the normalized locale returned by the builder so `es-MX` and similar values are stored consistently.
5. Send both `html` and `text` to Resend.

The route should look like this after the refactor:

```ts
import { NextResponse } from "next/server"
import { Resend } from "resend"
import {
  DuplicateRegistrationError,
  getRaffleStore,
  MissingRegistrationsTableError,
  MissingStoreConfigError,
} from "@/lib/raffle-store"
import { buildRegistrationConfirmationEmail } from "@/lib/registration-email"

function getResendClient() {
  return process.env.RESEND_API_KEY
    ? new Resend(process.env.RESEND_API_KEY)
    : null
}

interface RegisterBody {
  course: string
  email: string
  name: string
  phone: string
  reason: string
  locale?: string
}

const REGISTRATION_CONTACT_EMAIL = "info@pedagemy.com"

function isNonEmpty(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function hasAtLeastTwoNames(name: string) {
  return name.trim().split(/\s+/).filter(Boolean).length >= 2
}

async function sendRegistrationEmail(body: RegisterBody) {
  const resend = getResendClient()

  if (!resend) {
    return
  }

  const email = buildRegistrationConfirmationEmail({
    fullName: body.name,
    locale: body.locale,
    selectedProgramme: body.course,
  })

  const { error } = await resend.emails.send(
    {
      from: "Pedagemy <info@pedagemy.com>",
      to: [body.email],
      cc: [REGISTRATION_CONTACT_EMAIL],
      subject: email.subject,
      html: email.html,
      text: email.text,
    },
    { idempotencyKey: `registration-confirmation/${body.email}/${body.course}` }
  )

  if (error) {
    console.error("Failed to send confirmation email:", error.message)
  }
}

export async function POST(request: Request) {
  let body: RegisterBody

  try {
    body = (await request.json()) as RegisterBody
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  if (
    !isNonEmpty(body.name) ||
    !isNonEmpty(body.phone) ||
    !isNonEmpty(body.email) ||
    !isNonEmpty(body.course) ||
    !isNonEmpty(body.reason)
  ) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 }
    )
  }

  if (!isValidEmail(body.email)) {
    return NextResponse.json(
      { error: "Invalid email address" },
      { status: 400 }
    )
  }

  if (!hasAtLeastTwoNames(body.name)) {
    return NextResponse.json(
      { error: "Full name must include at least first and last name" },
      { status: 400 }
    )
  }

  try {
    const email = buildRegistrationConfirmationEmail({
      fullName: body.name,
      locale: body.locale,
      selectedProgramme: body.course,
    })

    await getRaffleStore().saveRegistration({
      ...body,
      locale: email.locale,
    })
    await sendRegistrationEmail({ ...body, locale: email.locale })
    return NextResponse.json({ ok: true })
  } catch (error) {
    if (error instanceof DuplicateRegistrationError) {
      return NextResponse.json(
        {
          code: "DUPLICATE_EMAIL",
          error: "An application with this email has already been submitted.",
        },
        { status: 409 }
      )
    }

    if (error instanceof MissingStoreConfigError) {
      console.error("Registration storage is not configured", error.message)
      return NextResponse.json(
        { error: "Registration storage is not configured" },
        { status: 500 }
      )
    }

    if (error instanceof MissingRegistrationsTableError) {
      console.error("Supabase registrations table is missing", error.message)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    console.error("Failed to process registration", error)
    return NextResponse.json(
      { error: "Failed to process registration" },
      { status: 500 }
    )
  }
}
```

- [ ] **Step 4: Run the route tests again and verify they pass**

Run: `bunx tsx --test app/api/route-handlers.test.ts`

Expected: PASS with all route tests green, including the new English/French/Spanish send assertions.

- [ ] **Step 5: Run the pure builder tests and route tests together**

Run: `bunx tsx --test lib/registration-email.test.ts app/api/route-handlers.test.ts`

Expected: PASS with all transactional-email tests green.

- [ ] **Step 6: Commit the route refactor**

```bash
git add app/api/register/route.ts app/api/route-handlers.test.ts
git commit -m "feat: localize registration confirmation emails"
```

---

### Task 3: Add a typecheck gate and prevent regressions in the existing registration flow

**Files:**
- Modify: `app/api/register/route.ts`
- Modify: `lib/registration-email.ts`

- [ ] **Step 1: Run TypeScript after the refactor**

Run: `bun run typecheck`

Expected: PASS with no new errors.

- [ ] **Step 2: Confirm the route still uses Resend in the supported way**

Checklist:

```md
- `resend.emails.send()` still checks `{ error }` instead of relying on exceptions
- the send call still happens server-side only inside `app/api/register/route.ts`
- `idempotencyKey` remains `registration-confirmation/${body.email}/${body.course}`
- `from` stays `Pedagemy <info@pedagemy.com>`
- `cc` stays `["info@pedagemy.com"]`
- the route now sends both `html` and `text`
```

- [ ] **Step 3: Commit the verification checkpoint**

```bash
git add app/api/register/route.ts lib/registration-email.ts
git commit -m "chore: verify transactional email send path"
```

---

### Task 4: Run a manual QA pass in all three locales

**Files:**
- No code changes required if all checks pass

- [ ] **Step 1: Verify Resend is allowed to send from `info@pedagemy.com`**

Manual checklist in Resend dashboard:

```md
- verified domain includes `pedagemy.com`
- SPF is passing
- DKIM is passing
- sender address `info@pedagemy.com` is allowed by that verified domain
- no sandbox restriction is blocking the sender
```

Expected: all green before testing real sends.

- [ ] **Step 2: Run one manual registration in each locale on a non-production environment**

Use three submissions:

```md
English route: `/en`
French route: `/fr`
Spanish route: `/es`
```

For each one, submit:

```md
- a valid full name with at least two names
- a unique test email address controlled by the team
- one selected programme
- a valid phone number
- a valid reason
```

Expected per send:

```md
- subject matches the locale
- greeting uses first name only
- selected programme block shows the selected programme string exactly once
- bullet list matches the approved copy in the selected language
- `info@pedagemy.com` appears as the inquiry email
- English and French/Spanish WhatsApp lines are present
- no raw placeholders like `{{name}}` or `{{course}}` appear
```

- [ ] **Step 3: Capture rollout evidence**

Store this checklist in the PR description or release notes:

```md
- unit tests passed
- route tests passed
- English manual email verified
- French manual email verified
- Spanish manual email verified
- Resend domain/sender configuration verified for `info@pedagemy.com`
```

---

## Plan Self-Review

**Spec coverage:**

- Approved outgoing copy: covered in `lib/registration-email.ts`
- All 3 languages: covered in the locale-specific copy map and route tests
- Selected-programme variable: covered by `selectedProgramme` input and route assertions
- Send according to active form language: covered by `locale` input, locale normalization, and locale-specific route tests
- Proper sending path: covered by Resend `html` + `text`, idempotency retention, and Resend preflight QA

**Placeholder scan:**

- No `TODO`, `TBD`, or implicit “handle later” steps remain
- Each code-changing task contains exact file paths, code, and verification commands

**Type consistency:**

- The builder input consistently uses `selectedProgramme`
- The route continues to receive `body.course` and passes it to the builder as `selectedProgramme`
- Locale handling is centralized in `normalizeEmailLocale()` so the route does not duplicate locale rules

---

Plan complete and saved to `docs/superpowers/plans/2026-04-28-registration-confirmation-email-localization.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**