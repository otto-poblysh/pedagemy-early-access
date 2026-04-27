"use client"

import { PedagemyLogo } from "@/components/logo"

interface LandingFooterProps {
  footerEmail: string
  englishPhone: string
  englishPhoneLabel: string
  frenchSpanishPhone: string
  frenchSpanishPhoneLabel: string
  copyright: string
}

export function LandingFooter({
  footerEmail,
  englishPhone,
  englishPhoneLabel,
  frenchSpanishPhone,
  frenchSpanishPhoneLabel,
  copyright,
}: LandingFooterProps) {
  return (
    <footer className="border-t border-white/70 bg-white/62 px-6 pt-5 pb-[calc(1rem+env(safe-area-inset-bottom))] backdrop-blur-xl shadow-[0_-18px_42px_rgba(15,23,42,0.04)] sm:px-8 lg:px-12">
      <div className="mx-auto grid max-w-[1380px] items-center justify-items-center gap-3 text-center sm:grid-cols-[1fr_auto_1fr] sm:justify-items-stretch sm:gap-4 sm:text-left">
        <div className="sm:justify-self-start">
          <PedagemyLogo />
        </div>
        <div className="flex min-w-0 flex-col items-center gap-1.5 text-center text-[11px] leading-5 text-[#1A1A2E]/52 sm:text-[12px]">
          <a
            href={`mailto:${footerEmail}`}
            className="font-medium transition-colors duration-200 hover:text-[#1A1A2E]/76"
          >
            {footerEmail}
          </a>
          <div className="flex flex-col items-center gap-y-0.5 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-4 sm:gap-y-1">
            <span className="sm:whitespace-nowrap">
              {englishPhoneLabel}:{" "}
              <a
                href={`tel:${englishPhone.replace(/\s/g, "")}`}
                className="font-medium transition-colors duration-200 hover:text-[#1A1A2E]/75"
              >
                {englishPhone}
              </a>
            </span>
            <span className="sm:whitespace-nowrap">
              {frenchSpanishPhoneLabel}:{" "}
              <a
                href={`tel:${frenchSpanishPhone.replace(/\s/g, "")}`}
                className="font-medium transition-colors duration-200 hover:text-[#1A1A2E]/75"
              >
                {frenchSpanishPhone}
              </a>
            </span>
          </div>
        </div>
        <p className="text-[11px] leading-5 text-[#1A1A2E]/36 sm:justify-self-end sm:text-right sm:text-[12px]">
          {copyright}
        </p>
      </div>
    </footer>
  )
}
