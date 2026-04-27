"use client"

import { useTranslation } from "react-i18next"
import { Reveal } from "@/components/reveal"
import { CourseAccordion } from "@/components/course-accordion"

interface CourseOption {
  value: string
  label: string
  price: string
  icon: string
  key: string
}

interface HeroSectionProps {
  headline: string
  questionLabel: string
  questionContext: string
  courseOptions: CourseOption[]
  selectedCourse: string
  onCourseSelect: (value: string) => void
}

export function HeroSection({
  headline,
  questionLabel,
  questionContext,
  courseOptions,
  selectedCourse,
  onCourseSelect,
}: HeroSectionProps) {
  const { t } = useTranslation()

  return (
    <div className="relative pt-4 lg:pt-8">
      <Reveal delay={80}>
        <h1 className="max-w-4xl text-[clamp(2.55rem,5vw,4.4rem)] leading-[0.96] font-black tracking-tighter text-[#111827] text-balance">
          {headline}
        </h1>
      </Reveal>

      <Reveal delay={220}>
        <div className="mt-10 max-w-3xl rounded-[28px] border border-white/80 bg-white/58 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur-xl sm:p-7">
          <p className="text-[11px] font-semibold tracking-[0.2em] text-[#0D5BD1] uppercase">
            {questionLabel}
          </p>
          <p className="mt-4 max-w-2xl text-[15px] leading-[1.72] font-medium text-[#1A1A2E]/90 sm:text-[16px]">
            {questionContext}
          </p>
        </div>
        <div className="mt-6 space-y-3">
          {courseOptions.map((course) => {
            const isSelected = selectedCourse === course.value
            const descriptions = t(`courses.${course.key}.description`, {
              returnObjects: true,
            }) as string[]
            return (
              <CourseAccordion
                key={course.value}
                course={course}
                label={course.label}
                descriptions={descriptions}
                isSelected={isSelected}
                onToggle={() =>
                  onCourseSelect(isSelected ? "" : course.value)
                }
              />
            )
          })}
        </div>
      </Reveal>
    </div>
  )
}
