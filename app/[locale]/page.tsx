import type { Metadata } from "next"
import ComingSoonPage from "@/components/coming-soon-page"

const metadataByLocale: Record<string, { title: string; description: string }> = {
  en: {
    title: "Pedagemy — Coming Soon",
    description:
      "Pedagemy is a modern learning platform. Join the waitlist to be the first to know when we launch.",
  },
  es: {
    title: "Pedagemy — Próximamente",
    description:
      "Pedagemy es una plataforma de aprendizaje moderna. Únete a la lista de espera para ser el primero en saber cuándo lanzamos.",
  },
  fr: {
    title: "Pedagemy — Bientôt disponible",
    description:
      "Pedagemy est une plateforme d'apprentissage moderne. Rejoignez la liste d'attente pour être le premier informé de notre lancement.",
  },
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const meta = metadataByLocale[locale] ?? metadataByLocale.en!
  return {
    title: meta.title,
    description: meta.description,
  }
}

export default function LocalePage() {
  return <ComingSoonPage />
}
