import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"
import { renderToStaticMarkup } from "react-dom/server"

import { ApplicationForm } from "./application-form"
import { CourseAccordion } from "./course-accordion"

test("footer translations use the updated email and WhatsApp labels in every locale", async () => {
  const localeFiles = ["en", "fr", "es"]

  for (const locale of localeFiles) {
    const raw = await readFile(
      new URL(`../public/locales/${locale}/translation.json`, import.meta.url),
      "utf8"
    )
    const parsed = JSON.parse(raw) as {
      contact?: {
        englishPhoneLabel?: string
        footerEmail?: string
        frenchSpanishPhoneLabel?: string
      }
    }

    assert.equal(parsed.contact?.footerEmail, "info@pedagemy.com")
    assert.equal(parsed.contact?.englishPhoneLabel, "WhatsApp (English)")
    assert.equal(
      parsed.contact?.frenchSpanishPhoneLabel,
      "WhatsApp (French/Spanish)"
    )
  }
})

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

test("buildCountryCodeOptions uses locale-aware country names for English, French, and Spanish", async () => {
  const landingPageModule = await import("./landing-page")

  assert.equal(typeof landingPageModule.buildCountryCodeOptions, "function")

  const englishOptions = landingPageModule.buildCountryCodeOptions("en")
  const frenchOptions = landingPageModule.buildCountryCodeOptions("fr")
  const spanishOptions = landingPageModule.buildCountryCodeOptions("es-MX")

  assert.ok(englishOptions.length > 150)
  assert.deepEqual(
    englishOptions.find((option: { value: string }) => option.value === "+237"),
    {
      country: "Cameroon",
      flag: "🇨🇲",
      id: "CM-+237",
      value: "+237",
    }
  )
  assert.deepEqual(
    frenchOptions.find((option: { value: string }) => option.value === "+237"),
    {
      country: "Cameroun",
      flag: "🇨🇲",
      id: "CM-+237",
      value: "+237",
    }
  )
  assert.deepEqual(
    spanishOptions.find((option: { value: string }) => option.value === "+237"),
    {
      country: "Camerún",
      flag: "🇨🇲",
      id: "CM-+237",
      value: "+237",
    }
  )
  assert.deepEqual(
    englishOptions.find((option: { value: string }) => option.value === "+81"),
    {
      country: "Japan",
      flag: "🇯🇵",
      id: "JP-+81",
      value: "+81",
    }
  )
})

test("buildCountryCodeOptions deduplicates alias rows that collapse under localization", async () => {
  const landingPageModule = await import("./landing-page")

  assert.equal(typeof landingPageModule.buildCountryCodeOptions, "function")

  const frenchTurkeyOptions = landingPageModule
    .buildCountryCodeOptions("fr")
    .filter(
      (option: { country: string; value: string }) =>
        option.country === "Turquie" && option.value === "+90"
    )

  assert.deepEqual(frenchTurkeyOptions, [
    {
      country: "Turquie",
      flag: "🇹🇷",
      id: "TR-+90",
      value: "+90",
    },
  ])
})

test("buildCountryCodeOptions falls back to English names when a locale is unsupported", async () => {
  const landingPageModule = await import("./landing-page")

  assert.equal(typeof landingPageModule.buildCountryCodeOptions, "function")

  const options = landingPageModule.buildCountryCodeOptions("de")

  assert.deepEqual(options.find((option: { value: string }) => option.value === "+237"), {
    country: "Cameroon",
    flag: "🇨🇲",
    id: "CM-+237",
    value: "+237",
  })
})

test("filterCountryCodeOptions matches country names and dial codes", async () => {
  const landingPageModule = await import("./landing-page")

  assert.equal(typeof landingPageModule.filterCountryCodeOptions, "function")

  const options = [
    { country: "Cameroon", flag: "🇨🇲", id: "CM-+237", value: "+237" },
    { country: "Japan", flag: "🇯🇵", id: "JP-+81", value: "+81" },
    { country: "United States", flag: "🇺🇸", id: "US-+1", value: "+1" },
  ]

  assert.deepEqual(landingPageModule.filterCountryCodeOptions(options, "cam"), [
    { country: "Cameroon", flag: "🇨🇲", id: "CM-+237", value: "+237" },
  ])
  assert.deepEqual(landingPageModule.filterCountryCodeOptions(options, "+81"), [
    { country: "Japan", flag: "🇯🇵", id: "JP-+81", value: "+81" },
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
      termsAccepted: false,
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
      termsRequired: "You must accept the Terms and Conditions and Privacy Policy.",
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
    termsAccepted: "You must accept the Terms and Conditions and Privacy Policy.",
  })
})

test("buildLegalLinks creates locale-aware privacy and terms links", async () => {
  const landingPageModule = await import("./landing-page")

  assert.equal(typeof landingPageModule.buildLegalLinks, "function")

  assert.deepEqual(
    landingPageModule.buildLegalLinks("fr", (key: string) => {
      const translations: Record<string, string> = {
        "footer.privacyPolicy": "Politique de confidentialité",
        "footer.termsAndConditions": "Conditions générales",
      }

      return translations[key] ?? key
    }),
    [
      {
        href: "/fr/privacy-policy",
        label: "Politique de confidentialité",
      },
      {
        href: "/fr/terms-and-conditions",
        label: "Conditions générales",
      },
    ]
  )
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
          id: "CM-+237",
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
        termsAccepted:
          "You must accept the Terms and Conditions and Privacy Policy.",
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
      termsLabel="I accept the"
      termsConnectorLabel="and the"
      privacyPolicyLabel="Privacy Policy"
      privacyPolicyHref="/en/privacy-policy"
      termsAndConditionsLabel="Terms and Conditions"
      termsAndConditionsHref="/en/terms-and-conditions"
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
  assert.match(html, /I accept the /)
  assert.match(html, />Terms and Conditions<\/a>/)
  assert.match(html, / and the /)
  assert.match(html, />Privacy Policy<\/a>\./)
  assert.match(html, /href="\/en\/privacy-policy"/)
  assert.match(html, /href="\/en\/terms-and-conditions"/)
  assert.match(
    html,
    /You must accept the Terms and Conditions and Privacy Policy\./
  )
  assert.doesNotMatch(html, /Tech Career Launchpad — \$325/)
  assert.doesNotMatch(html, /<select required="" name="phoneCountryCode"/)
})

test("CourseAccordion hides programme prices in the accordion header", () => {
  const html = renderToStaticMarkup(
    <CourseAccordion
      course={{
        icon: "laptop",
        key: "techCareer",
        price: "$325",
        value: "techCareer",
      }}
      label="Tech Career Launchpad"
      descriptions={[
        "Learn the essentials for a modern tech career.",
        "Build practical confidence through guided exercises.",
      ]}
      isSelected={false}
      onToggle={() => {}}
    />
  )

  assert.match(html, /Tech Career Launchpad/)
  assert.doesNotMatch(html, /\$325/)
})