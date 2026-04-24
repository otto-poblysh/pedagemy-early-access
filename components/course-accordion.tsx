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
      className={`group w-full rounded-lg border p-px text-left transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
        isSelected
          ? "border-[#0056D2]/25 shadow-[0_4px_24px_rgba(0,86,210,0.10)]"
          : "border-[#1A1A2E]/8 hover:border-[#1A1A2E]/15"
      }`}
    >
      <div
        className={`rounded-md px-5 py-4 transition-colors duration-300 ${
          isSelected ? "bg-white" : "bg-[#F7F9FC] group-hover:bg-white/70"
        }`}
      >
        <div className="flex items-center gap-4">
          <div
            className={`grid h-9 w-9 shrink-0 place-items-center rounded-md transition-colors duration-300 ${
              isSelected
                ? "bg-[#0056D2] text-white"
                : "bg-[#1A1A2E]/6 text-[#1A1A2E]/45 group-hover:bg-[#1A1A2E]/10"
            }`}
          >
            <Icon name={course.icon} className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p
              className={`text-[14px] leading-tight font-semibold ${
                isSelected ? "text-[#0056D2]" : "text-[#1A1A2E]/65"
              }`}
            >
              {label}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`shrink-0 text-[15px] font-bold tabular-nums transition-colors duration-300 ${
                isSelected ? "text-[#003A8C]" : "text-[#1A1A2E]/30"
              }`}
            >
              {course.price}
            </span>
            <span
              className={`grid h-5 w-5 shrink-0 place-items-center rounded-full transition-all duration-300 ${
                isSelected
                  ? "rotate-180 bg-[#0056D2] text-white"
                  : "bg-[#1A1A2E]/10 text-[#1A1A2E]/30 group-hover:bg-[#1A1A2E]/15"
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
          <ul className="mt-4 list-none space-y-2 pl-[calc(2.25rem+16px)] text-[13px] leading-[1.9] text-[#1A1A2E]/55">
            {descriptions.map((sentence, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#0056D2]" />
                <span>{sentence}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </button>
  )
}