"use client"

import {
  startTransition,
  useDeferredValue,
  useEffect,
  useRef,
  useState,
} from "react"
import { Icon } from "@/components/icons"

interface CourseOption {
  value: string
  label: string
  price: string
  icon: string
  key: string
}

interface CountryCodeOption {
  country: string
  flag: string
  id: string
  value: string
}

type FieldName =
  | "name"
  | "email"
  | "phoneCountryCode"
  | "phoneNumber"
  | "course"
  | "reason"
  | "termsAccepted"

interface ApplicationFormProps {
  selectedCourse: string
  courseOptions: CourseOption[]
  countryCodeOptions: CountryCodeOption[]
  selectedCountryCode: string
  fieldErrors: Partial<Record<FieldName, string>>
  submitting: boolean
  submitError: string | null
  submitted: boolean
  onCourseSelect: (value: string) => void
  onCountryCodeSelect: (value: string) => void
  onFieldChange: (field: FieldName) => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>
  formTitle: string
  formSubtitle: string
  fullNameLabel: string
  fullNamePlaceholder: string
  emailLabel: string
  emailPlaceholder: string
  phoneLabel: string
  phoneCountryCodePlaceholder: string
  phoneCountryCodeSearchPlaceholder: string
  phonePlaceholder: string
  programmeLabel: string
  programmePlaceholder: string
  reasonLabel: string
  reasonPlaceholder: string
  termsLabel: string
  termsConnectorLabel: string
  privacyPolicyLabel: string
  privacyPolicyHref: string
  termsAndConditionsLabel: string
  termsAndConditionsHref: string
  noPayment: string
  submitLabel: string
  submittingLabel: string
  successTitle: string
  successBody: string
}

function filterCountryCodeOptions(
  options: CountryCodeOption[],
  query: string
) {
  const normalizedQuery = query.trim().toLowerCase()

  if (!normalizedQuery) {
    return options
  }

  return options.filter((option) =>
    `${option.country} ${option.value}`
      .toLowerCase()
      .includes(normalizedQuery)
  )
}

