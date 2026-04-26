import type { Metadata } from "next"

import PedagemyEarlyAccessLandingPage from "@/components/landing-page"

const metadataByLocale: Record<string, { title: string; description: string }> = {
  en: {
    title: "Win Premium Learning Access — Worth up to $755.",
    description:
      "Most people wait for their employer to invest in them. This is your chance to get there first — fully sponsored, no cost to you.",
  },
  es: {
    title: "Gana acceso a formación premium — hasta $755 de valor.",
    description:
      "La mayoría espera a que su empleador invierta en ellos. Esta es tu oportunidad de llegar primero — totalmente patrocinada, sin costo para ti.",
  },
  fr: {
    title: "Gagnez un accès à une formation premium — d'une valeur allant jusqu'à 755 $.",
    description:
      "La plupart attendent que leur employeur investisse en eux. C'est votre chance d'arriver en premier — entièrement financée, sans frais pour vous.",
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
  return <PedagemyEarlyAccessLandingPage />
}
