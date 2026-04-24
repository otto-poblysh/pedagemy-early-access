import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import Backend from "i18next-http-backend"

if (!i18n.isInitialized) {
  i18n
    .use(Backend)
    .use(initReactI18next)
    .init({
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
}

export default i18n
