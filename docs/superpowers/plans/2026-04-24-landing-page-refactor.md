# Landing Page Refactor: Sticky Footer + Component Decomposition

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix sticky footer (position: fixed, always visible) and decompose the 704-line landing-page.tsx into 9 focused component files.

**Architecture:** All i18n `useTranslation()` stays in `landing-page.tsx`. Sub-components receive data via props only. Footer uses `position: fixed inset-x-0 bottom-0` to always anchor to viewport bottom. Content wrapper has `pb-20` to reserve footer height.

**Tech Stack:** React 19, Next.js 16, TypeScript, Tailwind CSS, react-i18next

---

## File Structure

```
apps/web/components/
  landing-page.tsx       # Root: state, i18n, composition (~40 lines)
  landing-nav.tsx        # Sticky nav bar
  landing-footer.tsx     # Fixed footer
  hero-section.tsx      # Hero + course accordion
  course-accordion.tsx   # Single course option row
  application-form.tsx   # Registration form logic + JSX
  application-form-panel.tsx  # Form in two-column grid cell
  icons.tsx             # Icon helper + all SVG paths
  logo.tsx              # PedagemyLogo component
  reveal.tsx            # Reveal wrapper + useReveal hook
```

---

## Task 1: Fix Footer Layout in landing-page.tsx

**Files:**
- Modify: `apps/web/components/landing-page.tsx` (return statement structure only)

Change the outer wrapper and footer to:

```jsx
<div className="flex flex-col min-h-dvh bg-[#F7F9FC] font-(family-name:--font-dm-sans) text-[#1A1A2E] antialiased">
  <div className="flex-1 pb-20">
    {/* nav */}
    {/* hero + form */}
  </div>
  <footer className="fixed inset-x-0 bottom-0 z-50 h-20 border-t border-[#1A1A2E]/8 bg-[#F7F9FC] px-6 py-10 sm:px-8 lg:px-12">
    {/* footer content — update to z-50 */}
  </footer>
</div>
```

- [ ] **Step 1: Modify outer wrapper — add `pb-20` to content div, change `<main>` tag to `<div>`**

- [ ] **Step 2: Change `<footer>` from `shrink-0` to `fixed inset-x-0 bottom-0 z-50 h-20`**

- [ ] **Step 3: Verify TypeScript clean — run lsp_diagnostics on landing-page.tsx**

---

## Task 2: Extract Icon + Icon Paths to icons.tsx

**Files:**
- Create: `apps/web/components/icons.tsx`
- Modify: `apps/web/components/landing-page.tsx` (remove inline icon definitions)

`icons.tsx` contains all icon SVG paths and the `Icon` component (same as current inline implementation).

```tsx
"use client"

const iconPaths: Record<string, React.ReactNode> = {
  arrowUpRight: <><path d="M7 17 17 7" /><path d="M7 7h10v10" /></>,
  check: <path d="m6 12 4 4 8-8" />,
  briefcase: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" /><path d="M3 12h18" /></>,
  laptop: <><rect x="5" y="4" width="14" height="11" rx="2" /><path d="M3 20h18" /></>,
  shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-4" /></>,
  users: <><path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>,
}

export function Icon({ name, className = "h-4 w-4" }: { name: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {iconPaths[name]}
    </svg>
  )
}
```

- [ ] **Step 1: Create `apps/web/components/icons.tsx`** with all icon paths + `Icon` component

- [ ] **Step 2: In `landing-page.tsx`, remove the `icons` object, `Icon` function, and update the import to `import { Icon } from "@/components/icons"`**

- [ ] **Step 3: Verify TypeScript clean**

---

## Task 3: Extract PedagemyLogo to logo.tsx

**Files:**
- Create: `apps/web/components/logo.tsx`
- Modify: `apps/web/components/landing-page.tsx` (remove inline logo definitions)

```tsx
export function PedagemyLogo({ light = false }: { light?: boolean }) {
  return (
    <div aria-label="Pedagemy">
      <img
        src="/pedagemy-logo.png"
        alt="Pedagemy"
        className={`h-8 w-auto object-contain ${light ? "brightness-0 invert" : ""}`}
        style={light ? { filter: "brightness(0) invert(1)" } : undefined}
      />
    </div>
  )
}
```

- [ ] **Step 1: Create `apps/web/components/logo.tsx`** with `PedagemyLogo`

- [ ] **Step 2: In `landing-page.tsx`, remove `PedagemyLogoIcon` and `ICubeFarmMark` (not used), remove `PedagemyLogo` function, update import to `import { PedagemyLogo } from "@/components/logo"`**

- [ ] **Step 3: Verify TypeScript clean**

