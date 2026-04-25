import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const LOCALES = ["en", "fr", "es"] as const
const DEFAULT_LOCALE = "en"

function getLocale(request: NextRequest): string {
  const pathname = request.nextUrl.pathname
  const segments = pathname.split("/")
  const maybeLocale = segments[1]
  if (
    maybeLocale &&
    LOCALES.includes(maybeLocale as (typeof LOCALES)[number])
  ) {
    return maybeLocale
  }

  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value
  if (
    cookieLocale &&
    LOCALES.includes(cookieLocale as (typeof LOCALES)[number])
  ) {
    return cookieLocale
  }

  const acceptLanguage = request.headers.get("Accept-Language") ?? ""
  const preferred = acceptLanguage.split(",")[0]?.split("-")[0]?.toLowerCase()
  if (preferred && LOCALES.includes(preferred as (typeof LOCALES)[number])) {
    return preferred
  }

  return DEFAULT_LOCALE
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/locales") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next()
  }

  const pathnameHasLocale = LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) {
    return NextResponse.next()
  }

  const locale = getLocale(request)
  const newUrl = request.nextUrl.clone()
  newUrl.pathname = `/${locale}${pathname === "/" ? "" : pathname}`

  const response = NextResponse.redirect(newUrl)
  response.cookies.set("NEXT_LOCALE", locale, {
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
  })

  return response
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
}
