"use client"

import { useTranslation } from "react-i18next"
import { Reveal } from "@/components/reveal"
import { CourseAccordion } from "@/components/course-accordion"

interface CourseOption {
  value: string
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
    <div>
      <Reveal delay={80}>
        <h1 className="max-w-2xl text-[clamp(30px,4vw,50px)] leading-[1.08] font-black tracking-[-0.03em] text-[#1A1A2E]">
          {headline}
        </h1>
      </Reveal>

      <Reveal delay={220}>
        <div className="mt-10">
          <p className="text-[16px] font-semibold tracking-[0.1em] text-[#0056D2] uppercase">
            {questionLabel}
          </p>
          <p className="mt-4 text-[16px] leading-[1.65] text-[#1A1A2E]">
            {questionContext}
          </p>
        </div>
        <div className="mt-5 space-y-2.5">
          {courseOptions.map((course) => {
            const isSelected = selectedCourse === course.value
            const label = t(`courses.${course.key}.label`)
            const descriptions = t(`courses.${course.key}.description`, {
              returnObjects: true,
            }) as string[]
            return (
              <CourseAccordion
                key={course.value}
                course={course}
                label={label}
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
