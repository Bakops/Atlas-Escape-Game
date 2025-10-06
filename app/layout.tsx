import type React from "react"
import type { Metadata } from "next"
import { Fredoka } from "next/font/google"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import ClientLayout from "./client-layout"

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-fredoka",
})

export const metadata: Metadata = {
  title: "Opération Atlas - Escape Game",
  description: "Explorez les continents et déjouez le plan du Cartographe Fantôme",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <body className={`font-sans ${fredoka.variable} ${GeistMono.variable}`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
