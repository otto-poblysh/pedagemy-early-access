"use client"

import React, { useState } from "react"
import { LandingFooter } from "@/components/landing-footer"
import { LandingNav } from "@/components/landing-nav"
import { HeroSection } from "@/components/hero-section"
import { ApplicationFormPanel } from "@/components/application-form-panel"
import { useTranslation } from "react-i18next"

const courseOptions = [
  {
    value: "Skillsoft Expert",
    original: "Skillsoft Expert",
    price: "$300",
    icon: "users",
    key: "softSkills",
  },
  {
    value: "Codecademy Expert",
    original: "Codecademy Expert",
    price: "$325",
    icon: "laptop",
    key: "techCareer",
  },
  {
    value: "Leadership SLDP",
    original: "Leadership (SLDP)",
    price: "$70",
    icon: "briefcase",
    key: "leadership",
  },
  {
    value: "Compliance Complete",
    original: "Compliance Complete",
    price: "$60",
    icon: "shield",
    key: "workplaceReadiness",
  },
]

const defaultCourse = getDefaultCourse()

function getDefaultCourse() {
  const course = courseOptions[1] ?? courseOptions[0]
  if (!course) throw new Error("At least one course option is required.")
  return course
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function PedagemyEarlyAccessLandingPage() {
  const { t, i18n } = useTranslation()
  const [selectedCourse, setSelectedCourse] = useState(defaultCourse.value)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)
    setSubmitError(null)

    const formData = new FormData(event.currentTarget)
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
    <div className="flex min-h-dvh flex-col bg-[#F7F9FC] font-(family-name:--font-dm-sans) text-[#1A1A2E] antialiased">
      <div className="flex-1 pb-52 sm:pb-28">
        <LandingNav
          registrationsLabel={t(
            "nav.registrationsOngoing",
            "Early access registrations ongoing"
          )}
        />

        <section className="mx-auto grid max-w-7xl items-start gap-10 px-6 py-12 sm:px-8 sm:py-16 lg:grid-cols-[minmax(0,1fr)_460px] lg:gap-16 lg:px-12 lg:py-24 xl:gap-20">
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
            formTitle={t("form.title")}
            formSubtitle={t("form.subtitle")}
            fullNameLabel={t("form.fullName")}
            fullNamePlaceholder={t("form.fullNamePlaceholder")}
            emailLabel={t("form.email")}
            emailPlaceholder={t("form.emailPlaceholder")}
            phoneLabel={t("form.phone")}
            phonePlaceholder={t("form.phonePlaceholder")}
            programmeLabel={t("form.programme")}
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
