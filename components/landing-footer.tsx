"use client"

import { PedagemyLogo } from "@/components/logo"

interface LandingFooterProps {
  footerEmail: string
  englishPhone: string
  frenchSpanishPhone: string
  copyright: string
}

export function LandingFooter({
  footerEmail,
  englishPhone,
  frenchSpanishPhone,
  copyright,
}: LandingFooterProps) {
  return (
    <footer className="fixed inset-x-0 bottom-0 z-50 h-20 border-t border-[#1A1A2E]/8 bg-[#F7F9FC] px-6 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 sm:flex-row sm:items-center">
        <PedagemyLogo />
        <div className="flex flex-col items-center gap-1 text-center text-[12px] text-[#1A1A2E]/40">
          <a
            href={`mailto:${footerEmail}`}
            className="transition-colors duration-200 hover:text-[#1A1A2E]/70"
          >
            {footerEmail}
          </a>
          <div className="flex gap-4">
            <span>
              English:{" "}
              <a
                href={`tel:${englishPhone.replace(/\s/g, "")}`}
                className="transition-colors duration-200 hover:text-[#1A1A2E]/70"
              >
                {englishPhone}
              </a>
            </span>
            <span>
              French and Spanish:{" "}
              <a
                href={`tel:${frenchSpanishPhone.replace(/\s/g, "")}`}
                className="transition-colors duration-200 hover:text-[#1A1A2E]/70"
              >
                {frenchSpanishPhone}
              </a>
            </span>
          </div>
        </div>
        <p className="text-[12px] text-[#1A1A2E]/22">{copyright}</p>
      </div>
    </footer>
  )
}