import { notFound } from 'next/navigation'
import { getModuleBySlug } from '@/data/menu'
import DataTable from '@/components/DataTable'
import ModuleForm from '@/components/ModuleForm'

export default function ModulePage({ params }: { params: { slug: string[] } }) {
  const slug = params.slug || []
  const mod = getModuleBySlug(slug)
  if (!mod) return notFound()
  return (
    <div className="content">
      <h1>{mod.breadcrumb}</h1>
      <div className="toolbar">
        {mod.actions?.map(a => (
          <button key={a} className="btn" disabled>{a}</button>
        ))}
      </div>
      <div className="grid2">
        <div className="panel">
          <div className="panel-title">{mod.table.title}</div>
          <DataTable headers={mod.table.headers} rows={mod.table.rows} />
        </div>
        <div className="panel">
          <div className="panel-title">Form {mod.form.title}</div>
          <ModuleForm schema={mod.form.schema} disabled />
        </div>
      </div>
      {mod.notes && (
        <div className="panel">
          <div className="panel-title">Catatan</div>
          <div className="p-14 sub">{mod.notes}</div>
        </div>
      )}
    </div>
  )
}

