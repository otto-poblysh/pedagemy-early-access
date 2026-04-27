"use client"

import { PedagemyLogo } from "@/components/logo"
import { LanguageSwitcher } from "@/components/language-switcher"

interface LandingNavProps {
  registrationsLabel: string
}

export function LandingNav({ registrationsLabel }: LandingNavProps) {
  return (
    <div className="sticky top-0 z-50 flex justify-center px-4 pt-5">
      <nav className="flex h-15 w-full max-w-6xl items-center justify-between rounded-full border border-white/80 bg-white/72 px-6 shadow-[0_14px_44px_rgba(15,23,42,0.08)] backdrop-blur-2xl">
        <PedagemyLogo />
        <div className="flex items-center gap-4">
          <span className="hidden items-center gap-2 text-[11px] font-medium tracking-[0.04em] text-[#1A1A2E]/44 sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/75 shadow-[0_0_0_4px_rgba(16,185,129,0.08)]" />
            {registrationsLabel}
          </span>
          <LanguageSwitcher />
        </div>
      </nav>
    </div>
  )
}