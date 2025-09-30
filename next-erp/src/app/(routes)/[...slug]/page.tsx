"use client"

import { useEffect, useState } from 'react'
import { getModuleBySlug } from '@/data/menu'
import DataTable from '@/components/DataTable'
import ModuleForm from '@/components/ModuleForm'
import Modal from '@/components/Modal'

export default function ModulePage({ params }: { params: { slug: string[] } }) {
  const slug = params.slug || []
  const mod = getModuleBySlug(slug)
  const slugKey = slug.join('/')
  if (!mod) {
    return (
      <div className="content">
        <h1>Modul tidak ditemukan</h1>
        <p className="sub">Periksa URL atau pilih modul dari sidebar.</p>
      </div>
    )
  }
  const [open, setOpen] = useState(false)
  useEffect(()=>{ setOpen(false) }, [slugKey])
  return (
    <div className="content">
      <h1>{mod.breadcrumb}</h1>
      <div className="toolbar">
        {mod.actions?.map(a => (
          <button key={a} className="btn" disabled>{a}</button>
        ))}
        <button className="btn primary" onClick={()=>setOpen(true)}>Buka Form {mod.form.title}</button>
      </div>
      <div className="panel">
        <div className="panel-title">{mod.table.title}</div>
        <DataTable headers={mod.table.headers} rows={mod.table.rows} />
      </div>
      <Modal title={`Form ${mod.form.title}`} open={open} onClose={()=>setOpen(false)}>
        <ModuleForm schema={mod.form.schema} disabled />
      </Modal>
      {mod.notes && (
        <div className="panel">
          <div className="panel-title">Catatan</div>
          <div className="p-14 sub">{mod.notes}</div>
        </div>
      )}
    </div>
  )
}
