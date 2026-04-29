import type { Metadata } from "next"
import Link from "next/link"

import { getLegalContent, normalizeLegalLocale } from "@/lib/legal-content"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const content = getLegalContent(locale)

  return {
    title: content.privacy.title,
    description: content.privacy.description,
  }
}

export default async function PrivacyPolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const normalizedLocale = normalizeLegalLocale(locale)
  const content = getLegalContent(normalizedLocale).privacy

  return (
    <main className="min-h-dvh bg-[#F3F6FB] px-6 py-10 text-[#1A1A2E] sm:px-8 lg:px-12">
      <div className="mx-auto max-w-4xl rounded-[32px] border border-white/80 bg-white/88 p-8 shadow-[0_28px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-10">
        <Link
          href={`/${normalizedLocale}`}
          className="text-[13px] font-medium text-[#0056D2] underline decoration-[#0056D2]/30 underline-offset-3"
        >
          {content.backLabel}
        </Link>
        <div className="mt-6 space-y-3">
          <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#0056D2]/72">
            {content.updatedAt}
          </p>
          <h1 className="text-balance text-[34px] font-semibold tracking-[-0.04em] sm:text-[44px]">
            {content.title}
          </h1>
          <p className="max-w-3xl text-[15px] leading-7 text-[#1A1A2E]/68">
            {content.description}
          </p>
        </div>
        <div className="mt-8 space-y-4 text-[15px] leading-7 text-[#1A1A2E]/78">
          {content.intro.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <div className="mt-10 space-y-8">
          {content.sections.map((section) => (
            <section key={section.title} className="space-y-3">
              <h2 className="text-[22px] font-semibold tracking-[-0.03em] text-[#1A1A2E]">
                {section.title}
              </h2>
              {section.paragraphs.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-[15px] leading-7 text-[#1A1A2E]/74"
                >
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>
        <p className="mt-10 text-[14px] leading-6 text-[#1A1A2E]/60">
          {content.contactLabel}
        </p>
      </div>
    </main>
  )
}