---

## Task 4: Extract Reveal + useReveal to reveal.tsx

**Files:**
- Create: `apps/web/components/reveal.tsx`
- Modify: `apps/web/components/landing-page.tsx` (remove inline reveal definitions)

```tsx
"use client"

import { useEffect, useRef, useState } from "react"

export function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return { ref, visible }
}

export function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useReveal()
  return (
    <div
      ref={ref}
      className={className}
      style={{
        transition: `opacity 800ms cubic-bezier(0.32,0.72,0,1) ${delay}ms, transform 800ms cubic-bezier(0.32,0.72,0,1) ${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
      }}
    >
      {children}
    </div>
  )
}
```

- [ ] **Step 1: Create `apps/web/components/reveal.tsx`** with `useReveal` + `Reveal`

- [ ] **Step 2: In `landing-page.tsx`, remove `useReveal` function and `Reveal` component, update import to `import { Reveal } from "@/components/reveal"`**

- [ ] **Step 3: Verify TypeScript clean**

---

## Task 5: Extract LandingFooter to landing-footer.tsx

**Files:**
- Create: `apps/web/components/landing-footer.tsx`
- Modify: `apps/web/components/landing-page.tsx` (remove inline footer JSX)

Props interface:
```tsx
interface LandingFooterProps {
  footerEmail: string
  englishPhone: string
  frenchSpanishPhone: string
  copyright: string
}
```

Footer JSX to extract (current from landing-page.tsx):
```tsx
<footer className="fixed inset-x-0 bottom-0 z-50 h-20 border-t border-[#1A1A2E]/8 bg-[#F7F9FC] px-6 py-10 sm:px-8 lg:px-12">
  <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 sm:flex-row sm:items-center">
    <PedagemyLogo />
    <div className="flex flex-col items-center gap-1 text-center text-[12px] text-[#1A1A2E]/40">
      <a href={`mailto:${footerEmail}`} className="transition-colors duration-200 hover:text-[#1A1A2E]/70">{footerEmail}</a>
      <div className="flex gap-4">
        <span>English: <a href={`tel:${englishPhone.replace(/\s/g, "")}`} className="transition-colors duration-200 hover:text-[#1A1A2E]/70">{englishPhone}</a></span>
        <span>French and Spanish: <a href={`tel:${frenchSpanishPhone.replace(/\s/g, "")}`} className="transition-colors duration-200 hover:text-[#1A1A2E]/70">{frenchSpanishPhone}</a></span>
      </div>
    </div>
    <p className="text-[12px] text-[#1A1A2E]/22">{copyright}</p>
  </div>
</footer>
```

- [ ] **Step 1: Create `apps/web/components/landing-footer.tsx`** with `LandingFooterProps` interface and `LandingFooter` component**

- [ ] **Step 2: In `landing-page.tsx`, remove inline footer JSX, import `LandingFooter`, pass `t("contact.footerEmail")` etc. as props**

- [ ] **Step 3: Verify TypeScript clean**

---

## Task 6: Extract LandingNav to landing-nav.tsx

**Files:**
- Create: `apps/web/components/landing-nav.tsx`
- Modify: `apps/web/components/landing-page.tsx` (remove inline nav JSX)

Props interface:
```tsx
interface LandingNavProps {
  registrationsLabel: string
}
```

Nav JSX to extract (from landing-page.tsx):
```tsx
<div className="sticky top-0 z-50 flex justify-center px-4 pt-4">
  <nav className="flex h-14 w-full max-w-5xl items-center justify-between rounded-lg border border-[#1A1A2E]/10 bg-[#F7F9FC]/90 px-5 shadow-[0_2px_24px_rgba(26,26,46,0.06)] backdrop-blur-xl">
    <PedagemyLogo />
    <div className="flex items-center gap-4">
      <span className="hidden items-center gap-2 text-[12px] text-[#1A1A2E]/40 sm:flex">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/80" />
        {registrationsLabel}
      </span>
      <LanguageSwitcher />
    </div>
  </nav>
