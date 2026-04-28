import type { Metadata } from "next"

import { buildRegistrationConfirmationEmail } from "@/lib/registration-email"

export const metadata: Metadata = {
  title: "Registration Email Preview",
}

const previewSamples = [
  {
    label: "English",
    fullName: "Grace Hopper",
    locale: "en",
    selectedProgramme: "Leadership Accelerator Program",
  },
  {
    label: "Français",
    fullName: "Marie Curie",
    locale: "fr",
    selectedProgramme: "Accélérateur de leadership",
  },
  {
    label: "Español",
    fullName: "Ada Lovelace",
    locale: "es-MX",
    selectedProgramme: "Acelerador de liderazgo",
  },
] as const

export default function EmailPreviewPage() {
  const previews = previewSamples.map((sample) => ({
    ...sample,
    email: buildRegistrationConfirmationEmail(sample),
  }))

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(13,91,209,0.1),transparent_26%),linear-gradient(180deg,#F8FAFD_0%,#EEF3F9_100%)] px-6 py-10 font-(family-name:--font-dm-sans) text-[#182032] sm:px-8 lg:px-10">
      <div className="mx-auto max-w-360 space-y-6">
        <header className="rounded-[30px] border border-white/75 bg-white/88 px-7 py-7 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
          <p className="text-[12px] font-black uppercase tracking-[0.08em] text-[#0D5BD1]">
            Registration Email Preview
          </p>
          <h1 className="mt-3 text-[clamp(30px,4vw,48px)] font-black tracking-[-0.04em] text-balance">
            Localized confirmation email previews
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[#5B6885]">
            Preview only — no email is sent from this page.
          </p>
        </header>

        <section className="grid gap-6 xl:grid-cols-3">
          {previews.map((preview) => (
            <article
              key={preview.label}
              className="overflow-hidden rounded-[28px] border border-white/75 bg-white/90 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl"
            >
              <div className="border-b border-[#E4EAF3] bg-[#F8FAFD] px-6 py-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex rounded-full bg-[#EAF2FF] px-3 py-1 text-[11px] font-black uppercase tracking-[0.08em] text-[#0D5BD1]">
                    {preview.label}
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#71809E]">
                    {preview.email.locale}
                  </span>
                </div>
                <h2 className="mt-4 text-lg font-black tracking-[-0.03em] text-[#182032]">
                  {preview.email.subject}
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#5B6885]">
                  Programme: {preview.selectedProgramme}
                </p>
              </div>

              <div className="space-y-5 px-6 py-6">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.08em] text-[#44506A]">
                    Rendered HTML
                  </p>
                  <div className="mt-2 rounded-[22px] border border-[#E4EAF3] bg-[#FCFDFE] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                    <div
                      className="text-[14px] leading-7 text-[#24304A] [&_a]:font-semibold [&_a]:text-[#0D5BD1] [&_li]:mt-2 [&_p]:my-4 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0 [&_strong]:font-bold [&_ul]:my-4 [&_ul]:pl-5"
                      dangerouslySetInnerHTML={{ __html: preview.email.html }}
                    />
                  </div>
                </div>

                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.08em] text-[#44506A]">
                    Plain-text version
                  </p>
                  <pre className="mt-2 overflow-x-auto rounded-[22px] border border-[#E4EAF3] bg-[#111827] p-5 text-[12px] leading-6 text-[#E5EEF9] whitespace-pre-wrap">
                    {preview.email.text}
                  </pre>
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  )
}