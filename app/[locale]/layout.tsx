import { I18nProvider } from "@/components/i18n-provider"

export async function generateStaticParams() {
  return [{ locale: "en" }, { locale: "fr" }, { locale: "es" }]
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params

  return <I18nProvider locale={locale}>{children}</I18nProvider>
}
