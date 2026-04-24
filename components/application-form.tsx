"use client"

import { Icon } from "@/components/icons"

interface CourseOption {
  value: string
  original: string
  price: string
  icon: string
  key: string
}

interface ApplicationFormProps {
  selectedCourse: string
  courseOptions: CourseOption[]
  submitting: boolean
  submitError: string | null
  submitted: boolean
  onCourseSelect: (value: string) => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>
  formTitle: string
  formSubtitle: string
  fullNameLabel: string
  fullNamePlaceholder: string
  emailLabel: string
  emailPlaceholder: string
  phoneLabel: string
  phonePlaceholder: string
  programmeLabel: string
  reasonLabel: string
  reasonPlaceholder: string
  noPayment: string
  submitLabel: string
  submittingLabel: string
  successTitle: string
  successBody: string
}

export function ApplicationForm({
  selectedCourse,
  courseOptions,
  submitting,
  submitError,
  submitted,
  onCourseSelect,
  onSubmit,
  formTitle,
  formSubtitle,
  fullNameLabel,
  fullNamePlaceholder,
  emailLabel,
  emailPlaceholder,
  phoneLabel,
  phonePlaceholder,
  programmeLabel,
  reasonLabel,
  reasonPlaceholder,
  noPayment,
  submitLabel,
  submittingLabel,
  successTitle,
  successBody,
}: ApplicationFormProps) {
  if (submitted) {
    return (
      <div className="flex flex-col items-center px-6 py-12 text-center">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-[#EBF2FF]">
          <Icon name="check" className="h-5 w-5 text-[#0056D2]" />
        </div>
        <h3 className="mt-4 text-[18px] font-bold text-[#1A1A2E]">
          {successTitle}
        </h3>
        <p className="mt-2 max-w-xs text-[13px] leading-[1.6] text-[#1A1A2E]/48">
          {successBody}
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="border-b border-[#1A1A2E]/6 px-6 py-5">
        <h3 className="text-[16px] font-bold text-[#1A1A2E]">
          {formTitle}
        </h3>
        <p className="mt-1 text-[12px] text-[#1A1A2E]/42">
          {formSubtitle}
        </p>
      </div>

      <div className="px-6 py-6">
        <label className="block">
          <span className="text-[12px] font-medium text-[#1A1A2E]/60">
            {fullNameLabel}
          </span>
          <input
            required
            name="name"
            type="text"
            placeholder={fullNamePlaceholder}
            className="mt-1 w-full rounded border border-[#1A1A2E]/10 bg-[#F7F9FC] px-4 py-2.5 text-[13px] text-[#1A1A2E] transition-all duration-300 outline-none placeholder:text-[#1A1A2E]/28 focus:border-[#0056D2]/40 focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,86,210,0.10)]"
          />
        </label>

        <label className="mt-3 block">
          <span className="text-[12px] font-medium text-[#1A1A2E]/60">
            {emailLabel}
          </span>
          <input
            required
            name="email"
            type="email"
            placeholder={emailPlaceholder}
            className="mt-1 w-full rounded border border-[#1A1A2E]/10 bg-[#F7F9FC] px-4 py-2.5 text-[13px] text-[#1A1A2E] transition-all duration-300 outline-none placeholder:text-[#1A1A2E]/28 focus:border-[#0056D2]/40 focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,86,210,0.10)]"
          />
        </label>

        <label className="mt-3 block">
          <span className="text-[12px] font-medium text-[#1A1A2E]/60">
            {phoneLabel}
          </span>
          <input
            required
            name="phone"
            type="tel"
            placeholder={phonePlaceholder}
            className="mt-1 w-full rounded border border-[#1A1A2E]/10 bg-[#F7F9FC] px-4 py-2.5 text-[13px] text-[#1A1A2E] transition-all duration-300 outline-none placeholder:text-[#1A1A2E]/28 focus:border-[#0056D2]/40 focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,86,210,0.10)]"
          />
        </label>

        <label className="mt-3 block">
          <span className="text-[12px] font-medium text-[#1A1A2E]/60">
            {programmeLabel}
          </span>
          <select
            required
            value={selectedCourse}
            onChange={(e) => onCourseSelect(e.target.value)}
            className="mt-1 w-full rounded border border-[#1A1A2E]/10 bg-[#F7F9FC] px-4 py-2.5 text-[13px] font-medium text-[#1A1A2E] transition-all duration-300 outline-none focus:border-[#0056D2]/40 focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,86,210,0.10)]"
          >
            {courseOptions.map((c) => (
              <option key={c.value} value={c.value}>
                {c.original} — {c.price}
              </option>
            ))}
          </select>
        </label>

        <label className="mt-3 block">
          <span className="text-[12px] font-medium text-[#1A1A2E]/60">
            {reasonLabel}
          </span>
          <textarea
            required
            name="reason"
            rows={3}
            placeholder={reasonPlaceholder}
            className="mt-1 w-full resize-y rounded border border-[#1A1A2E]/10 bg-[#F7F9FC] px-4 py-2.5 text-[13px] leading-[1.5] text-[#1A1A2E] transition-all duration-300 outline-none placeholder:text-[#1A1A2E]/28 focus:border-[#0056D2]/40 focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,86,210,0.10)]"
          />
        </label>

        {submitError ? (
          <p className="mt-3 rounded border border-red-200 bg-red-50 px-4 py-2.5 text-[12px] font-medium text-red-700">
            {submitError}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className="group mt-5 flex w-full items-center justify-center gap-2 rounded bg-[#0056D2] px-5 py-3 text-[13px] font-semibold text-white shadow-[0_4px_16px_rgba(0,86,210,0.25)] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:bg-[#003A8C] hover:shadow-[0_8px_32px_rgba(0,86,210,0.30)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-55"
        >
          {submitting ? submittingLabel : submitLabel}
          {!submitting && (
            <span className="grid h-5 w-5 place-items-center rounded-full bg-white/12 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-px">
              <Icon name="arrowUpRight" className="h-3 w-3" />
            </span>
          )}
        </button>

        <p className="mt-3 text-center text-[11px] leading-4 text-[#1A1A2E]/30">
          {noPayment}
        </p>
      </div>
    </form>
  )
}