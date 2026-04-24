"use client"

import React, { useMemo, useState, useEffect, useRef } from "react"
import Image from "next/image"

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
    label: "Soft Skills Accelerator",
    original: "Skillsoft Expert",
    price: "$300",
    icon: "users",
    description: [
      "This program is designed for learners who want a wide foundation across today's workplace skills.",
      "It covers leadership, communication, productivity, digital transformation, data literacy, Artificial Intelligence (AI), cybersecurity, cloud, DevOps, project management, customer service, and career development.",
      "It is useful for students, professionals, and job seekers who want flexible access to many career-relevant learning paths.",
    ],
  },
  {
    value: "Codecademy Expert",
    label: "Tech Career Launchpad",
    original: "Codecademy Expert",
    price: "$325",
    icon: "laptop",
    description: [
      "This program is built for learners who want to grow into technical roles or strengthen their existing tech skills.",
      "It includes topics such as artificial intelligence, big data, data science, machine learning, business intelligence, Python, Java, SQL, HTML5, GitHub, full-stack development, cloud computing, DevOps, cybersecurity, API security, and application security.",
      "It also supports hands-on learning through interactive courses, coding labs, and AI-powered practice tools.",
    ],
  },
  {
    value: "Leadership SLDP",
    label: "Leadership Accelerator",
    original: "Leadership (SLDP)",
    price: "$70",
    icon: "briefcase",
    description: [
      "This program is designed for professionals who want to become stronger leaders at work.",
      "It covers three areas: leading yourself, leading your team, and leading the business.",
      "Learners explore executive presence, emotional intelligence, ethical leadership, team building, cross-cultural leadership, coaching, conflict management, customer-first leadership, decision-making, innovation, strategy, and leadership in the age of AI.",
      "It is suitable for emerging leaders, managers, team leads, and professionals preparing for more responsibility.",
    ],
  },
  {
    value: "Compliance Complete",
    label: "Workplace Readiness",
    original: "Compliance Complete",
    price: "$60",
    icon: "shield",
    description: [
      "This program is designed to help learners understand the rules, responsibilities, and safe practices required in modern workplaces.",
      "It covers legal and compliance topics such as anti-harassment, code of conduct, ethics, data privacy, GDPR compliance, HIPAA, cybersecurity, and workplace security.",
      "It also includes environmental, health, and safety topics such as ergonomics, home office safety, sustainability, transportation, workforce security, and post-pandemic workplace practices.",
      "It is useful for professionals, job seekers, and organizations that want stronger workplace readiness.",
    ],
  },
]

const processSteps = [
  {
    n: "01",
    title: "Seize the opening",
    body: "Apply in under two minutes. Tell us which programme you chose and why it matters to you right now. That decision alone puts you ahead of everyone who scrolled past.",
  },
  {
    n: "02",
    title: "Do the work that changes you",
    body: "Complete a world-class programme — the same training organisations invest in for their top people. This is not passive learning. It is the version of you you have been putting off becoming.",
  },
  {
    n: "03",
    title: "Step into a different future",
    body: "A promotion you stopped waiting for. A salary conversation you can now have. A business move you finally feel ready to make. That future starts the moment you finish step one.",
  },
]

const faqItems = [
  {
    q: "Why is this free?",
    a: "Pedagemy is launching as a dedicated e-learning platform that partners with companies, training institutions, and professional bodies across Africa to make quality career development accessible. This is our early access programme — we are opening the training iCUBEFARM has delivered inside corporates to the public for the first time. There is no catch. No cost to apply, no cost to access, no upsell.",
  },
  {
    q: "Who can apply?",
    a: "Applications are open to students, job seekers, and working professionals at any career stage. There are no eligibility restrictions.",
  },
  {
    q: "What makes these programmes different?",
    a: "Each is from an established professional training provider — Skillsoft, Codecademy, or iCUBEFARM\u2019s own leadership curriculum. These are the same accredited programmes organisations purchase for employee development, not generic self-study content.",
  },
  {
    q: "Who is iCUBEFARM?",
    a: "iCUBEFARM is a career development organisation curating professional training for students and working professionals. Pedagemy is their dedicated learning platform.",
  },
  {
    q: "How are candidates selected?",
    a: "Applications are personally reviewed. Priority is given to candidates who articulate clearly how the programme aligns with their specific career goals.",
  },
  {
    q: "What happens after selection?",
    a: "You receive an email with activation instructions. There is no payment step \u2014 just your programme.",
  },
  {
    q: "Can I apply for more than one programme?",
    a: "Each application covers one programme. Choose the one that best fits your goals.",
  },
  {
    q: "When does the selection window close?",
    a: "Seats are limited and reviewed in order of submission. Apply early to be considered before capacity is reached.",
  },
]

