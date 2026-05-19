"use client"

import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { PedagemyLogo } from "@/components/logo"
import { LanguageSwitcher } from "@/components/language-switcher"
import { Check, Loader2 } from "lucide-react"

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default function ComingSoonPage() {
  const { t, i18n } = useTranslation()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [nameError, setNameError] = useState("")
  const [emailError, setEmailError] = useState("")
  const [submitError, setSubmitError] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitError("")
    setNameError("")
    setEmailError("")

    const trimmedName = name.trim()
    const trimmedEmail = email.trim()

    let hasError = false
    if (!trimmedName) {
      setNameError(t("comingSoon.form.errorRequired"))
      hasError = true
    }
    if (!trimmedEmail) {
      setEmailError(t("comingSoon.form.errorRequired"))
      hasError = true
    } else if (!isValidEmail(trimmedEmail)) {
      setEmailError(t("comingSoon.form.errorInvalidEmail"))
      hasError = true
    }

    if (hasError) return

    setSubmitting(true)

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          locale: i18n.language,
        }),
      })
      const data = (await response.json()) as {
        code?: string
        error?: string
        ok?: boolean
      }

      if (!response.ok || !data.ok) {
        if (data.code === "DUPLICATE_EMAIL") {
          setEmailError(t("comingSoon.form.errorDuplicateEmail"))
          setSubmitting(false)
          return
        }
        setSubmitError(t("comingSoon.form.errorGeneric"))
        setSubmitting(false)
        return
      }

      setSubmitted(true)
    } catch {
      setSubmitError(t("comingSoon.form.errorGeneric"))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="relative flex min-h-dvh flex-col overflow-x-hidden bg-[#F3F6FB] font-(family-name:--font-dm-sans) text-[#1A1A2E] antialiased">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_top_left,rgba(0,86,210,0.14),transparent_34%),radial-gradient(circle_at_top_right,rgba(26,26,46,0.10),transparent_36%),linear-gradient(180deg,#F9FBFF_0%,#F3F6FB_54%,#EEF3F8_100%)]" />
      <div className="pointer-events-none absolute inset-x-10 top-20 h-px bg-[linear-gradient(90deg,transparent,rgba(26,26,46,0.14),transparent)]" />

      <div className="relative flex flex-1 flex-col">
        {/* Nav */}
        <div className="sticky top-0 z-50 flex justify-center px-4 pt-5">
          <nav className="flex h-15 w-full max-w-6xl items-center justify-between rounded-full border border-white/80 bg-white/72 px-6 shadow-[0_14px_44px_rgba(15,23,42,0.08)] backdrop-blur-2xl">
            <PedagemyLogo />
            <LanguageSwitcher />
          </nav>
        </div>

        {/* Main Content */}
        <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-6 py-16 text-center">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#0056D2]/15 bg-[#0056D2]/[0.06] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#0056D2]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#0056D2] shadow-[0_0_0_4px_rgba(0,86,210,0.12)]" />
            {t("comingSoon.badge")}
          </span>

          <h1 className="text-[clamp(40px,8vw,72px)] font-black tracking-[-0.05em] leading-[1.05] text-[#1A1A2E]">
            {t("comingSoon.headline")}
          </h1>

          <p className="mt-4 max-w-md text-[15px] leading-7 text-[#44506A]">
            {t("comingSoon.whatIsBody")}
          </p>

          <div className="mt-8 w-full max-w-lg rounded-[28px] border border-white/75 bg-white/80 p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-10">
            <h2 className="text-xl font-black tracking-[-0.03em] text-[#182032]">
              {t("comingSoon.waitlistTitle")}
            </h2>
            <p className="mt-1 text-sm font-semibold uppercase tracking-[0.06em] text-[#0056D2]">
              {t("comingSoon.waitlistSubtitle")}
            </p>
            <p className="mt-3 text-[15px] leading-7 text-[#44506A]">
              {t("comingSoon.waitlistBody")}
            </p>

            <ul className="mt-5 grid gap-2.5 text-left sm:grid-cols-2">
              {(t("comingSoon.waitlistBenefits", { returnObjects: true }) as string[]).map(
                (benefit, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-[14px] leading-6 text-[#3B4557]"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#0056D2]" />
                    {benefit}
                  </li>
                ),
              )}
            </ul>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="mt-7 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-left">
                    <span className="text-[12px] font-black uppercase tracking-[0.08em] text-[#44506A]">
                      {t("comingSoon.form.nameLabel")}
                    </span>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value)
                        setNameError("")
                      }}
                      placeholder={t("comingSoon.form.namePlaceholder")}
                      className="mt-1.5 w-full rounded-2xl border border-[#DDE3EE] bg-[#F7F9FC] px-4 py-3 text-sm text-[#1A1A2E] outline-none transition placeholder:text-[#8A96AD] focus:border-[#0056D2] focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,86,210,0.1)]"
                    />
                    {nameError ? (
                      <p className="mt-1.5 text-[12px] font-semibold text-[#C0392B]">{nameError}</p>
                    ) : null}
                  </label>

                  <label className="block text-left">
                    <span className="text-[12px] font-black uppercase tracking-[0.08em] text-[#44506A]">
                      {t("comingSoon.form.emailLabel")}
                    </span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        setEmailError("")
                      }}
                      placeholder={t("comingSoon.form.emailPlaceholder")}
                      className="mt-1.5 w-full rounded-2xl border border-[#DDE3EE] bg-[#F7F9FC] px-4 py-3 text-sm text-[#1A1A2E] outline-none transition placeholder:text-[#8A96AD] focus:border-[#0056D2] focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,86,210,0.1)]"
                    />
                    {emailError ? (
                      <p className="mt-1.5 text-[12px] font-semibold text-[#C0392B]">{emailError}</p>
                    ) : null}
                  </label>
                </div>

                {submitError ? (
                  <p className="rounded-xl border border-[#F5C6C6] bg-[#FFF4F4] px-3 py-2 text-sm font-semibold text-[#C0392B]">
                    {submitError}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-full bg-[#0056D2] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#003A8C] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? (
                    <span className="inline-flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {t("comingSoon.form.submitting")}
                    </span>
                  ) : (
                    t("comingSoon.form.submit")
                  )}
                </button>
              </form>
            ) : (
              <div className="mt-7 rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-5">
                <p className="text-base font-bold text-emerald-800">
                  {t("comingSoon.form.successTitle")}
                </p>
                <p className="mt-1 text-sm text-emerald-700">
                  {t("comingSoon.form.successBody")}
                </p>
              </div>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="relative px-6 pb-10 pt-6 text-center">
          <p className="text-sm font-medium tracking-wide text-[#6B7A99]">
            {t("comingSoon.closingLine")}
          </p>
        </footer>
      </div>
    </div>
  )
}
