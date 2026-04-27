"use client"

import { Reveal } from "@/components/reveal"
import { ApplicationForm } from "@/components/application-form"

export function ApplicationFormPanel(
  props: React.ComponentProps<typeof ApplicationForm>
) {
  return (
    <Reveal delay={120} className="w-full lg:sticky lg:top-28">
      <div className="relative overflow-hidden rounded-[32px] border border-white/75 bg-white/78 p-[1px] shadow-[0_28px_80px_rgba(15,23,42,0.10)] backdrop-blur-2xl">
        <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(13,91,209,0.35),transparent)]" />
        <div className="relative rounded-[31px] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(244,248,252,0.96))] shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)]">
          <ApplicationForm {...props} />
        </div>
      </div>
    </Reveal>
  )
}
