import type { Metadata } from "next"
import { DM_Sans, Geist_Mono } from "next/font/google"

import "@workspace/ui/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { I18nProvider } from "@/components/i18n-provider"
import { cn } from "@workspace/ui/lib/utils"

export async function generateStaticParams() {
  return [{ locale: "en" }, { locale: "fr" }, { locale: "es" }]
}

export const metadata: Metadata = {
  title: {
    default: "Pedagemy — Sponsored Career Programme Access",
    template: "%s | Pedagemy",
  },
  description:
    "Pedagemy and iCUBEFARM are awarding sponsored access to four premium workplace learning programmes. Apply free — reviewed personally.",
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
}

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
})

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, dmSans.variable)}
    >
      <body>
        <ThemeProvider>
          <I18nProvider locale={locale}>{children}</I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
