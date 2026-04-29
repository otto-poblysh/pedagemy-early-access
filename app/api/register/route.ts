import { NextResponse } from "next/server"
import { Resend } from "resend"
import { buildRegistrationConfirmationEmail } from "@/lib/registration-email"
import {
  DuplicateRegistrationError,
  getRaffleStore,
  MissingRegistrationsTableError,
  MissingStoreConfigError,
} from "@/lib/raffle-store"

class EmailDeliveryError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "EmailDeliveryError"
  }
}

class MissingEmailConfigError extends Error {
  constructor() {
    super("Missing required environment variable: RESEND_API_KEY")
    this.name = "MissingEmailConfigError"
  }
}

function getResendClient() {
  if (!process.env.RESEND_API_KEY) {
    throw new MissingEmailConfigError()
  }

  return new Resend(process.env.RESEND_API_KEY)
}

interface RegisterBody {
  acceptedLegal?: boolean
  course: string
  email: string
  name: string
  phone: string
  reason: string
  locale?: string
}

function isNonEmpty(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function hasAtLeastTwoNames(name: string) {
  return name.trim().split(/\s+/).filter(Boolean).length >= 2
}

const REGISTRATION_CONTACT_EMAIL = "info@pedagemy.com"
async function sendRegistrationEmail(body: RegisterBody) {
  const resend = getResendClient()

  const email = buildRegistrationConfirmationEmail({
    fullName: body.name,
    locale: body.locale,
    selectedProgramme: body.course,
  })

  const { data, error } = await resend.emails.send(
    {
      from: "Pedagemy <info@pedagemy.com>",
      to: [body.email],
      cc: [REGISTRATION_CONTACT_EMAIL],
      subject: email.subject,
      html: email.html,
      text: email.text,
    },
    { idempotencyKey: `registration-confirmation/${body.email}/${body.course}` }
  )

  if (error) {
    throw new EmailDeliveryError(error.message)
  }

  console.info("Registration confirmation email queued", {
    email: body.email,
    id: data?.id ?? null,
  })
}

export async function POST(request: Request) {
  let body: RegisterBody
  const raffleStore = getRaffleStore()

  try {
    body = (await request.json()) as RegisterBody
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  if (
    !isNonEmpty(body.name) ||
    !isNonEmpty(body.phone) ||
    !isNonEmpty(body.email) ||
    !isNonEmpty(body.course) ||
    !isNonEmpty(body.reason)
  ) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 }
    )
  }

  if (!isValidEmail(body.email)) {
    return NextResponse.json(
      { error: "Invalid email address" },
      { status: 400 }
    )
  }

  if (!hasAtLeastTwoNames(body.name)) {
    return NextResponse.json(
      { error: "Full name must include at least first and last name" },
      { status: 400 }
    )
  }

  if (body.acceptedLegal !== true) {
    return NextResponse.json(
      { error: "Terms and privacy policy acceptance is required" },
      { status: 400 }
    )
  }

  try {
    const savedRegistration = await raffleStore.saveRegistration(body)

    try {
      await sendRegistrationEmail(body)
    } catch (error) {
      await raffleStore.deleteRegistration(savedRegistration.email)
      throw error
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    if (error instanceof DuplicateRegistrationError) {
      return NextResponse.json(
        {
          code: "DUPLICATE_EMAIL",
          error: "An application with this email has already been submitted.",
        },
        { status: 409 }
      )
    }

    if (error instanceof MissingStoreConfigError) {
      console.error("Registration storage is not configured", error.message)
      return NextResponse.json(
        { error: "Registration storage is not configured" },
        { status: 500 }
      )
    }

    if (error instanceof MissingEmailConfigError) {
      console.error("Registration email is not configured", error.message)
      return NextResponse.json(
        {
          code: "EMAIL_NOT_CONFIGURED",
          error: "Confirmation email is not configured. Please try again later.",
        },
        { status: 500 }
      )
    }

    if (error instanceof EmailDeliveryError) {
      console.error("Failed to send confirmation email", error.message)
      return NextResponse.json(
        {
          code: "EMAIL_SEND_FAILED",
          error: "Confirmation email could not be sent. Please try again.",
        },
        { status: 502 }
      )
    }

    if (error instanceof MissingRegistrationsTableError) {
      console.error("Supabase registrations table is missing", error.message)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    console.error("Failed to process registration", error)
    return NextResponse.json(
      { error: "Failed to process registration" },
      { status: 500 }
    )
  }
}
