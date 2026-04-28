"use client"

import React, { useState } from "react"
import CountryList from "country-list-with-dial-code-and-flag"
import { LandingFooter } from "@/components/landing-footer"
import { LandingNav } from "@/components/landing-nav"
import { HeroSection } from "@/components/hero-section"
import { ApplicationFormPanel } from "@/components/application-form-panel"
import { useTranslation } from "react-i18next"

const courseCatalog = [
  {
    price: "$300",
    icon: "users",
    key: "softSkills",
  },
  {
    price: "$325",
    icon: "laptop",
    key: "techCareer",
  },
  {
    price: "$70",
    icon: "briefcase",
    key: "leadership",
  },
  {
    price: "$60",
    icon: "shield",
    key: "workplaceReadiness",
  },
]

const countryListApi = (
  CountryList as typeof CountryList & { default?: typeof CountryList }
).default ?? CountryList

type CourseKey = (typeof courseCatalog)[number]["key"]

export interface CountryCodeOption {
  country: string
  flag: string
  id: string
  value: string
}

const supportedCountryNameLocales = new Set(["en", "fr", "es"])
const countryDisplayNamesCache = new Map<string, Intl.DisplayNames | null>()

function normalizeCountryNameLocale(locale?: string) {
  const baseLocale = locale?.trim().toLowerCase().split("-")[0]

  if (baseLocale && supportedCountryNameLocales.has(baseLocale)) {
    return baseLocale
  }

  return "en"
}

function getCountryDisplayNames(locale: string) {
  if (!countryDisplayNamesCache.has(locale)) {
    countryDisplayNamesCache.set(
      locale,
      typeof Intl.DisplayNames === "function"
        ? new Intl.DisplayNames([locale, "en"], { type: "region" })
        : null
    )
  }

  return countryDisplayNamesCache.get(locale) ?? null
}

export function buildCountryCodeOptions(locale = "en"): CountryCodeOption[] {
  const normalizedLocale = normalizeCountryNameLocale(locale)
  const displayNames = getCountryDisplayNames(normalizedLocale)
  const seenOptionIds = new Set<string>()

  return countryListApi.getAll().flatMap((country) => {
    const optionId = `${country.code}-${country.dialCode}`

    if (seenOptionIds.has(optionId)) {
      return []
    }

    seenOptionIds.add(optionId)

    return {
      country: displayNames?.of(country.code) ?? country.name,
      flag: country.flag,
      id: optionId,
      value: country.dialCode,
    }
  })
}

export function filterCountryCodeOptions(
  options: CountryCodeOption[],
  query: string
): CountryCodeOption[] {
  const normalizedQuery = query.trim().toLowerCase()

  if (!normalizedQuery) {
    return options
  }

  return options.filter((option) =>
    `${option.country} ${option.value}`
      .toLowerCase()
      .includes(normalizedQuery)
  )
}

export interface CourseOption {
  value: CourseKey
  label: string
  price: string
  icon: string
  key: CourseKey
}

type RegistrationField =
  | "name"
  | "email"
  | "phoneCountryCode"
  | "phoneNumber"
  | "course"
  | "reason"

type RegistrationValues = Record<RegistrationField, string>

type ValidationMessages = {
  duplicateEmail: string
  emailRequired: string
  invalidEmail: string
  nameRequired: string
  nameInvalid: string
  phoneCountryCodeRequired: string
  phoneNumberRequired: string
  reasonRequired: string
  selectProgram: string
}

type FieldErrors = Partial<Record<RegistrationField, string>>

