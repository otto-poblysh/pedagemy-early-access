"use client"

import React, { useMemo, useState, useEffect, useRef } from "react"
import Image from "next/image"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useTranslation } from "react-i18next"

// ─── Icons (ultra-thin, 1.5 stroke weight) ───────────────────────────────────

const icons: Record<string, React.ReactNode> = {
  arrowUpRight: (
    <>
      <path d="M7 17 17 7" />
      <path d="M7 7h10v10" />
    </>
  ),
  check: <path d="m6 12 4 4 8-8" />,
  briefcase: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
      <path d="M3 12h18" />
    </>
  ),
  laptop: (
    <>
      <rect x="5" y="4" width="14" height="11" rx="2" />
      <path d="M3 20h18" />
    </>
  ),
  shield: (
    <>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  users: (
    <>
      <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
}

function Icon({
  name,
  className = "h-4 w-4",
}: {
  name: string
  className?: string
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {icons[name]}
    </svg>
  )
}

// ─── Logo marks ──────────────────────────────────────────────────────────────

function PedagemyLogoIcon({ light = false }: { light?: boolean }) {
  const blue = light ? "rgba(255,255,255,0.55)" : "#0056D2"
  const red = light ? "rgba(255,255,255,0.2)" : "#C0392B"
  return (
    <svg
      viewBox="0 0 34 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-8 w-auto"
      aria-hidden="true"
    >
      <rect x="0" y="0" width="8" height="44" fill={blue} />
      <rect x="10" y="0" width="6" height="12" fill={blue} />
      <rect x="10" y="32" width="6" height="12" fill={blue} />
      <rect x="18" y="0" width="6" height="12" fill={blue} />
      <rect x="18" y="32" width="6" height="12" fill={blue} />
      <rect x="26" y="0" width="8" height="44" fill={blue} />
      <rect x="10" y="15" width="14" height="4" fill={red} />
      <rect x="10" y="22" width="14" height="4" fill={red} />
    </svg>
  )
}

function ICubeFarmMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 70 70"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect
        x="30.5"
        y="2.5"
        width="9"
        height="9"
        fill="#1A1A2E"
        transform="rotate(45 35 7)"
      />
      <rect
        x="30.5"
        y="58.5"
        width="9"
        height="9"
        fill="#1A1A2E"
        transform="rotate(45 35 63)"
      />
      <rect
        x="2.5"
        y="30.5"
        width="9"
        height="9"
        fill="#1A1A2E"
        transform="rotate(45 7 35)"
      />
      <rect
        x="58.5"
        y="30.5"
        width="9"
        height="9"
        fill="#1A1A2E"
        transform="rotate(45 63 35)"
      />
      <rect
        x="16"
        y="16"
        width="8"
        height="8"
        fill="#1E3A5F"
        transform="rotate(45 20 20)"
      />
      <rect
        x="46"
        y="16"
        width="8"
        height="8"
        fill="#1E3A5F"
        transform="rotate(45 50 20)"
      />
      <rect
        x="16"
        y="46"
        width="8"
        height="8"
        fill="#1E3A5F"
        transform="rotate(45 20 50)"
      />
      <rect
        x="46"
        y="46"
        width="8"
        height="8"
        fill="#1E3A5F"
        transform="rotate(45 50 50)"
      />
      <rect
        x="29.5"
        y="14.5"
        width="11"
        height="11"
        fill="#2857C5"
        transform="rotate(45 35 20)"
      />
      <rect
        x="29.5"
        y="44.5"
        width="11"
        height="11"
        fill="#2857C5"
        transform="rotate(45 35 50)"
      />
      <rect
        x="14.5"
        y="29.5"
        width="11"
        height="11"
        fill="#2857C5"
        transform="rotate(45 20 35)"
      />
      <rect
        x="44.5"
        y="29.5"
        width="11"
        height="11"
        fill="#2857C5"
        transform="rotate(45 50 35)"
      />
      <rect
        x="29.5"
        y="29.5"
        width="11"
        height="11"
        fill="#1A1A2E"
        transform="rotate(45 35 35)"
      />
      <rect
        x="32"
        y="32"
        width="6"
        height="6"
        fill="#7BAAD4"
        transform="rotate(45 35 35)"
      />
    </svg>
  )
}

