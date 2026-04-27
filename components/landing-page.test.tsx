import assert from "node:assert/strict"
import test from "node:test"
import { renderToStaticMarkup } from "react-dom/server"

import { ApplicationForm } from "./application-form"

test("buildCourseOptions uses accordion labels as the form source of truth", async () => {
  const landingPageModule = await import("./landing-page")

  assert.equal(typeof landingPageModule.buildCourseOptions, "function")

  const t = (key: string) => {
    const translations: Record<string, string> = {
      "courses.softSkills.label": "Soft Skills Accelerator",
      "courses.techCareer.label": "Tech Career Launchpad",
      "courses.leadership.label": "Leadership Accelerator",
      "courses.workplaceReadiness.label": "Workplace Readiness",
    }

    return translations[key] ?? key
  }

  const courseOptions = landingPageModule.buildCourseOptions(t)

  assert.deepEqual(
    courseOptions.map((course) => ({
      key: course.key,
      label: course.label,
      price: course.price,
      value: course.value,
    })),
    [
      {
        key: "softSkills",
        label: "Soft Skills Accelerator",
        price: "$300",
        value: "softSkills",
      },
      {
        key: "techCareer",
        label: "Tech Career Launchpad",
        price: "$325",
        value: "techCareer",
      },
      {
        key: "leadership",
        label: "Leadership Accelerator",
        price: "$70",
        value: "leadership",
      },
      {
        key: "workplaceReadiness",
        label: "Workplace Readiness",
        price: "$60",
        value: "workplaceReadiness",
      },
    ]
  )
})

test("buildCountryCodeOptions uses the package dataset and includes countries beyond the old hardcoded list", async () => {
  const landingPageModule = await import("./landing-page")

  assert.equal(typeof landingPageModule.buildCountryCodeOptions, "function")

  const options = landingPageModule.buildCountryCodeOptions()

  assert.ok(options.length > 150)
  assert.deepEqual(options.find((option: { value: string }) => option.value === "+237"), {
    country: "Cameroon",
    flag: "🇨🇲",
    value: "+237",
  })
  assert.deepEqual(options.find((option: { value: string }) => option.value === "+81"), {
    country: "Japan",
    flag: "🇯🇵",
    value: "+81",
  })
})

test("filterCountryCodeOptions matches country names and dial codes", async () => {
  const landingPageModule = await import("./landing-page")

  assert.equal(typeof landingPageModule.filterCountryCodeOptions, "function")

  const options = [
    { country: "Cameroon", flag: "🇨🇲", value: "+237" },
    { country: "Japan", flag: "🇯🇵", value: "+81" },
    { country: "United States", flag: "🇺🇸", value: "+1" },
  ]

  assert.deepEqual(landingPageModule.filterCountryCodeOptions(options, "cam"), [
    { country: "Cameroon", flag: "🇨🇲", value: "+237" },
  ])
  assert.deepEqual(landingPageModule.filterCountryCodeOptions(options, "+81"), [
    { country: "Japan", flag: "🇯🇵", value: "+81" },
  ])
})

test("validateRegistrationFields returns field-level errors for missing and invalid values", async () => {
  const landingPageModule = await import("./landing-page")

  assert.equal(typeof landingPageModule.validateRegistrationFields, "function")

  const errors = landingPageModule.validateRegistrationFields(
    {
      course: "",
      email: "not-an-email",
      name: "Prince",
      phoneCountryCode: "",
      phoneNumber: "",
      reason: "",
    },
    {
      duplicateEmail: "Duplicate email",
      emailRequired: "Enter your email address.",
      invalidEmail: "Enter a valid email address.",
      nameRequired: "Enter your full name.",
      nameInvalid: "Enter at least first and last name.",
      phoneCountryCodeRequired: "Select a country code.",
      phoneNumberRequired: "Enter your phone number.",
      reasonRequired: "Tell us why this programme fits your goals.",
      selectProgram: "Select a programme.",
    }
  )

  assert.deepEqual(errors, {
    course: "Select a programme.",
    email: "Enter a valid email address.",
    name: "Enter at least first and last name.",
    phoneCountryCode: "Select a country code.",
    phoneNumber: "Enter your phone number.",
    reason: "Tell us why this programme fits your goals.",
  })
})

test("ApplicationForm renders a searchable country-code dropdown with embedded search UI", () => {
  const html = renderToStaticMarkup(
    <ApplicationForm
      selectedCourse=""
      courseOptions={[
        {
          icon: "laptop",
          key: "techCareer",
          label: "Tech Career Launchpad",
          original: "Tech Career Launchpad",
          price: "$325",
          value: "techCareer",
        },
      ] as never}
      countryCodeOptions={[
        {
          country: "Cameroon",
          flag: "🇨🇲",
          value: "+237",
        },
      ] as never}
      selectedCountryCode=""
      fieldErrors={{
        course: "Select a programme.",
        email: "Enter a valid email address.",
        name: "Enter at least first and last name.",
        phoneCountryCode: "Select a country code.",
        phoneNumber: "Enter your phone number.",
      } as never}
      submitting={false}
      submitError={null}
      submitted={false}
      onCourseSelect={() => {}}
      onCountryCodeSelect={() => {}}
      onFieldChange={() => {}}
      onSubmit={async () => {}}
      formTitle="Registration form"
      formSubtitle="All fields required. Takes under 2 minutes."
      fullNameLabel="Full name"
      fullNamePlaceholder="Your full name"
      emailLabel="Email address"
      emailPlaceholder="you@email.com"
      phoneLabel="Mobile phone"
      phoneCountryCodePlaceholder="Country code"
      phoneCountryCodeSearchPlaceholder="Search country or code"
      phonePlaceholder="Mobile number"
      programmeLabel="Programme"
      programmePlaceholder="Select a programme"
      reasonLabel="Why this programme?"
      reasonPlaceholder="Describe how this programme aligns with your career goals…"
      noPayment="No payment required."
      submitLabel="Submit Application"
      submittingLabel="Submitting…"
      successTitle="Application received."
      successBody="If selected, Pedagemy will contact you directly with access instructions."
    />
  )

  assert.match(html, />Select a programme<\/option>/)
  assert.match(html, /Search country or code/)
  assert.match(html, /type="hidden"[^>]*name="phoneCountryCode"/)
  assert.match(html, /🇨🇲/)
  assert.match(html, /\+237/)
  assert.match(html, /Mobile number/)
  assert.match(html, /Enter at least first and last name\./)
  assert.match(html, /Enter a valid email address\./)
  assert.match(html, /Select a country code\./)
  assert.match(html, /Enter your phone number\./)
  assert.match(html, /Select a programme\./)
  assert.doesNotMatch(html, /<select required="" name="phoneCountryCode"/)
})