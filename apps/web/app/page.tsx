import type { Metadata } from "next"

import PedagemyEarlyAccessLandingPage from "@/components/landing-page"

export const metadata: Metadata = {
  title: "Apply for Sponsored Career Programme Access",
  description:
    "Pedagemy and iCUBEFARM are awarding sponsored access to four workplace learning programmes — leadership, technology, communication, and compliance. Apply free, reviewed personally.",
}

export default function Page() {
  return <PedagemyEarlyAccessLandingPage />
}