export function buildCourseOptions(
  t: (key: string) => string
): CourseOption[] {
  return courseCatalog.map((course) => ({
    ...course,
    label: t(`courses.${course.key}.label`),
    value: course.key,
  }))
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function hasAtLeastTwoNames(name: string) {
  return name.trim().split(/\s+/).filter(Boolean).length >= 2
}

export function validateRegistrationFields(
  values: RegistrationValues,
  messages: ValidationMessages
): FieldErrors {
  const errors: FieldErrors = {}

  const name = values.name.trim()
  if (!name) {
    errors.name = messages.nameRequired
  } else if (!hasAtLeastTwoNames(name)) {
    errors.name = messages.nameInvalid
  }

  const email = values.email.trim()
  if (!email) {
    errors.email = messages.emailRequired
  } else if (!isValidEmail(email)) {
    errors.email = messages.invalidEmail
  }

  if (!values.phoneCountryCode.trim()) {
    errors.phoneCountryCode = messages.phoneCountryCodeRequired
  }

  if (!values.phoneNumber.trim()) {
    errors.phoneNumber = messages.phoneNumberRequired
  }

  if (!values.course.trim()) {
    errors.course = messages.selectProgram
  }

  if (!values.reason.trim()) {
    errors.reason = messages.reasonRequired
  }

  return errors
}

function clearFieldError(
  errors: FieldErrors,
  field: RegistrationField
): FieldErrors {
  if (!errors[field]) {
    return errors
  }

  const nextErrors = { ...errors }
  delete nextErrors[field]
  return nextErrors
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function PedagemyEarlyAccessLandingPage() {
  const { t, i18n } = useTranslation()
  const courseOptions = buildCourseOptions(t)
  const countryCodeOptions = buildCountryCodeOptions(i18n.language)
  const [selectedCourse, setSelectedCourse] = useState<CourseKey | "">("")
  const [selectedCountryCode, setSelectedCountryCode] = useState("")
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleFieldChange = (field: RegistrationField) => {
    setFieldErrors((currentErrors) => clearFieldError(currentErrors, field))
  }

  const handleCourseSelect = (value: string) => {
    setSelectedCourse(value as CourseKey | "")
    handleFieldChange("course")
  }

  const handleCountryCodeSelect = (value: string) => {
    setSelectedCountryCode(value)
    handleFieldChange("phoneCountryCode")
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitError(null)

    const formData = new FormData(event.currentTarget)
    const values: RegistrationValues = {
      course: selectedCourse,
      email: String(formData.get("email") ?? ""),
      name: String(formData.get("name") ?? ""),
      phoneCountryCode: selectedCountryCode,
      phoneNumber: String(formData.get("phoneNumber") ?? ""),
      reason: String(formData.get("reason") ?? ""),
    }

    const nextFieldErrors = validateRegistrationFields(values, {
      duplicateEmail: t("form.errorDuplicateEmail"),
      emailRequired: t("form.errorEmailRequired"),
      invalidEmail: t("form.errorInvalidEmail"),
      nameRequired: t("form.errorNameRequired"),
      nameInvalid: t("form.errorNameInvalid"),
      phoneCountryCodeRequired: t("form.errorPhoneCountryCodeRequired"),
      phoneNumberRequired: t("form.errorPhoneRequired"),
      reasonRequired: t("form.errorReasonRequired"),
      selectProgram: t("form.programmePlaceholder"),
    })

    if (Object.keys(nextFieldErrors).length > 0) {
      setFieldErrors(nextFieldErrors)
      return
    }

    setFieldErrors({})
    setSubmitting(true)

    const selectedCourseOption = courseOptions.find(
      (course) => course.value === selectedCourse
    )
    const payload = {
      course: selectedCourseOption?.label ?? "",
      email: values.email,
      name: values.name,
      phone: `${values.phoneCountryCode} ${values.phoneNumber.trim()}`.trim(),
      reason: values.reason,
      locale: i18n.language,
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = (await response.json()) as {
        code?: string
        error?: string
        ok?: boolean
      }

      if (!response.ok || !data.ok) {
        if (data.code === "DUPLICATE_EMAIL") {
          setFieldErrors((currentErrors) => ({
            ...currentErrors,
            email: t("form.errorDuplicateEmail"),
          }))
          return
        }

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
    <div className="relative flex min-h-dvh flex-col overflow-x-hidden bg-[#F3F6FB] font-(family-name:--font-dm-sans) text-[#1A1A2E] antialiased">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_top_left,rgba(0,86,210,0.14),transparent_34%),radial-gradient(circle_at_top_right,rgba(26,26,46,0.10),transparent_36%),linear-gradient(180deg,#F9FBFF_0%,#F3F6FB_54%,#EEF3F8_100%)]" />
      <div className="pointer-events-none absolute inset-x-10 top-20 h-px bg-[linear-gradient(90deg,transparent,rgba(26,26,46,0.14),transparent)]" />

      <div className="relative flex-1">
        <LandingNav
          registrationsLabel={t(
            "nav.registrationsOngoing",
            "Early access registrations ongoing"
          )}
        />

        <section className="mx-auto grid max-w-[1380px] items-start gap-12 px-6 py-14 sm:px-8 sm:py-18 lg:grid-cols-[minmax(0,1fr)_470px] lg:gap-18 lg:px-12 lg:py-24 xl:gap-24 xl:px-16">
          <HeroSection
            headline={t("hero.headline")}
            questionLabel={t("hero.questionLabel")}
            questionContext={t("hero.questionContext")}
            courseOptions={courseOptions}
            selectedCourse={selectedCourse}
            onCourseSelect={handleCourseSelect}
          />

          <ApplicationFormPanel
            selectedCourse={selectedCourse}
            courseOptions={courseOptions}
            countryCodeOptions={countryCodeOptions as never}
            selectedCountryCode={selectedCountryCode}
            submitted={submitted}
            submitting={submitting}
            fieldErrors={fieldErrors}
            submitError={submitError}
            onCourseSelect={handleCourseSelect}
            onCountryCodeSelect={handleCountryCodeSelect}
            onFieldChange={handleFieldChange}
            onSubmit={handleSubmit}
            formTitle={t("form.title")}
            formSubtitle={t("form.subtitle")}
            fullNameLabel={t("form.fullName")}
            fullNamePlaceholder={t("form.fullNamePlaceholder")}
            emailLabel={t("form.email")}
            emailPlaceholder={t("form.emailPlaceholder")}
            phoneLabel={t("form.phone")}
            phoneCountryCodePlaceholder={t("form.phoneCountryCodePlaceholder")}
            phoneCountryCodeSearchPlaceholder={t(
              "form.phoneCountryCodeSearchPlaceholder"
            )}
            phonePlaceholder={t("form.phonePlaceholder")}
            programmeLabel={t("form.programme")}
            programmePlaceholder={t("form.programmePlaceholder")}
            reasonLabel={t("form.reason")}
            reasonPlaceholder={t("form.reasonPlaceholder")}
            noPayment={t("form.noPayment")}
            submitLabel={t("form.submit")}
            submittingLabel={t("form.submitting")}
            successTitle={t("form.successTitle")}
            successBody={t("form.successBody")}
          />
        </section>
      </div>

      <LandingFooter
        footerEmail={t("contact.footerEmail")}
        englishPhone={t("contact.englishPhone")}
        englishPhoneLabel={t("contact.englishPhoneLabel")}
        frenchSpanishPhone={t("contact.frenchSpanishPhone")}
        frenchSpanishPhoneLabel={t("contact.frenchSpanishPhoneLabel")}
        copyright={t("footer.copyright")}
      />
    </div>
  )
}
