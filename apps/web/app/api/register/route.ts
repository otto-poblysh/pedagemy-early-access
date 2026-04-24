import { NextResponse } from "next/server"
import { Resend } from "resend"
import { getRaffleStore } from "@/lib/raffle-store"

const resend = new Resend(process.env.RESEND_API_KEY)

interface RegisterBody {
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

type EmailContent = {
  subject: string
  greeting: string
  confirmation: string
  timeline: string
  contactLabel: string
  contactEmail: string
  contactEnglishWhatsApp: string
  contactFrenchSpanishWhatsApp: string
  closing: string
  team: string
}

const emailContent: Record<string, EmailContent> = {
  en: {
    subject: "Application received — {{course}}",
    greeting: "Hi {{name}},",
    confirmation:
      "Your application for <strong>{{course}}</strong> has been received.",
    timeline:
      "We will reach out to you with updates on the selection process by <strong>Friday, May 15, 2026</strong>.",
    contactLabel: "If you have any questions before then, reach out to us:",
    contactEmail: "training@icubefarm.com",
    contactEnglishWhatsApp: "+237 683 064 880",
    contactFrenchSpanishWhatsApp: "+240 555 79 65 52",
    closing: "Best regards,",
    team: "The Pedagemy Team",
  },
  fr: {
    subject: "Candidature reçue — {{course}}",
    greeting: "Bonjour {{name}},",
    confirmation:
      "Votre candidature pour <strong>{{course}}</strong> a été reçue.",
    timeline:
      "Nous vous contacterons avec des mises à jour sur le processus de sélection avant le <strong>vendredi 15 mai 2026</strong>.",
    contactLabel: "Si vous avez des questions d'ici là, contactez-nous :",
    contactEmail: "training@icubefarm.com",
    contactEnglishWhatsApp: "+237 683 064 880",
    contactFrenchSpanishWhatsApp: "+240 555 79 65 52",
    closing: "Cordialement,",
    team: "L'équipe Pedagemy",
  },
  es: {
    subject: "Solicitud recibida — {{course}}",
    greeting: "Hola {{name}},",
    confirmation:
      "Tu solicitud para <strong>{{course}}</strong> ha sido recibida.",
    timeline:
      "Te contactaremos con actualizaciones sobre el proceso de selección antes del <strong>viernes 15 de mayo de 2026</strong>.",
    contactLabel:
      "Si tienes preguntas antes de entonces, comunícate con nosotros:",
    contactEmail: "training@icubefarm.com",
    contactEnglishWhatsApp: "+237 683 064 880",
    contactFrenchSpanishWhatsApp: "+240 555 79 65 52",
    closing: "Saludos cordiales,",
    team: "El equipo de Pedagemy",
  },
}

function buildEmailHtml(
  content: EmailContent,
  name: string,
  course: string
): string {
  return `
    <p>${content.greeting.replace("{{name}}", name)},</p>
    <p>${content.confirmation.replace("{{course}}", course)}</p>
    <p>${content.timeline}</p>
    <p>${content.contactLabel}</p>
    <ul>
      <li>Email: <a href="mailto:${content.contactEmail}">${content.contactEmail}</a></li>
      <li>WhatsApp (English): <a href="https://wa.me/237683064880">${content.contactEnglishWhatsApp}</a></li>
      <li>WhatsApp (French/Spanish): <a href="https://wa.me/240555796552">${content.contactFrenchSpanishWhatsApp}</a></li>
    </ul>
    <p>${content.closing}<br/>${content.team}</p>
  `
}

async function sendRegistrationEmail(
  body: RegisterBody,
  locale: string
) {
  const content = emailContent[locale] ?? emailContent["en"]!
  const subject = content.subject.replace("{{course}}", body.course)
  const html = buildEmailHtml(content, body.name, body.course)

  const { error } = await resend.emails.send(
    {
      from: "Pedagemy <onboarding@resend.dev>",
      to: [body.email],
      cc: ["training@icubefarm.com"],
      subject,
      html,
    },
    { idempotencyKey: `registration-confirmation/${body.email}/${body.course}` }
  )

  if (error) {
    console.error("Failed to send confirmation email:", error.message)
  }
}

export async function POST(request: Request) {
  let body: RegisterBody

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

  const locale =
    body.locale && ["en", "fr", "es"].includes(body.locale)
      ? body.locale
      : "en"

  try {
    getRaffleStore().saveRegistration({ ...body, locale })
    await sendRegistrationEmail(body, locale)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Failed to process registration", error)
    return NextResponse.json(
      { error: "Failed to process registration" },
      { status: 500 }
    )
  }
}
