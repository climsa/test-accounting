type Props = {
  headers: string[]
  rows: (string | number | JSX.Element)[][]
}

export default function DataTable({ headers, rows }: Props){
  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>{headers.map((h,i)=>(<th key={i}>{h}</th>))}</tr>
        </thead>
        <tbody>
          {rows.map((r,ri)=> (
            <tr key={ri}>{r.map((c,ci)=>(<td key={ci}>{c}</td>))}</tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

