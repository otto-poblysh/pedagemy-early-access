"use client"

import { PedagemyLogo } from "@/components/logo"
import { LanguageSwitcher } from "@/components/language-switcher"

interface LandingNavProps {
  registrationsLabel: string
}

export function LandingNav({ registrationsLabel }: LandingNavProps) {
  return (
    <div className="sticky top-0 z-50 flex justify-center px-4 pt-4">
      <nav className="flex h-14 w-full max-w-5xl items-center justify-between rounded-lg border border-[#1A1A2E]/10 bg-[#F7F9FC]/90 px-5 shadow-[0_2px_24px_rgba(26,26,46,0.06)] backdrop-blur-xl">
        <PedagemyLogo />
        <div className="flex items-center gap-4">
          <span className="hidden items-center gap-2 text-[12px] text-[#1A1A2E]/40 sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/80" />
            {registrationsLabel}
          </span>
          <LanguageSwitcher />
        </div>
      </nav>
    </div>
  )
}