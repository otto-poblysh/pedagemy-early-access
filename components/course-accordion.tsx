"use client"

import { Icon } from "@/components/icons"

interface CourseAccordionProps {
  course: {
    value: string
    price: string
    icon: string
    key: string
  }
  label: string
  descriptions: string[]
  isSelected: boolean
  onToggle: () => void
}

export function CourseAccordion({
  course,
  label,
  descriptions,
  isSelected,
  onToggle,
}: CourseAccordionProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`group w-full rounded-[24px] border p-px text-left transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 ${
        isSelected
          ? "border-[#0D5BD1]/22 bg-white/90 shadow-[0_14px_40px_rgba(13,91,209,0.10)]"
          : "border-white/70 bg-white/45 shadow-[0_10px_28px_rgba(15,23,42,0.04)] hover:border-[#1A1A2E]/12 hover:bg-white/70"
      }`}
    >
      <div
        className={`rounded-[23px] px-5 py-4 transition-colors duration-300 ${
          isSelected
            ? "bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(246,250,255,0.94))]"
            : "bg-white/56 group-hover:bg-white/78"
        }`}
      >
        <div className="flex items-center gap-4">
          <div
            className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl transition-colors duration-300 ${
              isSelected
                ? "bg-[#0D5BD1] text-white shadow-[0_10px_18px_rgba(13,91,209,0.24)]"
                : "bg-[#1A1A2E]/6 text-[#1A1A2E]/45 group-hover:bg-[#1A1A2E]/10"
            }`}
          >
            <Icon name={course.icon} className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p
              className={`text-[14px] leading-tight font-semibold tracking-[-0.01em] ${
                isSelected ? "text-[#0D5BD1]" : "text-[#1A1A2E]/70"
              }`}
            >
              {label}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`shrink-0 text-[15px] font-bold tabular-nums transition-colors duration-300 ${
                isSelected ? "text-[#003A8C]" : "text-[#1A1A2E]/38"
              }`}
            >
              {course.price}
            </span>
            <span
              className={`grid h-6 w-6 shrink-0 place-items-center rounded-full transition-all duration-300 ${
                isSelected
                  ? "rotate-180 bg-[#0D5BD1] text-white"
                  : "bg-[#1A1A2E]/8 text-[#1A1A2E]/32 group-hover:bg-[#1A1A2E]/15"
              }`}
            >
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
          </div>
        </div>
        <div
          className="overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
          style={{
            maxHeight: isSelected ? "500px" : "0px",
            opacity: isSelected ? 1 : 0,
          }}
        >
          <ul className="mt-4 list-none space-y-2.5 pl-[calc(2.5rem+16px)] text-[13px] leading-[1.9] text-[#1A1A2E]/60">
            {descriptions.map((sentence, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#0D5BD1]" />
                <span>{sentence}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </button>
  )
}