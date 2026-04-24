import type { Metadata } from "next"

import PedagemyEarlyAccessLandingPage from "@/components/landing-page"

export const metadata: Metadata = {
  title: "Apply for Sponsored Career Programme Access",
}

export default function LocalePage() {
  return <PedagemyEarlyAccessLandingPage />
}