function PedagemyLogo({ light = false }: { light?: boolean }) {
  return (
    <div aria-label="Pedagemy">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/pedagemy-logo.png"
        alt="Pedagemy"
        className={`h-8 w-auto object-contain ${light ? "brightness-0 invert" : ""}`}
        style={light ? { filter: "brightness(0) invert(1)" } : undefined}
      />
    </div>
  )
}

// ─── Data ─────────────────────────────────────────────────────────────────────

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

// ─── Scroll reveal ────────────────────────────────────────────────────────────

function useReveal() {
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

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
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

// ─── Main component ───────────────────────────────────────────────────────────

export default function PedagemyEarlyAccessLandingPage() {
  const { t, i18n } = useTranslation()
  const [selectedCourse, setSelectedCourse] = useState(defaultCourse.value)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [openFaq, setOpenFaq] = useState<number>(0)

  const processSteps = t("process.steps", { returnObjects: true }) as Array<{
    n: string
    title: string
    body: string
  }>
  const faqItems = t("faq.items", { returnObjects: true }) as Array<{
    q: string
    a: string
  }>

  const activeCourse = useMemo(
    () =>
      courseOptions.find((c) => c.value === selectedCourse) ?? defaultCourse,
    [selectedCourse]
  )

  const scrollToForm = () => {
    document
      .getElementById("application-form")
      ?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

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
    <div className="flex flex-col min-h-dvh bg-[#F7F9FC] font-(family-name:--font-dm-sans) text-[#1A1A2E] antialiased">
      <div className="flex-1">
        {/* ── Floating Nav ───────────────────────────────────────────────────── */}
        <div className="sticky top-0 z-50 flex justify-center px-4 pt-4">
          <nav className="flex h-14 w-full max-w-5xl items-center justify-between rounded-lg border border-[#1A1A2E]/10 bg-[#F7F9FC]/90 px-5 shadow-[0_2px_24px_rgba(26,26,46,0.06)] backdrop-blur-xl">
            <PedagemyLogo />
            <div className="flex items-center gap-4">
              <span className="hidden items-center gap-2 text-[12px] text-[#1A1A2E]/40 sm:flex">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/80" />
                {t(
                  "nav.registrationsOngoing",
                  "Early access registrations ongoing"
                )}
              </span>
              <LanguageSwitcher />
            </div>
          </nav>
        </div>

        {/* ── Hero ───────────────────────────────────────────────────────────── */}
        <section className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1fr_460px] lg:gap-20 lg:px-12 lg:py-32">
        <div>
          <Reveal delay={80}>
            <h1 className="max-w-2xl text-[clamp(30px,4vw,50px)] leading-[1.08] font-black tracking-[-0.03em] text-[#1A1A2E]">
              {t("hero.headline")}
            </h1>
          </Reveal>

          <Reveal delay={220}>
            <div className="mt-10">
              <p className="text-[16px] font-semibold tracking-[0.1em] text-[#0056D2] uppercase">
                {t("hero.questionLabel")}
              </p>
              <p className="mt-4 text-[16px] leading-[1.65] text-[#1A1A2E]">
                {t("hero.questionContext")}
              </p>
            </div>
            <div className="mt-5 space-y-2.5">
              {courseOptions.map((course) => {
                const isSelected = selectedCourse === course.value
                const label = t(`courses.${course.key}.label`)
                const descriptions = t(`courses.${course.key}.description`, {
                  returnObjects: true,
                }) as string[]
                return (
                  <button
                    key={course.value}
                    type="button"
                    onClick={() =>
                      setSelectedCourse(isSelected ? "" : course.value)
                    }
                    className={`group w-full rounded-lg border p-px text-left transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                      isSelected
                        ? "border-[#0056D2]/25 shadow-[0_4px_24px_rgba(0,86,210,0.10)]"
                        : "border-[#1A1A2E]/8 hover:border-[#1A1A2E]/15"
                    }`}
                  >
                    <div
                      className={`rounded-md px-5 py-4 transition-colors duration-300 ${
                        isSelected
                          ? "bg-white"
                          : "bg-[#F7F9FC] group-hover:bg-white/70"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`grid h-9 w-9 shrink-0 place-items-center rounded-md transition-colors duration-300 ${
                            isSelected
                              ? "bg-[#0056D2] text-white"
                              : "bg-[#1A1A2E]/6 text-[#1A1A2E]/45 group-hover:bg-[#1A1A2E]/10"
                          }`}
                        >
                          <Icon name={course.icon} className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p
                            className={`text-[14px] leading-tight font-semibold ${
                              isSelected
                                ? "text-[#0056D2]"
                                : "text-[#1A1A2E]/65"
                            }`}
                          >
                            {label}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className={`shrink-0 text-[15px] font-bold tabular-nums transition-colors duration-300 ${
                              isSelected
                                ? "text-[#003A8C]"
                                : "text-[#1A1A2E]/30"
                            }`}
                          >
                            {course.price}
                          </span>
                          <span
                            className={`grid h-5 w-5 shrink-0 place-items-center rounded-full transition-all duration-300 ${
                              isSelected
                                ? "rotate-180 bg-[#0056D2] text-white"
                                : "bg-[#1A1A2E]/10 text-[#1A1A2E]/30 group-hover:bg-[#1A1A2E]/15"
                            }`}
                          >
                            <svg
                              viewBox="0 0 12 12"
                              fill="none"
                              className="h-3 w-3"
                            >
                              <path
                                d="M2 4l4 4 4-4"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </span>
                        </div>
                      </div>
                      <div
                        className="overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
                        style={{
                          maxHeight: isSelected ? "500px" : "0px",
                          opacity: isSelected ? 1 : 0,
                        }}
                      >
                        <ul className="mt-4 list-none space-y-2 pl-[calc(2.25rem+16px)] text-[13px] leading-[1.9] text-[#1A1A2E]/55">
                          {descriptions.map((sentence, i) => (
                            <li key={i} className="flex items-start gap-2.5">
                              <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#0056D2]" />
                              <span>{sentence}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </Reveal>
        </div>

        {/* ── Hero Application Form ── */}
        <Reveal delay={120} className="lg:sticky lg:top-24">
          <div className="rounded-xl border border-[#1A1A2E]/8 bg-white p-1.5 shadow-[0_8px_48px_rgba(26,26,46,0.07)]">
            <div className="rounded-[10px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]">
              {!submitted ? (
                <form onSubmit={handleSubmit}>
                  <div className="border-b border-[#1A1A2E]/6 px-6 py-5">
                    <h3 className="text-[16px] font-bold text-[#1A1A2E]">
                      {t("form.title")}
                    </h3>
                    <p className="mt-1 text-[12px] text-[#1A1A2E]/42">
                      {t("form.subtitle")}
                    </p>
                  </div>

                  <div className="px-6 py-6">
                    <label className="block">
                      <span className="text-[12px] font-medium text-[#1A1A2E]/60">
                        {t("form.fullName")}
                      </span>
                      <input
                        required
                        name="name"
                        type="text"
                        placeholder={t("form.fullNamePlaceholder")}
                        className="mt-1 w-full rounded border border-[#1A1A2E]/10 bg-[#F7F9FC] px-4 py-2.5 text-[13px] text-[#1A1A2E] transition-all duration-300 outline-none placeholder:text-[#1A1A2E]/28 focus:border-[#0056D2]/40 focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,86,210,0.10)]"
                      />
                    </label>

                    <label className="mt-3 block">
                      <span className="text-[12px] font-medium text-[#1A1A2E]/60">
                        {t("form.email")}
                      </span>
                      <input
                        required
                        name="email"
                        type="email"
                        placeholder={t("form.emailPlaceholder")}
                        className="mt-1 w-full rounded border border-[#1A1A2E]/10 bg-[#F7F9FC] px-4 py-2.5 text-[13px] text-[#1A1A2E] transition-all duration-300 outline-none placeholder:text-[#1A1A2E]/28 focus:border-[#0056D2]/40 focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,86,210,0.10)]"
                      />
                    </label>

                    <label className="mt-3 block">
                      <span className="text-[12px] font-medium text-[#1A1A2E]/60">
                        {t("form.phone")}
                      </span>
                      <input
                        required
                        name="phone"
                        type="tel"
                        placeholder={t("form.phonePlaceholder")}
                        className="mt-1 w-full rounded border border-[#1A1A2E]/10 bg-[#F7F9FC] px-4 py-2.5 text-[13px] text-[#1A1A2E] transition-all duration-300 outline-none placeholder:text-[#1A1A2E]/28 focus:border-[#0056D2]/40 focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,86,210,0.10)]"
                      />
                    </label>

                    <label className="mt-3 block">
                      <span className="text-[12px] font-medium text-[#1A1A2E]/60">
                        {t("form.programme")}
                      </span>
                      <select
                        required
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                        className="mt-1 w-full rounded border border-[#1A1A2E]/10 bg-[#F7F9FC] px-4 py-2.5 text-[13px] font-medium text-[#1A1A2E] transition-all duration-300 outline-none focus:border-[#0056D2]/40 focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,86,210,0.10)]"
                      >
                        {courseOptions.map((c) => (
                          <option key={c.value} value={c.value}>
                            {t(`courses.${c.key}.label`)} — {c.price}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="mt-3 block">
                      <span className="text-[12px] font-medium text-[#1A1A2E]/60">
                        {t("form.reason")}
                      </span>
                      <textarea
                        required
                        name="reason"
                        rows={3}
                        placeholder={t("form.reasonPlaceholder")}
                        className="mt-1 w-full resize-y rounded border border-[#1A1A2E]/10 bg-[#F7F9FC] px-4 py-2.5 text-[13px] leading-[1.5] text-[#1A1A2E] transition-all duration-300 outline-none placeholder:text-[#1A1A2E]/28 focus:border-[#0056D2]/40 focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,86,210,0.10)]"
                      />
                    </label>

                    {submitError ? (
                      <p className="mt-3 rounded border border-red-200 bg-red-50 px-4 py-2.5 text-[12px] font-medium text-red-700">
                        {submitError}
                      </p>
                    ) : null}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="group mt-5 flex w-full items-center justify-center gap-2 rounded bg-[#0056D2] px-5 py-3 text-[13px] font-semibold text-white shadow-[0_4px_16px_rgba(0,86,210,0.25)] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:bg-[#003A8C] hover:shadow-[0_8px_32px_rgba(0,86,210,0.30)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-55"
                    >
                      {submitting ? t("form.submitting") : t("form.submit")}
                      {!submitting && (
                        <span className="grid h-5 w-5 place-items-center rounded-full bg-white/12 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-px">
                          <Icon name="arrowUpRight" className="h-3 w-3" />
                        </span>
                      )}
                    </button>

                    <p className="mt-3 text-center text-[11px] leading-4 text-[#1A1A2E]/30">
                      {t("form.noPayment")}
                    </p>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col items-center px-6 py-12 text-center">
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-[#EBF2FF]">
                    <Icon name="check" className="h-5 w-5 text-[#0056D2]" />
                  </div>
                  <h3 className="mt-4 text-[18px] font-bold text-[#1A1A2E]">
                    {t("form.successTitle")}
                  </h3>
                  <p className="mt-2 max-w-xs text-[13px] leading-[1.6] text-[#1A1A2E]/48">
                    {t("form.successBody")}
                  </p>
                </div>
              )}
            </div>
          </div>
        </Reveal>
      </section>
      </div>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="shrink-0 border-t border-[#1A1A2E]/8 bg-[#F7F9FC] px-6 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 sm:flex-row sm:items-center">
          <PedagemyLogo />
          <div className="flex flex-col items-center gap-1 text-center text-[12px] text-[#1A1A2E]/40">
            <a
              href={`mailto:${t("contact.footerEmail")}`}
              className="transition-colors duration-200 hover:text-[#1A1A2E]/70"
            >
              {t("contact.footerEmail")}
            </a>
            <div className="flex gap-4">
              <span>
                English:{" "}
                <a
                  href={`tel:${t("contact.englishPhone").replace(/\s/g, "")}`}
                  className="transition-colors duration-200 hover:text-[#1A1A2E]/70"
                >
                  {t("contact.englishPhone")}
                </a>
              </span>
              <span>
                French and Spanish:{" "}
                <a
                  href={`tel:${t("contact.frenchSpanishPhone").replace(/\s/g, "")}`}
                  className="transition-colors duration-200 hover:text-[#1A1A2E]/70"
                >
                  {t("contact.frenchSpanishPhone")}
                </a>
              </span>
            </div>
          </div>
          <p className="text-[12px] text-[#1A1A2E]/22">
            {t("footer.copyright")}
          </p>
        </div>
      </footer>
    </div>
  )
}
