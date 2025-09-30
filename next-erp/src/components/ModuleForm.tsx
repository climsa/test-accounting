type Field = { label: string; type?: 'text'|'number'|'date'|'select'|'textarea'; options?: string[] }
type Props = { schema: Field[]; disabled?: boolean }

export default function ModuleForm({ schema, disabled }: Props){
  return (
    <form className="form grid2 p-14">
      {schema.map((f, i)=> (
        <div className="form-group" key={i}>
          <label>{f.label}</label>
          {f.type === 'textarea' ? (
            <textarea rows={3} disabled={disabled} />
          ) : f.type === 'select' ? (
            <select disabled={disabled}>{f.options?.map(o=> <option key={o}>{o}</option>)}</select>
          ) : (
            <input type={f.type || 'text'} disabled={disabled} />
          )}
        </div>
      ))}
      <div className="col-span-2" style={{gridColumn:'1 / -1'}}>
        <button className="btn" disabled>Simpan (Mock)</button>
      </div>
    </form>
  )
}

