"use client"

import Link from "next/link"
import { Icon } from "@/components/icons"

interface SuccessPageProps {
  firstName: string
  courseName: string
  email: string
  locale: string
  headline: string
  body: string
  emailNote: string
  nextStepsTitle: string
  nextSteps: string[]
  backToHome: string
}

export function SuccessPage({
  firstName,
  courseName,
  email,
  locale,
  headline,
  body,
  emailNote,
  nextStepsTitle,
  nextSteps,
  backToHome,
}: SuccessPageProps) {
  return (
    <div className="relative flex min-h-dvh flex-col overflow-x-hidden bg-[#F3F6FB] font-(family-name:--font-dm-sans) text-[#1A1A2E] antialiased">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_top_left,rgba(0,86,210,0.14),transparent_34%),radial-gradient(circle_at_top_right,rgba(26,26,46,0.10),transparent_36%),linear-gradient(180deg,#F9FBFF_0%,#F3F6FB_54%,#EEF3F8_100%)]" />
      <div className="pointer-events-none absolute inset-x-10 top-20 h-px bg-[linear-gradient(90deg,transparent,rgba(26,26,46,0.14),transparent)]" />

      <div className="relative flex flex-1 flex-col items-center justify-center px-6 py-16">
        <div className="relative w-full max-w-[520px] overflow-hidden rounded-[32px] border border-white/75 bg-white/78 p-[1px] shadow-[0_28px_80px_rgba(15,23,42,0.10)] backdrop-blur-2xl">
          <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(13,91,209,0.35),transparent)]" />

          <div className="relative rounded-[31px] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(244,248,252,0.96))] shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] px-8 py-12 sm:px-10 sm:py-14">
            <div className="flex justify-center">
              <div
                className="grid h-14 w-14 place-items-center rounded-full bg-[#E9F1FF] shadow-[0_10px_24px_rgba(13,91,209,0.10)]"
                style={{
                  animation: "scaleIn 0.4s ease-out forwards",
                }}
              >
                <Icon name="check" className="h-6 w-6 text-[#0056D2]" />
              </div>
            </div>

            <h1 className="mt-6 text-center text-[28px] font-bold tracking-[-0.02em] leading-tight text-[#1A1A2E]">
              {headline.replace("{firstName}", firstName)}
            </h1>

            <p
              className="mt-3 text-center text-[13px] leading-[1.7] text-[#1A1A2E]/52"
              dangerouslySetInnerHTML={{
                __html: body
                  .replace("{course}", `<strong class="font-semibold text-[#1A1A2E]">${courseName}</strong>`)
                  .replace("{email}", email),
              }}
            />

            <p className="mt-2 text-center text-[12px] text-[#1A1A2E]/38">
              {emailNote.replace("{email}", email)}
            </p>

            <div className="mt-8 mb-6 h-px w-full bg-[linear-gradient(90deg,transparent,rgba(26,26,46,0.08),transparent)]" />

            <div>
              <p className="text-[12px] font-semibold tracking-[0.04em] uppercase text-[#1A1A2E]/48">
                {nextStepsTitle}
              </p>
              <ul className="mt-3 space-y-3">
                {nextSteps.map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0056D2]/50" />
                    <span className="text-[13px] text-[#1A1A2E]/62">{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 mb-0 h-px w-full bg-[linear-gradient(90deg,transparent,rgba(26,26,46,0.08),transparent)]" />

            <div className="mt-6 flex justify-center">
              <Link
                href={`/${locale}`}
                className="text-[13px] font-medium text-[#0056D2] underline decoration-[#0056D2]/30 underline-offset-3 transition-colors duration-200 hover:text-[#003A8C]"
              >
                {backToHome}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  )
}