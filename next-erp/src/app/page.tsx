import Link from 'next/link'
import { groups } from '@/data/menu'

export default function Home() {
  return (
    <div className="content">
      <h1>Dasbor</h1>
      <div className="cards">
        <div className="card"><div className="label">Pendapatan Bulan Ini</div><div className="value">Rp 320.000.000</div></div>
        <div className="card"><div className="label">Pengeluaran Bulan Ini</div><div className="value">Rp 85.000.000</div></div>
        <div className="card"><div className="label">Laba/Rugi Bulan Ini</div><div className="value">Rp 235.000.000</div></div>
        <div className="card"><div className="label">Saldo Kas</div><div className="value">Rp 150.000.000</div></div>
      </div>

      <div className="panel">
        <div className="panel-title">Navigasi Cepat</div>
        <div className="grid2 p-14">
          {groups.map(g => (
            <div key={g.key} className="quick">
              <div className="quick-title">{g.title}</div>
              <div className="quick-links">
                {g.items.map(i => (
                  <Link key={i.key} className="chip" href={`/${g.key}/${i.key}`}>{i.title}</Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

