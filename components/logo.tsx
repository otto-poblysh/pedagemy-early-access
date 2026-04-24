import Image from "next/image"

export function PedagemyLogo({ light = false }: { light?: boolean }) {
  return (
    <div aria-label="Pedagemy">
      <Image
        src="/pedagemy-logo.png"
        alt="Pedagemy"
        width={154}
        height={32}
        className={`h-8 w-auto object-contain ${light ? "brightness-0 invert" : ""}`}
        style={light ? { filter: "brightness(0) invert(1)" } : undefined}
      />
    </div>
  )
}
