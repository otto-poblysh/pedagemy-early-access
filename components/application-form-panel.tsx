"use client"

import { Reveal } from "@/components/reveal"
import { ApplicationForm } from "@/components/application-form"

export function ApplicationFormPanel(
  props: React.ComponentProps<typeof ApplicationForm>
) {
  return (
    <Reveal delay={120} className="lg:sticky lg:top-24">
      <div className="rounded-xl border border-[#1A1A2E]/8 bg-white p-1.5 shadow-[0_8px_48px_rgba(26,26,46,0.07)]">
        <div className="rounded-[10px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]">
          <ApplicationForm {...props} />
        </div>
      </div>
    </Reveal>
  )
}