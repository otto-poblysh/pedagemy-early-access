import assert from "node:assert/strict"
import test from "node:test"
import { renderToStaticMarkup } from "react-dom/server"

test("formatSubmissionDate parses Supabase timestamptz values without forcing an extra timezone suffix", async () => {
  const adminPageModule = await import("./registrations-table")

  assert.equal(typeof adminPageModule.formatSubmissionDate, "function")

  const createdAt = "2026-04-27T14:04:57.586273+00:00"

  assert.equal(
    adminPageModule.formatSubmissionDate(createdAt),
    new Date(createdAt).toLocaleString()
  )
})

test("paginateRegistrations returns stable row numbers and page slices", async () => {
  const adminPageModule = await import("./registrations-table")

  assert.equal(typeof adminPageModule.paginateRegistrations, "function")

  const registrations = Array.from({ length: 12 }, (_, index) => ({
    id: index + 1,
    name: `Person ${index + 1}`,
    email: `person${index + 1}@example.com`,
    phone: `+237 600 000 ${String(index + 1).padStart(3, "0")}`,
    course: "Soft Skills Accelerator",
    reason: `Reason ${index + 1}`,
    created_at: "2026-04-27T14:04:57.586273+00:00",
  }))

  const page = adminPageModule.paginateRegistrations(registrations, 2, 5)

  assert.equal(page.totalPages, 3)
  assert.equal(page.items.length, 5)
  assert.deepEqual(
    page.items.map((registration: { rowNumber: number; id: number }) => ({
      rowNumber: registration.rowNumber,
      id: registration.id,
    })),
    [
      { rowNumber: 6, id: 6 },
      { rowNumber: 7, id: 7 },
      { rowNumber: 8, id: 8 },
      { rowNumber: 9, id: 9 },
      { rowNumber: 10, id: 10 },
    ]
  )
})

test("getRegistrationCountry infers country metadata from phone number dial codes", async () => {
  const adminPageModule = await import("./registrations-table")

  assert.equal(typeof adminPageModule.getRegistrationCountry, "function")

  const country = adminPageModule.getRegistrationCountry("+237 677243603")

  assert.deepEqual(country, {
    country: "Cameroon",
    flag: "🇨🇲",
    value: "+237",
  })
})

test("filterRegistrations applies search, country, and date range filters together", async () => {
  const adminPageModule = await import("./registrations-table")

  assert.equal(typeof adminPageModule.filterRegistrations, "function")

  const registrations = [
    {
      id: 1,
      name: "Paul Otto",
      email: "paul@example.com",
      phone: "+237 677243603",
      course: "Soft Skills Accelerator",
      reason: "To improve my soft skills",
      created_at: "2026-04-27T14:04:57.586273+00:00",
    },
    {
      id: 2,
      name: "Claire Martin",
      email: "claire@example.com",
      phone: "+33 612345678",
      course: "Leadership Accelerator",
      reason: "To manage a team",
      created_at: "2026-04-24T09:15:00.000000+00:00",
    },
    {
      id: 3,
      name: "Amina Nfor",
      email: "amina@example.com",
      phone: "+237 683064881",
      course: "Soft Skills Accelerator",
      reason: "To grow as a leader",
      created_at: "2026-04-25T13:04:57.586273+00:00",
    },
  ]

  const filtered = adminPageModule.filterRegistrations(registrations, {
    course: "Soft Skills Accelerator",
    country: "Cameroon",
    from: "2026-04-25",
    query: "leader",
    to: "2026-04-27",
  })

  assert.deepEqual(
    filtered.map((registration: { id: number }) => registration.id),
    [3]
  )
})

test("buildCourseFilterOptions returns unique sorted course names", async () => {
  const adminPageModule = await import("./registrations-table")

  assert.equal(typeof adminPageModule.buildCourseFilterOptions, "function")

  const courseOptions = adminPageModule.buildCourseFilterOptions([
    {
      id: 1,
      name: "Paul Otto",
      email: "paul@example.com",
      phone: "+237 677243603",
      course: "Soft Skills Accelerator",
      reason: "To improve my soft skills",
      created_at: "2026-04-27T14:04:57.586273+00:00",
    },
    {
      id: 2,
      name: "Claire Martin",
      email: "claire@example.com",
      phone: "+33 612345678",
      course: "Leadership Accelerator",
      reason: "To manage a team",
      created_at: "2026-04-24T09:15:00.000000+00:00",
    },
    {
      id: 3,
      name: "Amina Nfor",
      email: "amina@example.com",
      phone: "+237 683064881",
      course: "Soft Skills Accelerator",
      reason: "To grow as a leader",
      created_at: "2026-04-25T13:04:57.586273+00:00",
    },
  ])

  assert.deepEqual(courseOptions, [
    "Leadership Accelerator",
    "Soft Skills Accelerator",
  ])
})

test("buildRegistrationsCsv serializes registrations into CSV with escaped values", async () => {
  const adminPageModule = await import("./registrations-table")

  assert.equal(typeof adminPageModule.buildRegistrationsCsv, "function")

  const csv = adminPageModule.buildRegistrationsCsv([
    {
      id: 1,
      name: 'Paul "P" Otto',
      email: "paul@example.com",
      phone: "+237 677243603",
      course: "Soft Skills Accelerator",
      reason: "Needs, stronger communication",
      created_at: "2026-04-27T14:04:57.586273+00:00",
    },
  ])

  assert.equal(
    csv,
    [
      '\uFEFFsep=,',
      '"Name","Email","Phone","Country","Course","Reason","Submitted"',
      '"Paul ""P"" Otto","paul@example.com","+237 677243603","Cameroon","Soft Skills Accelerator","Needs, stronger communication","2026-04-27T14:04:57.586273+00:00"',
    ].join("\r\n")
  )
})

test("RegistrationsTable renders numbering, nested email, copy buttons, and paged rows", async () => {
  const adminPageModule = await import("./registrations-table")

  assert.equal(typeof adminPageModule.RegistrationsTable, "function")

  const html = renderToStaticMarkup(
    <adminPageModule.RegistrationsTable
      registrations={[
        {
          id: 1,
          name: "Paul Otto",
          email: "paul@example.com",
          phone: "+237 677243603",
          course: "Soft Skills Accelerator",
          reason: "To improve my soft skills",
          created_at: "2026-04-27T14:04:57.586273+00:00",
        },
        {
          id: 2,
          name: "Amina Nfor",
          email: "amina@example.com",
          phone: "+237 683064881",
          course: "Leadership Accelerator",
          reason: "To grow as a leader",
          created_at: "2026-04-27T13:04:57.586273+00:00",
        },
      ]}
      currentPage={1}
      pageSize={1}
      copiedValue={null}
      onCopy={() => {}}
      onPageChange={() => {}}
    />
  )

  assert.match(html, />#<\/th>/)
  assert.doesNotMatch(html, />Email<\/th>/)
  assert.match(html, /🇨🇲/)
  assert.match(html, /Paul Otto/)
  assert.match(html, /paul@example\.com/)
  assert.match(html, /aria-label="Copy name Paul Otto"/)
  assert.match(html, /aria-label="Copy phone number \+237 677243603"/)
  assert.doesNotMatch(
    html,
    /aria-label="Copy (name Paul Otto|phone number \+237 677243603)" class="[^"]*rounded-full border border-\[#D9E1EE\] bg-white/
  )
  assert.match(html, />1<\/td>/)
  assert.doesNotMatch(html, /Amina Nfor/)
  assert.match(html, /Page 1 of 2/)
})