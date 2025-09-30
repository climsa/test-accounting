"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"

export type Column<T extends Record<string, unknown>> = {
  key: keyof T | string
  header: React.ReactNode
  className?: string
  render?: (row: T) => React.ReactNode
  align?: "left" | "center" | "right"
}

interface DataTableProps<T extends Record<string, unknown>> {
  columns: Column<T>[]
  data: T[]
  pageSize?: number
  className?: string
  emptyMessage?: React.ReactNode
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  pageSize = 10,
  className,
  emptyMessage = "Tidak ada data",
}: DataTableProps<T>) {
  const [page, setPage] = React.useState(0)
  const pageCount = Math.max(1, Math.ceil(data.length / pageSize))

  const start = page * pageSize
  const end = start + pageSize
  const pageRows = data.slice(start, end)

  React.useEffect(() => {
    if (page >= pageCount) {
      setPage(pageCount - 1)
    }
  }, [page, pageCount])

  return (
    <div className={cn("space-y-3", className)}>
      <div className="overflow-x-auto rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col, idx) => (
                <TableHead
                  key={idx}
                  className={cn(
                    col.className,
                    col.align === "right" && "text-right",
                    col.align === "center" && "text-center"
                  )}
                >
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center text-muted-foreground">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              pageRows.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((col, colIndex) => (
                    <TableCell
                      key={colIndex}
                      className={cn(
                        col.className,
                        col.align === "right" && "text-right",
                        col.align === "center" && "text-center"
                      )}
                    >
                      {col.render ? col.render(row) : renderValue(row, col.key)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div>
          Menampilkan {pageRows.length === 0 ? 0 : start + 1}–{Math.min(end, data.length)} dari {data.length}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
          >
            Sebelumnya
          </Button>
          <span>
            Halaman {pageCount === 0 ? 0 : page + 1} / {pageCount}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page + 1 >= pageCount}
            onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
          >
            Berikutnya
          </Button>
        </div>
      </div>
    </div>
  )
}

function renderValue<T extends Record<string, unknown>>(row: T, key: keyof T | string) {
  if (typeof key === "string" && !(key in row)) {
    return null
  }
  const value = row[key as keyof T]
  if (typeof value === "number") {
    return value.toLocaleString("id-ID")
  }
  return (value as React.ReactNode) ?? null
}
