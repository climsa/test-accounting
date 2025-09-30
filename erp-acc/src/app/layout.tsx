import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import "./globals.css"
import { SidebarNav } from "@/components/layout/SidebarNav"
import { Topbar } from "@/components/layout/Topbar"
import { Toaster } from "@/components/ui/toaster"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "ERP Accounting Mock",
  description: "Mock ERP akuntansi dermatologi dengan Next.js",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="flex min-h-screen bg-muted/30">
          <div className="hidden border-r bg-sidebar lg:flex lg:w-64 lg:flex-shrink-0">
            <SidebarNav className="w-64" />
          </div>
          <div className="flex min-h-screen flex-1 flex-col">
            <Topbar />
            <main className="flex-1 space-y-4 bg-background p-4">
              <div className="mx-auto w-full max-w-7xl space-y-6">{children}</div>
            </main>
            <footer className="border-t bg-card px-4 py-3 text-xs text-muted-foreground">
              <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
                <span>ERP Accounting Mock • Data dummy • Sep 2025</span>
                <span>Dermatology Finance Team</span>
              </div>
            </footer>
          </div>
        </div>
        <Toaster />
      </body>
    </html>
  )
}
