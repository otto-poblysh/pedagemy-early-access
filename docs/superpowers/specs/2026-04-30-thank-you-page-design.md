# Pedagemy Thank You Page Design Spec

**Date:** 2026-04-30
**Status:** Approved
**Next:** Invoke writing-plans skill

---

## 1. Overview

Create a dedicated `/[locale]/success` route (e.g., `/en/success`) that serves as the post-registration thank you page. It replaces the inline success state currently shown inside the `ApplicationForm` panel on the landing page.

The page celebrates the registrant's application with personalized content (their name, email, and selected course) and sets clear expectations about what happens next.

---

## 2. Route Architecture

**URL:** `/{locale}/success` (en, fr, es)

**File:** `app/[locale]/success/page.tsx`

**Type:** Server component (`page.tsx`) that passes data to a client component for animation/interaction.

**Data flow:**
1. Form submits to `/api/register` → API stores `{ name, email, course }` in a session cookie
2. Client receives success response and calls `router.push('/{locale}/success')`
3. `page.tsx` (server) reads the session cookie, extracts `{ name, email, course }`, renders personalized content
4. No query params in URL — clean, bookmarkable, shareable

**Session storage:**
- Cookie name: `pedagemy_registration`
- Contains: `{ name: string, email: string, course: string, locale: string }`
- Cookie settings: `httpOnly`, `secure` in production, `sameSite: 'lax'`
- Cleared on logout or after 30 days

---

## 3. Visual Design

### Background
Matches the landing page exactly:
- Body: `bg-[#F3F6FB]` with gradient overlay
- `bg-[radial-gradient(circle_at_top_left,rgba(0,86,210,0.14),transparent_34%),radial-gradient(circle_at_top_right,rgba(26,26,46,0.10),transparent_36%),linear-gradient(180deg,#F9FBFF_0%,#F3F6FB_54%,#EEF3F8_100%)]`
- Top shimmer line: `absolute inset-x-10 top-20 h-px bg-[linear-gradient(90deg,transparent,rgba(26,26,46,0.14),transparent)]`

### Glass Panel (same as ApplicationFormPanel)
```
rounded-[32px] border border-white/75 bg-white/78 p-[1px]
shadow-[0_28px_80px_rgba(15,23,42,0.10)] backdrop-blur-2xl
```
Inner container:
```
rounded-[31px] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(244,248,252,0.96))]
shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)]
```
Top shimmer overlay:
```
absolute inset-x-10 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(13,91,209,0.35),transparent)]
```

### Typography
- Font family: DM Sans (matches landing page via `--font-dm-sans`)
- Headline: `text-[28px] font-bold tracking-[-0.02em] text-[#1A1A2E]`
- Body copy: `text-[13px] leading-[1.7] text-[#1A1A2E]/52`
- Labels: `text-[12px] font-medium tracking-[0.01em] text-[#1A1A2E]/62`

### Color Palette
- Background: `#F3F6FB`
- Text primary: `#1A1A2E`
- Text muted: `rgba(26, 26, 46, 0.52)`
- Text secondary: `rgba(26, 26, 46, 0.38)`
- Icon background: `#E9F1FF`
- Icon color: `#0056D2`
- Link color: `#0056D2` with `underline-offset-3` hover to `#003A8C`
- Button gradient: `linear-gradient(135deg,#0D5BD1,#003A8C)` (same as form submit button)

### Spacing
- Panel padding: `px-8 py-12` (mobile), `px-10 py-14` (tablet+)
- Section gap: `mt-8` between major content blocks
- Bullet item gap: `mt-3` between next-steps items

---

## 4. Content Structure

### Inside the glass panel (top to bottom):

**1. Success Icon**
- Circular div: `h-14 w-14 rounded-full bg-[#E9F1FF] shadow-[0_10px_24px_rgba(13,91,209,0.10)]`
- Centered checkmark Icon (from `@/components/icons`) with `h-6 w-6 text-[#0056D2]`
- Entrance animation: scale from 0.8 to 1.0 with opacity 0→1, 400ms ease-out

