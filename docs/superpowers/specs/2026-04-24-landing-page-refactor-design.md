# Landing Page Refactor: Sticky Footer + Component Decomposition

## Status
Approved by user. Pending implementation.

---

## 1. Sticky Footer Fix

### Problem
Footer goes below the viewport when course accordions expand. The current flex-column layout with `flex-1` content + footer outside is technically correct for document flow, but when content grows beyond the viewport the footer scrolls away.

### Solution
`position: fixed` footer anchored to viewport bottom.

### Implementation
In `landing-page.tsx`:

```jsx
<div className="flex flex-col min-h-dvh bg-[#F7F9FC]">
  {/* pb-20 = footer height, prevents footer from covering bottom of form/accordion */}
  <div className="flex-1 pb-20">
    {/* nav */}
    {/* hero + form + accordions */}
  </div>
  {/* fixed footer — always at viewport bottom */}
  <footer className="fixed inset-x-0 bottom-0 z-50 h-20 border-t border-[#1A1A2E]/8 bg-[#F7F9FC] px-6 py-10 sm:px-8 lg:px-12">
    {/* logo + contacts + copyright */}
  </footer>
</div>
```

### Key decisions
- `position: fixed inset-x-0 bottom-0` — footer always visible at viewport bottom
- `pb-20` (80px) on content wrapper — reserved space so footer doesn't cover bottom of form when scrolled
- `h-20` explicit footer height — matches pb-20 exactly
- `z-50` on footer — above most content, below modals
- The outer `flex flex-col min-h-dvh` stays — ensures page fills viewport when content is short

---

## 2. Component Decomposition

### Principle
All sub-components receive data via **props only**. No component calls `useTranslation()` directly except `landing-page.tsx`. `landing-page.tsx` owns all state and i18n calls.

### File Map

| Component | File | Role | Type |
|---|---|---|---|
| `LandingNav` | `landing-nav.tsx` | Sticky nav bar with logo, status badge, language switcher | Client |
| `HeroSection` | `hero-section.tsx` | Hero headline + course accordion | Client |
| `CourseAccordion` | `course-accordion.tsx` | Single course option row with expandable descriptions | Client |
| `ApplicationForm` | `application-form.tsx` | Full registration form with submit/error/success states | Client |
| `ApplicationFormPanel` | `application-form-panel.tsx` | Form wrapped in two-column grid cell with sticky positioning | Client |
| `LandingFooter` | `landing-footer.tsx` | Footer with logo, contact info, copyright | Client |
| `Icon` | `icons.tsx` | SVG icon helper (accepts name, renders path) | Presentational |
| `PedagemyLogo` | `logo.tsx` | Pedagemy logo image + optional light/invert variant | Presentational |
| `Reveal` | `reveal.tsx` | Scroll-reveal wrapper using IntersectionObserver | Client |
| `useReveal` | `reveal.tsx` (same file) | Hook: IntersectionObserver -> `visible` boolean | Client |
| `PedagemyEarlyAccessLandingPage` | `landing-page.tsx` | Root component: state, i18n, composition | Client |

### Data Flow (landing-page.tsx)

```
landing-page.tsx
  ├── useState: selectedCourse, submitted, submitting, submitError
  ├── useTranslation()
  ├── t("hero.headline")  → HeroSection headline={string}
  ├── t("hero.subheadline")  → HeroSection subheadline={string}
  ├── courseOptions (static array)  → HeroSection courseOptions={CourseOption[]}
  ├── selectedCourse (state)  → HeroSection selectedCourse={string}
  └── setSelectedCourse (fn)  → HeroSection onCourseSelect={fn}

LandingNav receives: t (function)
LandingFooter receives: t (function)
ApplicationFormPanel receives: t, selectedCourse, submitting, submitError + handlers
```

### Props Interfaces

```typescript
// hero-section.tsx
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
  descriptions: string[]
}

// course-accordion.tsx
interface CourseAccordionProps {
  course: CourseOption
  isSelected: boolean
  onToggle: () => void
}

// application-form.tsx
interface ApplicationFormProps {
  selectedCourse: string
  courseOptions: CourseOption[]
  submitting: boolean
  submitError: string | null
  onCourseSelect: (value: string) => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>
}

// application-form-panel.tsx
interface ApplicationFormPanelProps extends ApplicationFormProps {
  formTitle: string
  formSubtitle: string
  fullNameLabel: string
  // ... all form strings
  successTitle: string
  successBody: string
}

// landing-nav.tsx
interface LandingNavProps {
  registrationsLabel: string
}

// landing-footer.tsx
interface LandingFooterProps {
  footerEmail: string
  englishPhone: string
  frenchSpanishPhone: string
  copyright: string
}
```

---

## 3. Implementation Order

1. Fix footer layout in `landing-page.tsx` (position: fixed, pb-20, h-20)
2. Extract `Icon` + `PedagemyLogo` to shared files
3. Extract `Reveal` + `useReveal`
4. Extract `LandingFooter`
5. Extract `LandingNav`
6. Extract `CourseAccordion`
7. Extract `ApplicationForm` + `ApplicationFormPanel`
8. Extract `HeroSection`
9. Simplify `landing-page.tsx` to pure composition
10. Verify all 3 locale routes return 200, no console errors

---

## 4. Constraints

- All components remain `"use client"` (existing pattern)
- Footer stays `position: fixed` — no layout shift on scroll
- `pb-20` / `h-20` must stay in sync (80px)
- `z-50` on footer, `z-50` on nav — no conflict
- No new dependencies