</div>
```

- [ ] **Step 1: Create `apps/web/components/landing-nav.tsx`** with `LandingNavProps` and `LandingNav` component

- [ ] **Step 2: In `landing-page.tsx`, remove inline nav JSX, import `LandingNav`, pass `t("nav.registrationsOngoing", ...)` as `registrationsLabel`**

- [ ] **Step 3: Verify TypeScript clean**

---

## Task 7: Extract CourseAccordion to course-accordion.tsx

**Files:**
- Create: `apps/web/components/course-accordion.tsx`
- Modify: `apps/web/components/landing-page.tsx` (remove inline accordion JSX from hero section)

Props interface:
```tsx
interface CourseAccordionProps {
  course: {
    value: string
    price: string
    icon: string
    key: string
    descriptions: string[]
  }
  isSelected: boolean
  onToggle: () => void
}
```

The accordion JSX is the inner `<button>` block from `landing-page.tsx` lines 438–530:
- Uses `Icon` for the course icon
- `maxHeight: isSelected ? "500px" : "0px"` for animation
- `descriptions.map(...)` for the bullet list
- All Tailwind classes preserved exactly

- [ ] **Step 1: Create `apps/web/components/course-accordion.tsx`** with `CourseAccordionProps` and `CourseAccordion` component**

- [ ] **Step 2: In `landing-page.tsx`, replace the inline accordion button JSX with `<CourseAccordion course={...} isSelected={...} onToggle={...} />`**

- [ ] **Step 3: Verify TypeScript clean**

---

## Task 8: Extract HeroSection to hero-section.tsx

**Files:**
- Create: `apps/web/components/hero-section.tsx`
- Modify: `apps/web/components/landing-page.tsx` (remove inline hero section JSX)

Props interface:
```tsx
interface HeroSectionProps {
  headline: string
  questionLabel: string
  questionContext: string
  courseOptions: CourseOption[]
  selectedCourse: string
  onCourseSelect: (value: string) => void
}

