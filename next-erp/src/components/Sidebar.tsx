"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { groups } from '@/data/menu'

export default function Sidebar(){
  const pathname = usePathname()
  return (
    <aside className="sidebar">
      <div className="brand-row"><span className="logo">💼</span><span className="name">ERP</span></div>
      <nav className="menu">
        <Link href="/" className={`item ${pathname==='/'?'active':''}`}>📊 Dasbor</Link>
        {groups.map(g => (
          <div key={g.key} className="group">
            <div className="menu-label">{g.title}</div>
            {g.items.map(i => {
              const href = `/${g.key}/${i.key}`
              const active = pathname.startsWith(href)
              return <Link key={i.key} href={href} className={`item ${active?'active':''}`}>{i.icon} {i.title}</Link>
            })}
          </div>
        ))}
      </nav>
    </aside>
  )
}

