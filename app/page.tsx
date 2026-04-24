import type { Metadata } from "next"

import { I18nProvider } from "@/components/i18n-provider"
import PedagemyEarlyAccessLandingPage from "@/components/landing-page"

export const metadata: Metadata = {
  title: "Apply for Sponsored Career Programme Access",
  description:
    "Pedagemy and iCUBEFARM are awarding sponsored access to four workplace learning programmes — leadership, technology, communication, and compliance. Apply free, reviewed personally.",
}

export default function Page() {
  return (
    <I18nProvider locale="en">
      <PedagemyEarlyAccessLandingPage />
    </I18nProvider>
  )
}
