import type { Metadata } from "next"
import { DM_Sans, Geist_Mono } from "next/font/google"
import Script from "next/script"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: {
    default: "Win Premium Learning Access — Worth up to $755.",
    template: "%s | Pedagemy",
  },
  description:
    "Most people wait for their employer to invest in them. This is your chance to get there first — fully sponsored, no cost to you.",
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
}

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, dmSans.variable)}
    >
      <body>
        <Script id="linkedin-insight-base" strategy="afterInteractive">
          {`window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
window._linkedin_data_partner_ids.push("9234436");`}
        </Script>
        <Script id="linkedin-insight-loader" strategy="afterInteractive">
          {`(function(l) {
if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
window.lintrk.q=[]}
var s = document.getElementsByTagName("script")[0];
var b = document.createElement("script");
b.type = "text/javascript";b.async = true;
b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
s.parentNode.insertBefore(b, s);})(window.lintrk);`}
        </Script>
        <ThemeProvider>{children}</ThemeProvider>
        <noscript>
          <img
            height="1"
            width="1"
            className="hidden"
            alt=""
            src="https://px.ads.linkedin.com/collect/?pid=9234436&fmt=gif"
          />
        </noscript>
      </body>
    </html>
  )
}