interface CourseOption {
  value: string
  price: string
  icon: string
  key: string
}
```

Hero section JSX is from `landing-page.tsx` lines ~413–533:
- Wraps both left column (headline + accordion list) and right column in `lg:grid lg:grid-cols-[1fr_460px]` grid
- Uses `Reveal` wrapper with `delay={80}` around left column
- Maps `courseOptions` to `CourseAccordion` components

Note: `descriptions` is NOT in `CourseOption` — it's derived from `t()` in the hero section using `t(\`courses.\${course.key}.description\`, { returnObjects: true })`. The `HeroSection` receives the fully resolved `courseOptions` array with `descriptions: string[]` already populated, OR it receives the `t` function as a prop to resolve descriptions itself.

**Decision for prop design**: `HeroSection` calls `t()` internally for descriptions, since the i18n key pattern `courses.${course.key}.description` is an internal detail. The parent only passes `courseOptions` (without descriptions), and `HeroSection` resolves them.

- [ ] **Step 1: Create `apps/web/components/hero-section.tsx`** with `HeroSectionProps`, `CourseOption` type, and `HeroSection` component. Inside, `useTranslation()` is called to resolve `t(\`courses.\${course.key}.description\`, { returnObjects: true })` per course.**

- [ ] **Step 2: In `landing-page.tsx`, remove inline hero section JSX (the `<section>` block), import `HeroSection`, pass `headline`, `questionLabel`, `questionContext`, `courseOptions`, `selectedCourse`, `onCourseSelect`**

- [ ] **Step 3: Verify TypeScript clean**

---

## Task 9: Extract ApplicationForm to application-form.tsx + application-form-panel.tsx

**Files:**
- Create: `apps/web/components/application-form.tsx`
- Create: `apps/web/components/application-form-panel.tsx`
- Modify: `apps/web/components/landing-page.tsx` (remove inline form JSX)

### application-form.tsx — pure form UI

Props interface:
```tsx
interface ApplicationFormProps {
  selectedCourse: string
  courseOptions: CourseOption[]
  submitting: boolean
  submitError: string | null
  submitted: boolean
  onCourseSelect: (value: string) => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>
  // All form strings:
  formTitle: string
  formSubtitle: string
  fullNameLabel: string
  fullNamePlaceholder: string
  emailLabel: string
  emailPlaceholder: string
  phoneLabel: string
  phonePlaceholder: string
  programmeLabel: string
  reasonLabel: string
  reasonPlaceholder: string
  errorGeneric: string
  errorNetwork: string
  noPayment: string
  submitLabel: string
  submittingLabel: string
  successTitle: string
  successBody: string
}
```

Contains all form JSX: the `<form onSubmit>` block and the success state div.

### application-form-panel.tsx — wrapper for two-column grid

Props interface (extends ApplicationFormProps + adds panel-specific strings):
```tsx
interface ApplicationFormPanelProps extends ApplicationFormProps {
  successIcon: React.ReactNode  // the checkmark icon JSX
}
```

Wraps `ApplicationForm` in the two-column grid cell with `lg:sticky lg:top-24`:
```tsx
<Reveal delay={120} className="lg:sticky lg:top-24">
  <div className="rounded-xl border border-[#1A1A2E]/8 bg-white p-1.5 shadow-[0_8px_48px_rgba(26,26,46,0.07)]">
    <ApplicationForm {...props} />
  </div>
</Reveal>
```

- [ ] **Step 1: Create `apps/web/components/application-form.tsx`** with `ApplicationFormProps` and `ApplicationForm` component (all form JSX)**

- [ ] **Step 2: Create `apps/web/components/application-form-panel.tsx`** with `ApplicationFormPanelProps` and `ApplicationFormPanel` (grid cell + sticky wrapper + calls `ApplicationForm`)**

- [ ] **Step 3: In `landing-page.tsx`, remove inline form JSX, import `ApplicationFormPanel`, pass all props including handlers (`handleSubmit`) and all form strings from `t()` calls**

- [ ] **Step 4: Verify TypeScript clean**

---

## Task 10: Simplify landing-page.tsx

**Files:**
- Modify: `apps/web/components/landing-page.tsx`

The final `landing-page.tsx` should be ~40-50 lines:

```tsx
"use client"

import React, { useState } from "react"
import { useTranslation } from "react-i18next"

import { LandingNav } from "@/components/landing-nav"
import { LandingFooter } from "@/components/landing-footer"
import { HeroSection } from "@/components/hero-section"
import { ApplicationFormPanel } from "@/components/application-form-panel"

const courseOptions = [
  { value: "Skillsoft Expert", price: "$300", icon: "users", key: "softSkills" },
  { value: "Codecademy Expert", price: "$325", icon: "laptop", key: "techCareer" },
  { value: "Leadership SLDP", price: "$70", icon: "briefcase", key: "leadership" },
  { value: "Compliance Complete", price: "$60", icon: "shield", key: "workplaceReadiness" },
]

const defaultCourse = courseOptions[1] ?? courseOptions[0]

export default function PedagemyEarlyAccessLandingPage() {
  const { t, i18n } = useTranslation()
  const [selectedCourse, setSelectedCourse] = useState(defaultCourse.value)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitError(null)
    const formData = new FormData(e.currentTarget)
    const payload = {
      course: selectedCourse,
      email: String(formData.get("email") ?? ""),
      name: String(formData.get("name") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      reason: String(formData.get("reason") ?? ""),
      locale: i18n.language,
    }
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = (await response.json()) as { error?: string; ok?: boolean }
      if (!response.ok || !data.ok) {
        setSubmitError(t("form.errorGeneric"))
        return
      }
      setSubmitted(true)
    } catch {
      setSubmitError(t("form.errorNetwork"))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col min-h-dvh bg-[#F7F9FC] font-(family-name:--font-dm-sans) text-[#1A1A2E] antialiased">
      <div className="flex-1 pb-20">
        <LandingNav registrationsLabel={t("nav.registrationsOngoing", "Early access registrations ongoing")} />
        <HeroSection
          headline={t("hero.headline")}
          questionLabel={t("hero.questionLabel")}
          questionContext={t("hero.questionContext")}
          courseOptions={courseOptions}
          selectedCourse={selectedCourse}
          onCourseSelect={setSelectedCourse}
        />
        <ApplicationFormPanel
          selectedCourse={selectedCourse}
          courseOptions={courseOptions}
          submitted={submitted}
          submitting={submitting}
          submitError={submitError}
          onCourseSelect={setSelectedCourse}
          onSubmit={handleSubmit}
          // ... all form strings from t() calls
        />
      </div>
      <LandingFooter
        footerEmail={t("contact.footerEmail")}
        englishPhone={t("contact.englishPhone")}
        frenchSpanishPhone={t("contact.frenchSpanishPhone")}
        copyright={t("footer.copyright")}
      />
    </div>
  )
}
```

- [ ] **Step 1: Rewrite `landing-page.tsx`** — keep state, keep `handleSubmit`, remove all inline component JSX, import and compose all extracted components**

- [ ] **Step 2: Verify TypeScript clean on all component files**

- [ ] **Step 3: Run `bun run dev`, verify /en, /fr, /es return HTTP 200**

- [ ] **Step 4: Test accordion expand — verify footer stays fixed at viewport bottom**

- [ ] **Step 5: Verify no console errors**

---

## Verification Checklist

- [ ] `/en` → HTTP 200, footer visible at viewport bottom
- [ ] `/fr` → HTTP 200
- [ ] `/es` → HTTP 200
- [ ] Expand all course accordions — footer stays fixed at viewport bottom
- [ ] Collapse all — footer stays fixed
- [ ] Scroll to bottom — footer still visible at viewport bottom
- [ ] TypeScript: `lsp_diagnostics` clean on all new/modified files
- [ ] No new `"use client"` directives added unnecessarily
