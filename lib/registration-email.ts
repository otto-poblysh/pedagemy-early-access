export type SupportedEmailLocale = "en" | "fr" | "es"

type RegistrationConfirmationEmailInput = {
  fullName: string
  locale?: string
  selectedProgramme: string
}

type RegistrationConfirmationEmail = {
  html: string
  locale: SupportedEmailLocale
  subject: string
  text: string
}

type EmailCopy = {
  subject: string
  salutation: string
  headline: string
  thanks: string
  nextStepsLabel: string
  nextSteps: readonly [string, string, string]
  selectedProgrammeLabel: string
  benefit: string
  reminder: string
  questions: string
  closing: string
  team: string
  inquiriesLabel: string
  whatsappEnglishLabel: string
  whatsappFrenchSpanishLabel: string
}

const CONTACT_EMAIL = "info@pedagemy.com"
const WHATSAPP_ENGLISH = "+237 683 064 880"
const WHATSAPP_FRENCH_SPANISH = "+240 555 79 65 52"

const copyByLocale: Record<SupportedEmailLocale, EmailCopy> = {
  en: {
    subject: "You're In! Pedagemy Raffle Entry Confirmed",
    salutation: "Hi",
    headline: "You’re officially in!",
    thanks:
      "Thank you for entering the Pedagemy Raffle Draw. Your submission has been successfully received.",
    nextStepsLabel: "Here’s what happens next:",
    nextSteps: [
      "You’ve been entered into the raffle",
      "Your preferred course selection has been noted",
      "Winners will be selected and contacted after May 15, 2026",
    ],
    selectedProgrammeLabel: "Your Selected Programme:",
    benefit:
      "If selected, you’ll gain free access to a premium learning program curated by iCUBEFARM designed to help you build skills that matter in today’s job market.",
    reminder:
      "In the meantime, stay connected and keep an eye on your email; you won’t want to miss this.",
    questions: "If you have any questions, feel free to reach out.",
    closing: "Best regards,",
    team: "The Pedagemy Team",
    inquiriesLabel: "For inquiries, reach out to",
    whatsappEnglishLabel: "WhatsApp (English)",
    whatsappFrenchSpanishLabel: "WhatsApp (French/Spanish)",
  },
  fr: {
    subject: "Votre participation est confirmée ! Tirage Pedagemy",
    salutation: "Bonjour",
    headline: "Votre participation est bien confirmée !",
    thanks:
      "Merci d’avoir participé au tirage Pedagemy. Votre candidature a bien été reçue.",
    nextStepsLabel: "Voici la suite :",
    nextSteps: [
      "Votre participation au tirage a bien été enregistrée",
      "Le programme que vous avez choisi a bien été pris en compte",
      "Les gagnants seront sélectionnés et contactés après le 15 mai 2026",
    ],
    selectedProgrammeLabel: "Le programme que vous avez sélectionné :",
    benefit:
      "Si vous êtes sélectionné(e), vous bénéficierez d’un accès gratuit à un programme de formation premium conçu par iCUBEFARM pour vous aider à développer les compétences qui comptent sur le marché du travail actuel.",
    reminder:
      "D’ici là, restez connecté(e) et gardez un œil sur votre boîte mail : vous ne voudriez pas manquer cela.",
    questions: "Si vous avez des questions, n’hésitez pas à nous contacter.",
    closing: "Cordialement,",
    team: "L’équipe Pedagemy",
    inquiriesLabel: "Pour toute question, contactez-nous à",
    whatsappEnglishLabel: "WhatsApp (anglais)",
    whatsappFrenchSpanishLabel: "WhatsApp (français/espagnol)",
  },
  es: {
    subject:
      "¡Ya estás dentro! Tu participación en el sorteo de Pedagemy está confirmada",
    salutation: "Hola",
    headline: "¡Tu participación ya quedó confirmada!",
    thanks:
      "Gracias por participar en el sorteo de Pedagemy. Hemos recibido tu solicitud correctamente.",
    nextStepsLabel: "Esto es lo que sigue:",
    nextSteps: [
      "Tu participación en el sorteo ya quedó registrada",
      "Tu curso preferido ha sido tomado en cuenta",
      "Las personas ganadoras serán seleccionadas y contactadas después del 15 de mayo de 2026",
    ],
    selectedProgrammeLabel: "Tu programa seleccionado:",
    benefit:
      "Si resultas seleccionado(a), obtendrás acceso gratuito a un programa premium de aprendizaje curado por iCUBEFARM para ayudarte a desarrollar habilidades que realmente importan en el mercado laboral actual.",
    reminder:
      "Mientras tanto, mantente al tanto y revisa tu correo con atención; no querrás perderte esto.",
    questions: "Si tienes alguna pregunta, no dudes en escribirnos.",
    closing: "Saludos cordiales,",
    team: "El equipo de Pedagemy",
    inquiriesLabel: "Para consultas, escríbenos a",
    whatsappEnglishLabel: "WhatsApp (inglés)",
    whatsappFrenchSpanishLabel: "WhatsApp (francés/español)",
  },
}

