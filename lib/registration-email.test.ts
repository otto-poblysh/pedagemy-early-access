import assert from "node:assert/strict"
import test from "node:test"

import {
  buildRegistrationConfirmationEmail,
  extractFirstName,
  normalizeEmailLocale,
} from "./registration-email"

test("normalizeEmailLocale supports en, fr, and es and falls back to en", () => {
  assert.equal(normalizeEmailLocale("en"), "en")
  assert.equal(normalizeEmailLocale("fr"), "fr")
  assert.equal(normalizeEmailLocale("es-MX"), "es")
  assert.equal(normalizeEmailLocale("de"), "en")
  assert.equal(normalizeEmailLocale(undefined), "en")
})

test("extractFirstName returns the first token from a validated full name", () => {
  assert.equal(extractFirstName("Grace Hopper"), "Grace")
  assert.equal(extractFirstName("  Jean   Dupont  "), "Jean")
})

test("buildRegistrationConfirmationEmail returns the approved English copy", () => {
  const email = buildRegistrationConfirmationEmail({
    fullName: "Grace Hopper",
    locale: "en",
    selectedProgramme: "Leadership Accelerator Program",
  })

  assert.equal(email.locale, "en")
  assert.equal(email.subject, "You're In! Pedagemy Raffle Entry Confirmed")
  assert.match(email.text, /^Hi Grace,/)
  assert.match(email.text, /You’re officially in!/) 
  assert.match(
    email.text,
    /Your Selected Programme:\nLeadership Accelerator Program/
  )
  assert.match(email.text, /info@pedagemy\.com/)
  assert.match(email.html, /Leadership Accelerator Program/)
})

test("buildRegistrationConfirmationEmail returns the approved French copy", () => {
  const email = buildRegistrationConfirmationEmail({
    fullName: "Marie Curie",
    locale: "fr",
    selectedProgramme: "Accélérateur de leadership",
  })

  assert.equal(email.locale, "fr")
  assert.equal(
    email.subject,
    "Votre participation est confirmée ! Tirage Pedagemy"
  )
  assert.match(email.text, /^Bonjour Marie,/)
  assert.match(
    email.text,
    /Le programme que vous avez sélectionné :\nAccélérateur de leadership/
  )
  assert.match(email.html, /Accélérateur de leadership/)
})

test("buildRegistrationConfirmationEmail returns the approved Spanish copy", () => {
  const email = buildRegistrationConfirmationEmail({
    fullName: "Ada Lovelace",
    locale: "es",
    selectedProgramme: "Acelerador de liderazgo",
  })

  assert.equal(email.locale, "es")
  assert.equal(
    email.subject,
    "¡Ya estás dentro! Tu participación en el sorteo de Pedagemy está confirmada"
  )
  assert.match(email.text, /^Hola Ada,/)
  assert.match(email.text, /Tu programa seleccionado:\nAcelerador de liderazgo/)
  assert.match(email.html, /Acelerador de liderazgo/)
})

test("buildRegistrationConfirmationEmail escapes user-provided values in html output", () => {
  const email = buildRegistrationConfirmationEmail({
    fullName: "Grace <script>alert(1)</script> Hopper",
    locale: "en",
    selectedProgramme: "Leadership <b>Accelerator</b>",
  })

  assert.doesNotMatch(email.html, /<script>/)
  assert.doesNotMatch(email.html, /<b>Accelerator<\/b>/)
  assert.match(email.html, /Leadership &lt;b&gt;Accelerator&lt;\/b&gt;/)
})