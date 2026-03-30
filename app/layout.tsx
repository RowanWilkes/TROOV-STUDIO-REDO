import type React from "react"
import type { Metadata } from "next"
import { DM_Serif_Display, Plus_Jakarta_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "sonner"
import { PreferencesProvider } from "@/components/PreferencesProvider"
import { SupabaseConnectionProvider } from "@/components/SupabaseConnectionProvider"
import { SupabaseConnectionBanner } from "@/components/SupabaseConnectionBanner"
import "./globals.css"

const dmSerifDisplay = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
})

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Troov Studio — The Project Planner Built for Web Designers",
  description: "Plan, brief, and deliver web design projects faster. Troov Studio gives you mood boards, style guides, sitemaps, technical specs and a one-click PDF summary — all in one place. Free to start.",
  keywords: "web design project management, design brief tool, mood board, style guide, sitemap builder, web designer tools",
  applicationName: "Troov Studio",
  alternates: {
    canonical: "https://troovstudio.com",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "Troov Studio — The Project Planner Built for Web Designers",
    description: "Plan, brief, and deliver web design projects faster. Everything from mood boards to PDF summaries in one place.",
    url: "https://troovstudio.com",
    siteName: "Troov Studio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Troov Studio — The Project Planner Built for Web Designers",
    description: "Plan, brief, and deliver web design projects faster. Everything from mood boards to PDF summaries in one place.",
  },
  metadataBase: new URL("https://troovstudio.com"),
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${dmSerifDisplay.variable} ${plusJakartaSans.variable}`}>
      <body className="font-sans antialiased">
        <SupabaseConnectionProvider>
          <SupabaseConnectionBanner />
          <PreferencesProvider>
            {children}
          </PreferencesProvider>
        </SupabaseConnectionProvider>
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
