import assert from "node:assert/strict"
import test from "node:test"
import { renderToStaticMarkup } from "react-dom/server"

test("EmailPreviewPage renders the three localized confirmation email previews", async () => {
  const pageModule = await import("./page")

  assert.equal(typeof pageModule.default, "function")

  const html = renderToStaticMarkup(await pageModule.default())

  assert.match(html, /Registration Email Preview/)
  assert.match(html, /Preview only — no email is sent from this page\./)
  assert.match(html, /English/) 
  assert.match(html, /Français/)
  assert.match(html, /Español/)
  assert.match(html, /You&#x27;re In! Pedagemy Raffle Entry Confirmed/)
  assert.match(html, /Votre participation est confirmée ! Tirage Pedagemy/)
  assert.match(html, /¡Ya estás dentro! Tu participación en el sorteo de Pedagemy está confirmada/)
  assert.match(html, /Leadership Accelerator Program/)
  assert.match(html, /Accélérateur de leadership/)
  assert.match(html, /Acelerador de liderazgo/)
  assert.match(html, /Plain-text version/)
})