export function normalizeEmailLocale(locale?: string): SupportedEmailLocale {
  const baseLocale = locale?.trim().toLowerCase().split("-")[0]

  if (baseLocale === "fr" || baseLocale === "es") {
    return baseLocale
  }

  return "en"
}

export function extractFirstName(fullName: string) {
  return fullName.trim().split(/\s+/).filter(Boolean)[0] ?? "there"
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}

export function buildRegistrationConfirmationEmail({
  fullName,
  locale,
  selectedProgramme,
}: RegistrationConfirmationEmailInput): RegistrationConfirmationEmail {
  const normalizedLocale = normalizeEmailLocale(locale)
  const copy = copyByLocale[normalizedLocale]
  const firstName = extractFirstName(fullName)
  const safeFirstName = escapeHtml(firstName)
  const trimmedProgramme = selectedProgramme.trim()
  const safeSelectedProgramme = escapeHtml(trimmedProgramme)

  const text = [
    `${copy.salutation} ${firstName},`,
    copy.headline,
    copy.thanks,
    "",
    copy.nextStepsLabel,
    ...copy.nextSteps.map((step) => `- ${step}`),
    "",
    copy.selectedProgrammeLabel,
    trimmedProgramme,
    "",
    copy.benefit,
    copy.reminder,
    copy.questions,
    "",
    copy.closing,
    copy.team,
    "",
    copy.inquiriesLabel,
    CONTACT_EMAIL,
    `${copy.whatsappEnglishLabel}: ${WHATSAPP_ENGLISH}`,
    `${copy.whatsappFrenchSpanishLabel}: ${WHATSAPP_FRENCH_SPANISH}`,
  ].join("\n")

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1A1A2E">
      <p>${copy.salutation} ${safeFirstName},</p>
      <p><strong>${copy.headline}</strong></p>
      <p>${copy.thanks}</p>
      <p>${copy.nextStepsLabel}</p>
      <ul>
        ${copy.nextSteps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}
      </ul>
      <p><strong>${copy.selectedProgrammeLabel}</strong><br/>${safeSelectedProgramme}</p>
      <p>${copy.benefit}</p>
      <p>${copy.reminder}</p>
      <p>${copy.questions}</p>
      <p>${copy.closing}<br/>${copy.team}</p>
      <p>${copy.inquiriesLabel}<br/>
        <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a><br/>
        ${copy.whatsappEnglishLabel}: <a href="https://wa.me/237683064880">${WHATSAPP_ENGLISH}</a><br/>
        ${copy.whatsappFrenchSpanishLabel}: <a href="https://wa.me/240555796552">${WHATSAPP_FRENCH_SPANISH}</a>
      </p>
    </div>
  `.trim()

  return {
    html,
    locale: normalizedLocale,
    subject: copy.subject,
    text,
  }
}