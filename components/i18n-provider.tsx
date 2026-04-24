"use client"

import { ReactNode, useEffect, useState } from "react"
import { I18nextProvider } from "react-i18next"
import i18n from "@/i18n/client"

const LOCALES = ["en", "fr", "es"] as const

interface I18nProviderProps {
  children: ReactNode
  locale: string
}

export function I18nProvider({ children, locale }: I18nProviderProps) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const validLocale = LOCALES.includes(locale as (typeof LOCALES)[number])
      ? locale
      : "en"
    void i18n.changeLanguage(validLocale).then(() => setReady(true))
  }, [locale])

  if (!ready) {
    return null
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}
