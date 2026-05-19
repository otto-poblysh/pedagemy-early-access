"use client"

import { ReactNode, useEffect, useState } from "react"
import { I18nextProvider } from "react-i18next"
import i18n from "@/i18n/client"

const LOCALES = ["en", "fr", "es"] as const

interface I18nProviderProps {
  children: ReactNode
  locale: string
}

function getValidLocale(locale: string) {
  return LOCALES.includes(locale as (typeof LOCALES)[number]) ? locale : "en"
}

export function I18nProvider({ children, locale }: I18nProviderProps) {
  const validLocale = getValidLocale(locale)
  const [ready, setReady] = useState(false)

  // Synchronously set language for SSR/SSG — resources are pre-loaded inline
  if (i18n.language !== validLocale) {
    i18n.changeLanguage(validLocale)
  }

  useEffect(() => {
    if (i18n.language === validLocale && i18n.isInitialized) {
      setReady(true)
      return
    }
    void i18n.changeLanguage(validLocale).then(() => setReady(true))
  }, [validLocale])

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}
