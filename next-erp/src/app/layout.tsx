import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@/components/Sidebar'

export const metadata: Metadata = {
  title: 'ERP Akuntansi Mock',
  description: 'Mock ERP Akuntansi berbasis Next.js dengan data dummy',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <div className="app">
          <Sidebar />
          <main className="main">
            <header className="topbar">
              <div className="brand">ERP Akuntansi</div>
              <div className="actions">
                <input type="search" placeholder="Cari..." className="search" />
                <span className="user">👤 Admin</span>
              </div>
            </header>
            <section className="view">{children}</section>
            <footer className="footer">Mock ERP • Data dummy • Next.js</footer>
          </main>
        </div>
      </body>
    </html>
  )
}