function getDefaultCourse() {
  const course = courseOptions[1] ?? courseOptions[0]
  if (!course) throw new Error("At least one course option is required.")
  return course
}

const defaultCourse = getDefaultCourse()

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
  const [selectedCourse, setSelectedCourse] = useState(defaultCourse.value)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [openFaq, setOpenFaq] = useState<number>(0)

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
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = (await response.json()) as { error?: string; ok?: boolean }

      if (!response.ok || !data.ok) {
        setSubmitError(data.error ?? "Something went wrong. Please try again.")
        return
      }

      setSubmitted(true)
    } catch {
      setSubmitError("Network error. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-dvh bg-[#F7F9FC] font-(family-name:--font-dm-sans) text-[#1A1A2E] antialiased">
      {/* ── Floating Nav ───────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-50 flex justify-center px-4 pt-4">
        <nav className="flex h-14 w-full max-w-5xl items-center justify-between rounded-lg border border-[#1A1A2E]/10 bg-[#F7F9FC]/90 px-5 shadow-[0_2px_24px_rgba(26,26,46,0.06)] backdrop-blur-xl">
          <PedagemyLogo />
          <div className="flex items-center gap-4">
            <span className="hidden items-center gap-2 text-[12px] text-[#1A1A2E]/40 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/80" />
              Early access registrations ongoing
            </span>
            <button
              onClick={scrollToForm}
              className="group flex items-center gap-2 rounded bg-[#0056D2] px-4 py-2 text-[12px] font-semibold text-white transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-[#003A8C] active:scale-[0.97]"
            >
              Apply Now
              <span className="grid h-5 w-5 place-items-center rounded-full bg-white/15 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-px">
                <Icon name="arrowUpRight" className="h-3 w-3" />
              </span>
            </button>
          </div>
        </nav>
      </div>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1fr_460px] lg:gap-20 lg:px-12 lg:py-32">
        <div>
          <Reveal delay={80}>
            <h1 className="max-w-2xl text-[clamp(30px,4vw,50px)] leading-[1.08] font-black tracking-[-0.03em] text-[#1A1A2E]">
              Win Premium Learning Access{" "}
              <span className="text-[#0056D2]"> Worth up to $755</span>
            </h1>
          </Reveal>

          <Reveal delay={220}>
            <div className="mt-10">
              <p className="text-[16px] font-semibold tracking-[0.1em] text-[#0056D2] uppercase">
                Register to Win by Friday, May 15, 2026.
              </p>
              <p className="mt-4 text-[16px] leading-[1.65] text-[#1A1A2E]">
                Enter the Pedagemy Raffle for a chance to access world-class courses curated by iCUBEFARM.
              </p>
            </div>
            <div className="mt-5 space-y-2.5">
              {courseOptions.map((course) => {
                const isSelected = selectedCourse === course.value
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
                            {course.label}
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
                          {course.description.map((sentence, i) => (
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
                      Registration form
                    </h3>
                    <p className="mt-1 text-[12px] text-[#1A1A2E]/42">
                      All fields required. Takes under 2 minutes.
                    </p>
                  </div>

                  <div className="px-6 py-6">
                    <label className="block">
                      <span className="text-[12px] font-medium text-[#1A1A2E]/60">
                        Full name
                      </span>
                      <input
                        required
                        name="name"
                        type="text"
                        placeholder="Your full name"
                        className="mt-1 w-full rounded border border-[#1A1A2E]/10 bg-[#F7F9FC] px-4 py-2.5 text-[13px] text-[#1A1A2E] transition-all duration-300 outline-none placeholder:text-[#1A1A2E]/28 focus:border-[#0056D2]/40 focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,86,210,0.10)]"
                      />
                    </label>

                    <label className="mt-3 block">
                      <span className="text-[12px] font-medium text-[#1A1A2E]/60">
                        Email address
                      </span>
                      <input
                        required
                        name="email"
                        type="email"
                        placeholder="you@email.com"
                        className="mt-1 w-full rounded border border-[#1A1A2E]/10 bg-[#F7F9FC] px-4 py-2.5 text-[13px] text-[#1A1A2E] transition-all duration-300 outline-none placeholder:text-[#1A1A2E]/28 focus:border-[#0056D2]/40 focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,86,210,0.10)]"
                      />
                    </label>

                    <label className="mt-3 block">
                      <span className="text-[12px] font-medium text-[#1A1A2E]/60">
                        Phone number
                      </span>
                      <input
                        required
                        name="phone"
                        type="tel"
                        placeholder="+234 000 000 0000"
                        className="mt-1 w-full rounded border border-[#1A1A2E]/10 bg-[#F7F9FC] px-4 py-2.5 text-[13px] text-[#1A1A2E] transition-all duration-300 outline-none placeholder:text-[#1A1A2E]/28 focus:border-[#0056D2]/40 focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,86,210,0.10)]"
                      />
                    </label>

                    <label className="mt-3 block">
                      <span className="text-[12px] font-medium text-[#1A1A2E]/60">
                        Programme
                      </span>
                      <select
                        required
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                        className="mt-1 w-full rounded border border-[#1A1A2E]/10 bg-[#F7F9FC] px-4 py-2.5 text-[13px] font-medium text-[#1A1A2E] transition-all duration-300 outline-none focus:border-[#0056D2]/40 focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,86,210,0.10)]"
                      >
                        {courseOptions.map((c) => (
                          <option key={c.value} value={c.value}>
                            {c.label} — {c.price}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="mt-3 block">
                      <span className="text-[12px] font-medium text-[#1A1A2E]/60">
                        Why this programme?
                      </span>
                      <textarea
                        required
                        name="reason"
                        rows={3}
                        placeholder="Briefly describe your career goals…"
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
                      {submitting ? "Submitting…" : "Submit Application"}
                      {!submitting && (
                        <span className="grid h-5 w-5 place-items-center rounded-full bg-white/12 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-px">
                          <Icon name="arrowUpRight" className="h-3 w-3" />
                        </span>
                      )}
                    </button>

                    <p className="mt-3 text-center text-[11px] leading-4 text-[#1A1A2E]/30">
                      No payment required. Selected candidates are contacted
                      directly.
                    </p>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col items-center px-6 py-12 text-center">
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-[#EBF2FF]">
                    <Icon name="check" className="h-5 w-5 text-[#0056D2]" />
                  </div>
                  <h3 className="mt-4 text-[18px] font-bold text-[#1A1A2E]">
                    Application received.
                  </h3>
                  <p className="mt-2 max-w-xs text-[13px] leading-[1.6] text-[#1A1A2E]/48">
                    If selected, Pedagemy will contact you directly with access
                    instructions.
                  </p>
                </div>
              )}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── Process ────────────────────────────────────────────────────────── */}
      <section
        id="how-it-works"
        className="border-t border-[#1A1A2E]/6 bg-white px-6 py-24 sm:px-8 lg:px-12 lg:py-32"
      >
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <h2 className="mt-2 max-w-lg text-[clamp(28px,3vw,44px)] leading-[1.1] font-black tracking-[-0.03em] text-[#1A1A2E]">
              Three steps from where you are to where you want to be.
            </h2>
            <p className="mt-4 max-w-xl text-[16px] leading-[1.7] text-[#6B7A99]">
              Visualise the version of yourself on the other side of this.
              Higher earning, more confident, further ahead. That person took
              step one. So can you.
            </p>
          </Reveal>

          {/* Cinematic context image */}
          <Reveal delay={60}>
            <div className="relative mt-10 aspect-[4/3] overflow-hidden rounded-xl sm:aspect-[16/9] lg:aspect-[21/9]">
              <Image
                src="https://images.pexels.com/photos/8761535/pexels-photo-8761535.jpeg?auto=compress&cs=tinysrgb&w=1920&h=820&dpr=1"
                alt="Business professionals attending a corporate training seminar"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1200px"
                className="object-cover object-top"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A2E]/65 to-[#1A1A2E]/10" />
              <div className="absolute right-4 bottom-4 left-4 sm:right-auto sm:bottom-6 sm:left-8">
                <p className="text-[11px] text-white/50 sm:text-[12px]">
                  Your future self is already in this room.
                </p>
                <p className="mt-1 text-[14px] font-bold text-white sm:text-[17px]">
                  The only question is whether you show up.
                </p>
              </div>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-px overflow-hidden rounded-lg bg-[#1A1A2E]/8 md:grid-cols-3">
            {processSteps.map((step, i) => (
              <Reveal key={step.n} delay={i * 80} className="h-full">
                <div className="group h-full bg-white px-5 py-6 transition-colors duration-300 hover:bg-[#F7F9FC] sm:px-8 sm:py-8">
                  <p className="text-[44px] font-black tracking-[-0.04em] text-[#1A1A2E]/8 transition-colors duration-300 select-none group-hover:text-[#1A1A2E]/15">
                    {step.n}
                  </p>
                  <h3 className="mt-4 text-[15px] font-semibold text-[#1A1A2E]">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-[13px] leading-[1.75] text-[#1A1A2E]/48">
                    {step.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Social Proof ───────────────────────────────────────────────────── */}
      <section className="border-t border-[#1A1A2E]/6 bg-white px-6 py-20 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <h2 className="mt-2 max-w-2xl text-[clamp(24px,2.8vw,36px)] leading-[1.1] font-black tracking-[-0.03em] text-[#1A1A2E]">
              Real outcomes from the same programmes, inside real organisations.
            </h2>
          </Reveal>

          {(() => {
            const cols = [
              {
                outcome: "First role secured",
                detail:
                  "Graduates who completed iCUBEFARM training went on to land their first professional positions — in organisations they had been targeting for months.",
                icon: "briefcase" as const,
                img: "https://images.pexels.com/photos/7794040/pexels-photo-7794040.jpeg?auto=compress&cs=tinysrgb&w=600&h=720&dpr=1",
                alt: "Young African professional smiling confidently in a modern office setting",
              },
              {
                outcome: "First internship won",
                detail:
                  "Students with no prior corporate experience used the skills from these programmes to compete — and win — against candidates with longer CVs.",
                icon: "users" as const,
                img: "https://images.pexels.com/photos/33733643/pexels-photo-33733643.jpeg?auto=compress&cs=tinysrgb&w=600&h=720&dpr=1",
                alt: "African woman in professional attire seated in a corporate conference room",
              },
              {
                outcome: "Promoted from within",
                detail:
                  "Employees who upskilled through iCUBEFARM's corporate programmes made the case for promotion with new capabilities their managers could see.",
                icon: "arrowUpRight" as const,
                img: "https://images.pexels.com/photos/5989927/pexels-photo-5989927.jpeg?auto=compress&cs=tinysrgb&w=600&h=720&dpr=1",
                alt: "African businessman in gray suit smiling confidently at his office desk",
              },
              {
                outcome: "Switched careers",
                detail:
                  "Professionals who felt stuck used targeted training to pivot into roles that paid more and aligned with where they actually wanted to go.",
                icon: "laptop" as const,
                img: "https://images.pexels.com/photos/7648001/pexels-photo-7648001.jpeg?auto=compress&cs=tinysrgb&w=600&h=720&dpr=1",
                alt: "Diverse group of young African professionals collaborating in a modern office",
              },
            ]

            const TextCell = ({ item }: { item: (typeof cols)[0] }) => (
              <Reveal>
                <div className="group flex h-full flex-col bg-white px-7 py-8 transition-colors duration-300 hover:bg-[#F7F9FC]">
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-[#EBF2FF] text-[#0056D2]">
                    <Icon name={item.icon} className="h-4 w-4" />
                  </div>
                  <p className="mt-5 text-[16px] font-bold text-[#1A1A2E]">
                    {item.outcome}
                  </p>
                  <p className="mt-2 text-[13px] leading-[1.75] text-[#1A1A2E]/50">
                    {item.detail}
                  </p>
                </div>
              </Reveal>
            )

            const ImgCell = ({ item }: { item: (typeof cols)[0] }) => (
              <Reveal>
                <div className="relative h-full min-h-65 overflow-hidden">
                  <Image
                    src={item.img}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover object-top"
                    loading="lazy"
                  />
                </div>
              </Reveal>
            )

            return (
              <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-[#1A1A2E]/6 bg-[#1A1A2E]/6 lg:grid-cols-4">
                {/* Row 1: text / img / text / img */}
                <TextCell item={cols[0]!} />
                <ImgCell item={cols[1]!} />
                <TextCell item={cols[2]!} />
                <ImgCell item={cols[3]!} />
                {/* Row 2: img / text / img / text */}
                <ImgCell item={cols[0]!} />
                <TextCell item={cols[1]!} />
                <ImgCell item={cols[2]!} />
                <TextCell item={cols[3]!} />
              </div>
            )
          })()}

          <Reveal>
            <div className="mt-8 flex flex-col gap-2">
              <p className="text-xs font-semibold text-[#1A1A2E]/35">
                iCUBEFARM's trainiing initiatives delivered across leading
                organisations in Africa, including:
              </p>
              <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
                {[
                  "Chevron",
                  "Africa Oil Corporation",
                  "UNDP",
                  "GEPETROL",
                  "TrainingCred",
                ].map((name) => (
                  <span
                    key={name}
                    className="text-[24px] font-bold text-[#1A1A2E]/45"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────────────── */}
      <section
        id="faq"
        className="border-t border-[#1A1A2E]/6 bg-[#F7F9FC] px-6 py-24 sm:px-8 lg:px-12 lg:py-28"
      >
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <h2 className="text-[clamp(26px,3vw,38px)] leading-[1.1] font-black tracking-[-0.03em] text-[#1A1A2E]">
              Before you apply.
            </h2>
          </Reveal>

          <div className="mt-10 divide-y divide-[#1A1A2E]/6">
            {faqItems.map((item, i) => {
              const isOpen = openFaq === i
              return (
                <Reveal key={item.q} delay={i * 40}>
                  <div>
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? -1 : i)}
                      className="group flex w-full items-center justify-between gap-4 py-5 text-left"
                      aria-expanded={isOpen}
                    >
                      <span
                        className={`text-[15px] leading-snug font-semibold transition-colors duration-200 ${
                          isOpen
                            ? "text-[#0056D2]"
                            : "text-[#1A1A2E] group-hover:text-[#0056D2]"
                        }`}
                      >
                        {item.q}
                      </span>
                      <span
                        className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border transition-all duration-300 ${
                          isOpen
                            ? "border-[#0056D2]/30 bg-[#0056D2] text-white"
                            : "border-[#1A1A2E]/12 bg-white text-[#1A1A2E]/40 group-hover:border-[#0056D2]/30 group-hover:text-[#0056D2]"
                        }`}
                      >
                        <svg
                          viewBox="0 0 12 12"
                          fill="none"
                          className={`h-3 w-3 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
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
                    </button>
                    <div
                      className="overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
                      style={{ maxHeight: isOpen ? "400px" : "0px" }}
                    >
                      <p className="pb-5 text-[14px] leading-[1.8] text-[#1A1A2E]/55">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Application Form ───────────────────────────────────────────────── */}
      <section
        id="application-form"
        className="border-t border-[#1A1A2E]/6 bg-white px-6 py-24 sm:px-8 lg:px-12 lg:py-32"
      >
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_520px] lg:gap-20">
          <Reveal className="order-2 lg:order-1">
            <div>
              <h2 className="max-w-md text-[clamp(30px,3.5vw,48px)] leading-[1.08] font-black tracking-[-0.03em] text-[#1A1A2E]">
                Two minutes to access.
              </h2>
              <p className="mt-5 max-w-sm text-[15px] leading-[1.75] text-[#1A1A2E]/50">
                Every application is reviewed personally. A concise, specific
                statement of intent carries more weight than volume.
              </p>
              <p className="mt-3 max-w-sm text-[13px] leading-[1.7] text-[#1A1A2E]/38">
                Pedagemy is launching a platform to make professional training
                accessible across Africa. This early access is how we start —
                real programmes, no cost, no strings.
              </p>

              <div className="mt-8 rounded-lg border border-[#1A1A2E]/8 bg-[#F7F9FC] p-5">
                <div className="flex items-center gap-3.5">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-[#0056D2] text-white">
                    <Icon name={activeCourse.icon} className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <p className="mt-0.5 text-[15px] font-semibold text-[#1A1A2E]">
                      {activeCourse.label}
                    </p>
                    <p className="text-[12px] text-[#1A1A2E]/38">
                      {activeCourse.original}&ensp;&middot;&ensp;
                      {activeCourse.price} value
                    </p>
                  </div>
                </div>
              </div>

              {/* Personal review photo */}
              <div className="relative mt-6 aspect-[4/3] overflow-hidden rounded-lg">
                <Image
                  src="https://images.pexels.com/photos/5862268/pexels-photo-5862268.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1"
                  alt="Professional one-on-one mentoring and application review session"
                  fill
                  sizes="(max-width: 1024px) 100vw, 520px"
                  className="object-cover object-top"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A2E]/60 to-transparent" />
                <p className="absolute right-4 bottom-4 left-4 text-[12px] leading-snug font-medium text-white/80">
                  Every application is read by a real person —
                  merit&#8209;based, not a lottery.
                </p>
              </div>

              <div className="mt-6 flex items-center gap-2 text-[13px] text-[#1A1A2E]/38">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500/70" />
                Limited seats&#8202;—&#8202;reviewed in order of submission
              </div>
            </div>
          </Reveal>

          {/* Double-Bezel form card */}
          <Reveal delay={100} className="order-1 lg:order-2">
            <div className="rounded-xl border border-[#1A1A2E]/8 bg-white p-1.5 shadow-[0_8px_48px_rgba(26,26,46,0.07)]">
              <div className="rounded-[10px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]">
                {!submitted ? (
                  <form onSubmit={handleSubmit}>
                    <div className="border-b border-[#1A1A2E]/6 px-8 py-6">
                      <h3 className="text-[17px] font-bold text-[#1A1A2E]">
                        Your Application
                      </h3>
                      <p className="mt-1 text-[13px] text-[#1A1A2E]/42">
                        All fields required. Your information is kept private.
                      </p>
                    </div>

                    <div className="px-8 py-7">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <label className="block">
                          <span className="text-[13px] font-medium text-[#1A1A2E]/60">
                            Full name
                          </span>
                          <input
                            required
                            name="name"
                            type="text"
                            placeholder="Your full name"
                            className="mt-1.5 w-full rounded border border-[#1A1A2E]/10 bg-[#F7F9FC] px-4 py-3 text-[14px] text-[#1A1A2E] transition-all duration-300 outline-none placeholder:text-[#1A1A2E]/28 focus:border-[#0056D2]/40 focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,86,210,0.10)]"
                          />
                        </label>

                        <label className="block">
                          <span className="text-[13px] font-medium text-[#1A1A2E]/60">
                            Phone number
                          </span>
                          <input
                            required
                            name="phone"
                            type="tel"
                            placeholder="+234 000 000 0000"
                            className="mt-1.5 w-full rounded border border-[#1A1A2E]/10 bg-[#F7F9FC] px-4 py-3 text-[14px] text-[#1A1A2E] transition-all duration-300 outline-none placeholder:text-[#1A1A2E]/28 focus:border-[#0056D2]/40 focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,86,210,0.10)]"
                          />
                        </label>
                      </div>

                      <label className="mt-4 block">
                        <span className="text-[13px] font-medium text-[#1A1A2E]/60">
                          Email address
                        </span>
                        <input
                          required
                          name="email"
                          type="email"
                          placeholder="you@email.com"
                          className="mt-1.5 w-full rounded border border-[#1A1A2E]/10 bg-[#F7F9FC] px-4 py-3 text-[14px] text-[#1A1A2E] transition-all duration-300 outline-none placeholder:text-[#1A1A2E]/28 focus:border-[#0056D2]/40 focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,86,210,0.10)]"
                        />
                      </label>

                      <label className="mt-4 block">
                        <span className="text-[13px] font-medium text-[#1A1A2E]/60">
                          Programme
                        </span>
                        <select
                          required
                          value={selectedCourse}
                          onChange={(e) => setSelectedCourse(e.target.value)}
                          className="mt-1.5 w-full rounded border border-[#1A1A2E]/10 bg-[#F7F9FC] px-4 py-3 text-[14px] font-medium text-[#1A1A2E] transition-all duration-300 outline-none focus:border-[#0056D2]/40 focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,86,210,0.10)]"
                        >
                          {courseOptions.map((c) => (
                            <option key={c.value} value={c.value}>
                              {c.label} &#8212; {c.price}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="mt-4 block">
                        <span className="text-[13px] font-medium text-[#1A1A2E]/60">
                          Why this programme?
                        </span>
                        <textarea
                          required
                          name="reason"
                          rows={4}
                          placeholder="Describe how this programme aligns with your career goals&#8230;"
                          className="mt-1.5 w-full resize-y rounded border border-[#1A1A2E]/10 bg-[#F7F9FC] px-4 py-3 text-[14px] leading-[1.6] text-[#1A1A2E] transition-all duration-300 outline-none placeholder:text-[#1A1A2E]/28 focus:border-[#0056D2]/40 focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,86,210,0.10)]"
                        />
                      </label>

                      {submitError ? (
                        <p className="mt-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-medium text-red-700">
                          {submitError}
                        </p>
                      ) : null}

                      <button
                        type="submit"
                        disabled={submitting}
                        className="group mt-6 flex w-full items-center justify-center gap-2.5 rounded bg-[#0056D2] px-6 py-4 text-[14px] font-semibold text-white shadow-[0_4px_16px_rgba(0,86,210,0.25)] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:bg-[#003A8C] hover:shadow-[0_8px_32px_rgba(0,86,210,0.30)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-55"
                      >
                        {submitting ? "Submitting\u2026" : "Submit Application"}
                        {!submitting && (
                          <span className="grid h-6 w-6 place-items-center rounded-full bg-white/12 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-px group-hover:scale-105">
                            <Icon name="arrowUpRight" className="h-3.5 w-3.5" />
                          </span>
                        )}
                      </button>

                      <p className="mt-4 text-center text-[12px] leading-5 text-[#1A1A2E]/30">
                        No payment required. Selected candidates are contacted
                        directly.
                      </p>
                    </div>
                  </form>
                ) : (
                  <div className="flex flex-col items-center px-8 py-16 text-center">
                    <div className="grid h-14 w-14 place-items-center rounded-full bg-[#EBF2FF]">
                      <Icon name="check" className="h-6 w-6 text-[#0056D2]" />
                    </div>
                    <h3 className="mt-5 text-[20px] font-bold text-[#1A1A2E]">
                      Application received.
                    </h3>
                    <p className="mt-2.5 max-w-xs text-[14px] leading-[1.75] text-[#1A1A2E]/48">
                      If selected, Pedagemy will contact you directly with
                      access instructions. No payment step&#8202;—&#8202;just
                      your programme.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="border-t border-[#1A1A2E]/8 bg-[#1A1A2E] px-6 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <PedagemyLogo light />
          <div className="flex items-center gap-2">
            {/* <ICubeFarmMark className="h-5 w-5 opacity-20" />
            <p className="text-[12px] text-white/22">
              Powered by iCUBEFARM
            </p> */}
          </div>
          <p className="text-[12px] text-white/22">
            &copy;&nbsp;2026 Pedagemy. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  )
}
