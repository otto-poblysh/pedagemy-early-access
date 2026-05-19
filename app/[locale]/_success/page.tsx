import type { Metadata } from "next"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import { SuccessPage } from "@/components/success-page"

const COURSE_LABELS: Record<string, string> = {
  softSkills: "Soft Skills Accelerator",
  techCareer: "Tech Career Launchpad",
  leadership: "Leadership Accelerator",
  workplaceReadiness: "Workplace Readiness",
}

const LOCALES = ["en", "fr", "es"] as const

interface PageParams {
  params: Promise<{ locale: string }>
}

interface TranslationSuccess {
  metaTitle?: string
  metaDescription?: string
  headline?: string
  body?: string
  emailNote?: string
  nextStepsTitle?: string
  nextSteps?: string[]
  backToHome?: string
}

interface Translations {
  success?: TranslationSuccess
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { locale } = await params
  const translations = await getTranslations(locale)
  const success = translations.success as TranslationSuccess | undefined
  return {
    title: success?.metaTitle ?? "Application Received — Pedagemy",
    description: success?.metaDescription ?? "Your application has been received.",
  }
}

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

async function getTranslations(locale: string) {
  const translations = await import(`@/public/locales/${locale}/translation.json`)
  return translations.default as Record<string, unknown>
}

function t(translations: Record<string, unknown>, key: string): string {
  const keys = key.split(".")
  let value: unknown = translations
  for (const k of keys) {
    value = (value as Record<string, unknown>)?.[k]
  }
  return typeof value === "string" ? value : key
}

export default async function SuccessRoute({ params }: PageParams) {
  const { locale } = await params

  if (!LOCALES.includes(locale as (typeof LOCALES)[number])) {
    notFound()
  }

  const cookieStore = await cookies()
  const rawCookie = cookieStore.get("pedagemy_registration")?.value

  if (!rawCookie) {
    notFound()
  }

  let sessionData: { name: string; email: string; course: string; locale: string }
  try {
    sessionData = JSON.parse(rawCookie) as { name: string; email: string; course: string; locale: string }
  } catch {
    notFound()
  }

  const translations = await getTranslations(locale)
  const firstName = sessionData.name.trim().split(/\s+/)[0] ?? ""
  const courseName = COURSE_LABELS[sessionData.course] ?? sessionData.course ?? "your selected programme"

  const nextStepsRaw = translations.success as Record<string, unknown> | undefined
  const nextStepsArray = Array.isArray(nextStepsRaw?.nextSteps) ? (nextStepsRaw.nextSteps as string[]) : [
    "Your application is reviewed personally.",
    "If selected, Pedagemy contacts you directly.",
    "Access instructions sent by email.",
  ]

  return (
    <SuccessPage
      firstName={firstName}
      courseName={courseName}
      email={sessionData.email}
      locale={locale}
      headline={t(translations, "success.headline")}
      body={t(translations, "success.body")}
      emailNote={t(translations, "success.emailNote")}
      nextStepsTitle={t(translations, "success.nextStepsTitle")}
      nextSteps={nextStepsArray}
      backToHome={t(translations, "success.backToHome")}
    />
  )
}