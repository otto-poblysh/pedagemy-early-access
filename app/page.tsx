import type { Metadata } from "next"
import { I18nProvider } from "@/components/i18n-provider"
import ComingSoonPage from "@/components/coming-soon-page"

export const metadata: Metadata = {
  title: "Pedagemy — Coming Soon",
  description:
    "Pedagemy is a modern learning platform. Join the waitlist to be the first to know when we launch.",
}

export default function Page() {
  return (
    <I18nProvider locale="en">
      <ComingSoonPage />
    </I18nProvider>
  )
}