export function ApplicationForm({
  selectedCourse,
  courseOptions,
  countryCodeOptions,
  selectedCountryCode,
  fieldErrors,
  submitting,
  submitError,
  submitted,
  onCourseSelect,
  onCountryCodeSelect,
  onFieldChange,
  onSubmit,
  formTitle,
  formSubtitle,
  fullNameLabel,
  fullNamePlaceholder,
  emailLabel,
  emailPlaceholder,
  phoneLabel,
  phoneCountryCodePlaceholder,
  phoneCountryCodeSearchPlaceholder,
  phonePlaceholder,
  programmeLabel,
  programmePlaceholder,
  reasonLabel,
  reasonPlaceholder,
  termsLabel,
  termsConnectorLabel,
  privacyPolicyLabel,
  privacyPolicyHref,
  termsAndConditionsLabel,
  termsAndConditionsHref,
  noPayment,
  submitLabel,
  submittingLabel,
  successTitle,
  successBody,
}: ApplicationFormProps) {
  const [countryCodeQuery, setCountryCodeQuery] = useState("")
  const [isCountryCodeOpen, setIsCountryCodeOpen] = useState(false)
  const deferredCountryCodeQuery = useDeferredValue(countryCodeQuery)
  const countryCodeDropdownRef = useRef<HTMLDivElement | null>(null)
  const filteredCountryCodeOptions = filterCountryCodeOptions(
    countryCodeOptions,
    deferredCountryCodeQuery
  )
  const selectedCountryOption = countryCodeOptions.find(
    (option) => option.value === selectedCountryCode
  )

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (
        countryCodeDropdownRef.current &&
        !countryCodeDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCountryCodeOpen(false)
      }
    }

    document.addEventListener("mousedown", handlePointerDown)
    return () => document.removeEventListener("mousedown", handlePointerDown)
  }, [])

  if (submitted) {
    return (
      <div className="flex flex-col items-center px-8 py-14 text-center">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-[#E9F1FF] shadow-[0_10px_24px_rgba(13,91,209,0.10)]">
          <Icon name="check" className="h-5 w-5 text-[#0056D2]" />
        </div>
        <h3 className="mt-5 text-[18px] font-bold tracking-[-0.02em] text-[#1A1A2E]">
          {successTitle}
        </h3>
        <p className="mt-2 max-w-xs text-[13px] leading-[1.7] text-[#1A1A2E]/52">
          {successBody}
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="border-b border-[#1A1A2E]/7 px-6 py-6 sm:px-7">
        <h3 className="text-[16px] font-bold tracking-[-0.02em] text-[#1A1A2E]">
          {formTitle}
        </h3>
        <p className="mt-1 text-[12px] leading-5 text-[#1A1A2E]/48">
          {formSubtitle}
        </p>
      </div>

      <div className="px-6 py-6 sm:px-7">
        <label className="block">
          <span className="text-[12px] font-medium tracking-[0.01em] text-[#1A1A2E]/62">
            {fullNameLabel}
          </span>
          <input
            required
            name="name"
            type="text"
            placeholder={fullNamePlaceholder}
            onChange={() => onFieldChange("name")}
            className="mt-1.5 w-full rounded-2xl border border-[#1A1A2E]/8 bg-white/70 px-4 py-3 text-[13px] text-[#1A1A2E] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] transition-all duration-300 outline-none placeholder:text-[#1A1A2E]/30 focus:border-[#0056D2]/40 focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,86,210,0.10)]"
          />
          {fieldErrors.name ? (
            <p className="mt-2 text-[12px] font-medium text-red-700">
              {fieldErrors.name}
            </p>
          ) : null}
        </label>

        <label className="mt-3 block">
          <span className="text-[12px] font-medium tracking-[0.01em] text-[#1A1A2E]/62">
            {emailLabel}
          </span>
          <input
            required
            name="email"
            type="email"
            placeholder={emailPlaceholder}
            onChange={() => onFieldChange("email")}
            className="mt-1.5 w-full rounded-2xl border border-[#1A1A2E]/8 bg-white/70 px-4 py-3 text-[13px] text-[#1A1A2E] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] transition-all duration-300 outline-none placeholder:text-[#1A1A2E]/30 focus:border-[#0056D2]/40 focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,86,210,0.10)]"
          />
          {fieldErrors.email ? (
            <p className="mt-2 text-[12px] font-medium text-red-700">
              {fieldErrors.email}
            </p>
          ) : null}
        </label>

        <label className="mt-3 block">
          <span className="text-[12px] font-medium tracking-[0.01em] text-[#1A1A2E]/62">
            {phoneLabel}
          </span>
          <div className="mt-1.5 grid grid-cols-[148px_minmax(0,1fr)] gap-3">
            <div ref={countryCodeDropdownRef} className="relative">
              <input
                type="hidden"
                name="phoneCountryCode"
                value={selectedCountryCode}
              />
              <button
                type="button"
                onClick={() => setIsCountryCodeOpen((current) => !current)}
                className="flex w-full items-center justify-between rounded-2xl border border-[#1A1A2E]/8 bg-white/70 px-3.5 py-3 text-left text-[13px] text-[#1A1A2E] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] transition-all duration-300 outline-none focus:border-[#0056D2]/40 focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,86,210,0.10)]"
              >
                <span className="truncate">
                  {selectedCountryOption
                    ? `${selectedCountryOption.flag} ${selectedCountryOption.value} ${selectedCountryOption.country}`
                    : phoneCountryCodePlaceholder}
                </span>
                <span className="ml-2 shrink-0 text-[#1A1A2E]/45">
                  <svg viewBox="0 0 12 12" fill="none" className="h-3 w-3">
                    <path
                      d="M2 4l4 4 4-4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </button>
              <div
                className={`absolute z-20 mt-2 w-70 rounded-[22px] border border-white/80 bg-white/90 p-2 shadow-[0_24px_48px_rgba(15,23,42,0.14)] backdrop-blur-xl ${
                  isCountryCodeOpen ? "block" : "hidden"
                }`}
              >
                <input
                  type="text"
                  value={countryCodeQuery}
                  onChange={(event) => {
                    const nextQuery = event.target.value
                    startTransition(() => {
                      setCountryCodeQuery(nextQuery)
                    })
                  }}
                  placeholder={phoneCountryCodeSearchPlaceholder}
                  className="w-full rounded-2xl border border-[#1A1A2E]/8 bg-[#F5F8FC] px-3 py-2.5 text-[13px] text-[#1A1A2E] outline-none transition-all duration-300 placeholder:text-[#1A1A2E]/30 focus:border-[#0056D2]/40 focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,86,210,0.10)]"
                />
                <div className="mt-2 max-h-64 overflow-y-auto rounded-2xl border border-[#1A1A2E]/8 bg-[#F5F8FC]/85 p-1.5">
                  {filteredCountryCodeOptions.length > 0 ? (
                    filteredCountryCodeOptions.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => {
                          onCountryCodeSelect(option.value)
                          onFieldChange("phoneCountryCode")
                          setCountryCodeQuery("")
                          setIsCountryCodeOpen(false)
                        }}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-[13px] text-[#1A1A2E] transition-colors duration-200 hover:bg-white"
                      >
                        <span className="min-w-0 truncate text-[#1A1A2E]/72">
                          {option.flag} <span className="font-medium text-[#1A1A2E]">{option.value}</span>{" "}
                          {option.country}
                        </span>
                      </button>
                    ))
                  ) : (
                    <p className="px-3 py-2 text-[12px] text-[#1A1A2E]/48">
                      No matching country codes.
                    </p>
                  )}
                </div>
              </div>
              {fieldErrors.phoneCountryCode ? (
                <p className="mt-2 text-[12px] font-medium text-red-700">
                  {fieldErrors.phoneCountryCode}
                </p>
              ) : null}
            </div>

            <div>
              <input
                required
                name="phoneNumber"
                type="tel"
                inputMode="tel"
                placeholder={phonePlaceholder}
                onChange={() => onFieldChange("phoneNumber")}
                className="w-full rounded-2xl border border-[#1A1A2E]/8 bg-white/70 px-4 py-3 text-[13px] text-[#1A1A2E] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] transition-all duration-300 outline-none placeholder:text-[#1A1A2E]/30 focus:border-[#0056D2]/40 focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,86,210,0.10)]"
              />
              {fieldErrors.phoneNumber ? (
                <p className="mt-2 text-[12px] font-medium text-red-700">
                  {fieldErrors.phoneNumber}
                </p>
              ) : null}
            </div>
          </div>
        </label>

        <label className="mt-3 block">
          <span className="text-[12px] font-medium tracking-[0.01em] text-[#1A1A2E]/62">
            {programmeLabel}
          </span>
          <select
            required
            name="course"
            value={selectedCourse}
            onChange={(e) => {
              onCourseSelect(e.target.value)
              onFieldChange("course")
            }}
            className="mt-1.5 w-full rounded-2xl border border-[#1A1A2E]/8 bg-white/70 px-4 py-3 text-[13px] font-medium text-[#1A1A2E] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] transition-all duration-300 outline-none focus:border-[#0056D2]/40 focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,86,210,0.10)]"
          >
            <option value="">{programmePlaceholder}</option>
            {courseOptions.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
          {fieldErrors.course ? (
            <p className="mt-2 text-[12px] font-medium text-red-700">
              {fieldErrors.course}
            </p>
          ) : null}
        </label>

        <label className="mt-3 block">
          <span className="text-[12px] font-medium tracking-[0.01em] text-[#1A1A2E]/62">
            {reasonLabel}
          </span>
          <textarea
            required
            name="reason"
            rows={3}
            placeholder={reasonPlaceholder}
            onChange={() => onFieldChange("reason")}
            className="mt-1.5 w-full resize-y rounded-2xl border border-[#1A1A2E]/8 bg-white/70 px-4 py-3 text-[13px] leading-normal text-[#1A1A2E] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] transition-all duration-300 outline-none placeholder:text-[#1A1A2E]/30 focus:border-[#0056D2]/40 focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,86,210,0.10)]"
          />
          {fieldErrors.reason ? (
            <p className="mt-2 text-[12px] font-medium text-red-700">
              {fieldErrors.reason}
            </p>
          ) : null}
        </label>

        <label className="mt-4 block">
          <span className="flex items-start gap-3 rounded-2xl border border-[#1A1A2E]/8 bg-[#F7F9FC] px-4 py-3 text-[12px] leading-5 text-[#1A1A2E]/72 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]">
            <input
              required
              name="termsAccepted"
              type="checkbox"
              value="accepted"
              onChange={() => onFieldChange("termsAccepted")}
              className="mt-0.5 h-4 w-4 rounded border border-[#1A1A2E]/18 text-[#0056D2] focus:ring-2 focus:ring-[#0056D2]/25"
            />
            <span>
              {termsLabel}{" "}
              <a
                href={termsAndConditionsHref}
                className="font-semibold text-[#0056D2] underline decoration-[#0056D2]/30 underline-offset-3 transition-colors duration-200 hover:text-[#003A8C]"
              >
                {termsAndConditionsLabel}
              </a>{" "}
              {termsConnectorLabel}{" "}
              <a
                href={privacyPolicyHref}
                className="font-semibold text-[#0056D2] underline decoration-[#0056D2]/30 underline-offset-3 transition-colors duration-200 hover:text-[#003A8C]"
              >
                {privacyPolicyLabel}
              </a>
              .
            </span>
          </span>
          {fieldErrors.termsAccepted ? (
            <p className="mt-2 text-[12px] font-medium text-red-700">
              {fieldErrors.termsAccepted}
            </p>
          ) : null}
        </label>

        {submitError ? (
          <p className="mt-4 rounded-2xl border border-red-200/80 bg-red-50/90 px-4 py-3 text-[12px] font-medium text-red-700 shadow-[0_10px_24px_rgba(185,28,28,0.06)]">
            {submitError}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className="group mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#0D5BD1,#003A8C)] px-5 py-3.5 text-[13px] font-semibold text-white shadow-[0_18px_32px_rgba(13,91,209,0.22)] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:shadow-[0_24px_40px_rgba(13,91,209,0.28)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-55"
        >
          {submitting ? submittingLabel : submitLabel}
          {!submitting && (
            <span className="grid h-5 w-5 place-items-center rounded-full bg-white/12 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-px">
              <Icon name="arrowUpRight" className="h-3 w-3" />
            </span>
          )}
        </button>

        <p className="mt-3 text-center text-[11px] leading-4 text-[#1A1A2E]/34">
          {noPayment}
        </p>
      </div>
    </form>
  )
}