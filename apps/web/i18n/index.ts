import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import Backend from "i18next-http-backend"
import fs from "fs"
import path from "path"

const resources = {} as Record<string, Record<string, Record<string, unknown>>>
for (const lng of ["en", "fr", "es"]) {
  const filePath = path.join(
    process.cwd(),
    "public",
    "locales",
    lng,
    "translation.json"
  )
  try {
    resources[lng] = { translation: JSON.parse(fs.readFileSync(filePath, "utf8")) }
  } catch {
  }
}

i18n
  .use(Backend)
  .use(initReactI18next).init({
    resources,
    fallbackLng: "en",
    debug: false,
    supportedLngs: ["en", "fr", "es"],
    ns: ["translation"],
    defaultNS: "translation",
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },
    interpolation: {
      escapeValue: false,
    },
  } as Parameters<typeof i18n.init>[0])

export default i18n