**2. Headline**
- Text: `"You're in, {firstName}."` — first name only extracted from full name
- Size: `text-[28px] font-bold tracking-[-0.02em]`
- Color: `#1A1A2E`
- Margin top: `mt-6`

**3. Confirmation Body**
- Text: `"Your application for **{courseName}** has been received. We'll be in touch before May 15, 2026."`
- The course name is bolded for emphasis
- Uses `text-[13px] leading-[1.7] text-[#1A1A2E]/52`
- Margin top: `mt-3`

**4. Email Note**
- Text: `"A confirmation has been sent to {email}."`
- `text-[12px] text-[#1A1A2E]/38`
- Margin top: `mt-2`

**5. Divider**
- `mt-8 mb-6 h-px w-full bg-[linear-gradient(90deg,transparent,rgba(26,26,46,0.08),transparent)]`

**6. Next Steps (What happens next)**
- Heading: `"What happens next?"` — `text-[12px] font-semibold tracking-[0.04em] uppercase text-[#1A1A2E]/48`
- 3 bullet items, each:
  - Bullet icon: small circle `h-1.5 w-1.5 rounded-full bg-[#0056D2]/50 mt-2`
  - Text: `text-[13px] text-[#1A1A2E]/62`
  - Items:
    1. "Your application is reviewed personally."
    2. "If selected, Pedagemy contacts you directly."
    3. "Access instructions sent by email."

**7. Divider**
- Same as above

**8. Footer Actions**
- "Back to home" — link styled as text button, `text-[13px] font-medium text-[#0056D2] underline decoration-[#0056D2]/30 underline-offset-3 transition-colors duration-200 hover:text-[#003A8C]`
- Margin top: `mt-8`

### Responsive Behavior
- Panel is centered with `max-w-[520px] mx-auto`
- On mobile: padding reduces to `px-6 py-10`
- On desktop: `px-10 py-14`

---

## 5. Component Architecture

**`app/[locale]/success/page.tsx`** (Server Component)
- Reads session cookie `pedagemy_registration`
- Parses `{ name, email, course }`
- Derives `firstName` from full name (first word)
- Derives `courseName` from course key using the existing course catalog
- Renders `<SuccessPage>` client component with all data as props

**`components/success-page.tsx`** (Client Component — `"use client"`)
- Handles entrance animation (CSS + optional GSAP for icon bounce)
- Receives all content as props (no data fetching)
- Renders the full success page UI
- Has a "Back to home" link using `next/link`

---

## 6. Session/API Changes

### `/api/register` update
After successfully storing the registration, the API:
1. Sets `pedagemy_registration` cookie with `{ name, email, course, locale }`
2. Returns `{ ok: true, redirectTo: `/${locale}/success` }`
3. Client navigates to `router.push(redirectTo)`

### Cookie settings
```typescript
{
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 60 * 60 * 24 * 30, // 30 days
  path: '/',
}
```

---

## 7. i18n — New Translation Keys

Add under `success:` namespace in all three `public/locales/{lang}/translation.json` files:

```json
{
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
    "shareLabel": "Share with colleagues",
    "metaTitle": "Application Received — Pedagemy",
    "metaDescription": "Your application has been received. We'll be in touch soon."
  }
}
```

All three locales (en, fr, es) get the same keys with appropriate translations.

---

## 8. Design Consistency Checklist

- [ ] Same glass panel style as `ApplicationFormPanel`
- [ ] Same radial gradient background as landing page
- [ ] Same DM Sans typography
- [ ] Same color tokens: `#1A1A2E`, `#0056D2`, `#E9F1FF`
- [ ] Same rounded corners (`rounded-[32px]` outer, `rounded-[31px]` inner)
- [ ] Same shimmer line at top of panel
- [ ] Same inset shadow style on panel
- [ ] Entrance animation on icon and panel
- [ ] No meta-labels (no "SUCCESS" stamp or section numbers)
- [ ] Responsive — works at mobile and desktop widths

---

## 9. Out of Scope (Not implemented in this phase)

- Confetti or heavy animation — celebration is dignified
- Social sharing buttons with pre-filled text — link is plain text for now
- Email resend functionality
- Session expiry UI (handled silently by cookie expiry)
- Loading state for session read (handled by redirect from form only)