"use client"

import { useTranslation } from "react-i18next"

const LOCALES = [
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
  { code: "es", label: "ES" },
] as const

export function LanguageSwitcher() {
  const { i18n } = useTranslation()

  const handleChange = (locale: string) => {
    i18n.changeLanguage(locale)
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`
    window.location.href = `/${locale}`
  }

  return (
    <div className="flex items-center gap-1">
      {LOCALES.map((lang) => (
        <button
          key={lang.code}
          onClick={() => handleChange(lang.code)}
          className={`rounded px-2 py-1 text-[11px] font-semibold tracking-wide uppercase transition-colors duration-200 ${
            i18n.language === lang.code
              ? "bg-[#0056D2] text-white"
              : "text-[#1A1A2E]/40 hover:text-[#0056D2]"
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  )
}
