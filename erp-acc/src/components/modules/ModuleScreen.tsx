"use client"

import * as React from "react"

import { Toolbar } from "@/components/ui/Toolbar"
import { DataTable, type Column } from "@/components/ui/DataTable"
import { Button } from "@/components/ui/button"
import { DetailDrawer } from "@/components/ui/DetailDrawer"
import { EditDialog } from "@/components/ui/EditDialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"

import { cn } from "@/lib/utils"

export type FieldType = "text" | "number" | "date" | "select" | "textarea"

export type FieldConfig = {
  name: string
  label: string
  type?: FieldType
  options?: string[]
  placeholder?: string
  defaultValue?: string | number
}

// Serializable column config
export type SerializableColumn<T extends Record<string, unknown>> = {
  key: keyof T | string
  header: string
  align?: "left" | "center" | "right"
  renderType?: "currency" | "status" | "percentage" | "array"
}

export type DetailField<T extends Record<string, unknown>> = {
  name: keyof T
  label: string
  formatType?: "currency" | "percentage" | "array"
}

export type RowAction = {
  label: string
  intent?: "view" | "edit" | "mock"
  message?: string
  variant?: "default" | "outline" | "secondary" | "destructive"
}

type FormValues = Record<string, unknown>

export type ModuleConfig<T extends Record<string, unknown>> = {
  title: string
  description?: string
  data: T[]
  columns: SerializableColumn<T>[]
  detailFields: DetailField<T>[]
  form: {
    title: string
    fields: FieldConfig[]
    validateType?: "balanceDebitCredit"
  }
  rowActions: RowAction[]
  periodOptions?: string[]
  searchPlaceholder?: string
}

type Mode = "create" | "edit"

export function ModuleScreen<T extends Record<string, unknown>>({ config }: { config: ModuleConfig<T> }) {
  const [rows, setRows] = React.useState<T[]>(config.data)
  const [search, setSearch] = React.useState("")
  const [period, setPeriod] = React.useState(config.periodOptions?.[0] ?? "")
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [mode, setMode] = React.useState<Mode>("create")
  const [activeRow, setActiveRow] = React.useState<T | null>(null)
  const [formValues, setFormValues] = React.useState<FormValues>(() => buildInitialValues(config.form.fields))

  // Convert serializable columns to renderable columns
  const columns: Column<T>[] = React.useMemo(() => 
    config.columns.map(col => ({
      key: col.key,
      header: col.header,
      align: col.align,
      render: col.renderType ? (row: T) => {
        const value = row[col.key as keyof T]
        switch (col.renderType) {
          case "currency":
            return currency(value)
          case "status":
            return statusBadge(String(value ?? ""))
          case "percentage":
            return `${Number(value) * 100}%`
          case "array":
            return Array.isArray(value) ? value.join(", ") : String(value ?? "")
          default:
            return value as React.ReactNode
        }
      } : undefined
    })),
  [config.columns])

  const filteredRows = React.useMemo(() => {
    if (!search) return rows
    const term = search.toLowerCase()
    return rows.filter((row) =>
      Object.values(row).some((value) => String(value).toLowerCase().includes(term))
    )
  }, [rows, search])

  const openCreate = () => {
    setMode("create")
    setActiveRow(null)
    setFormValues(buildInitialValues(config.form.fields))
    setDialogOpen(true)
  }

  const handleSubmit = () => {
    // Validate based on validateType
    if (config.form.validateType === "balanceDebitCredit") {
      const debit = Number(formValues.debit ?? 0)
      const credit = Number(formValues.credit ?? 0)
      if (debit !== credit) {
        toast({ title: "Validasi", description: "Debit dan kredit harus seimbang.", variant: "destructive" })
        return
      }
    }
    
    // Map form values to row (simple merge)
    const mapped = { ...activeRow, ...formValues } as T
    setRows((prev) => {
      if (mode === "edit" && activeRow) {
        return prev.map((row) => (row === activeRow ? mapped : row))
      }
      return [mapped, ...prev]
    })
    toast({
      title: mode === "edit" ? "Data diperbarui" : "Data dibuat",
      description: "Perubahan tersimpan di state lokal (mock).",
    })
    setDialogOpen(false)
  }

  const handleAction = (action: RowAction, row: T) => {
    switch (action.intent) {
      case "view":
        setActiveRow(row)
        setDrawerOpen(true)
        break
      case "edit":
        setMode("edit")
        setActiveRow(row)
        setFormValues(buildValuesFromRow(config.form.fields, row))
        setDialogOpen(true)
        break
      default:
        toast({ title: action.label, description: action.message ?? "Aksi mock dijalankan." })
    }
  }

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">{config.title}</h1>
        {config.description ? <p className="text-sm text-muted-foreground">{config.description}</p> : null}
      </header>

      <Toolbar
        search={{ value: search, onChange: setSearch, placeholder: config.searchPlaceholder ?? "Cari data..." }}
        period={
          config.periodOptions
            ? { value: period, onChange: setPeriod, options: config.periodOptions }
            : undefined
        }
        actions={
          <Button size="sm" onClick={openCreate}>
            Tambah Data
          </Button>
        }
      />

      <div className="rounded-xl border bg-card p-4 shadow-sm">
        <DataTable
          data={filteredRows}
          columns={[...columns, buildActionColumn(config.rowActions, handleAction)]}
        />
      </div>

      <DetailDrawer
        title={activeRow ? `Detail ${config.title}` : config.title}
        description={activeRow ? String(activeRow[config.columns[0].key as keyof T] ?? "") : undefined}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      >
        {activeRow ? (
          <div className="grid gap-3">
            {config.detailFields.map((field) => (
              <div key={String(field.name)} className="grid gap-1">
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {field.label}
                </span>
                <span className="text-sm">
                  {field.formatType
                    ? formatByType(activeRow[field.name], field.formatType)
                    : formatValue(activeRow[field.name])}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Pilih baris untuk melihat detail.</p>
        )}
      </DetailDrawer>

      <EditDialog
        title={mode === "edit" ? `Ubah ${config.title}` : `Tambah ${config.title}`}
        description="Submit hanya menyimpan ke state lokal (mock)."
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
      >
        <div className="grid gap-4">
          {config.form.fields.map((field) => (
            <FormField
              key={field.name}
              field={field}
              value={formValues[field.name] ?? ""}
              onChange={(value) =>
                setFormValues((prev) => ({
                  ...prev,
                  [field.name]: value,
                }))
              }
            />
          ))}
        </div>
      </EditDialog>
    </section>
  )
}

function buildActionColumn<T extends Record<string, unknown>>(
  actions: RowAction[],
  handler: (action: RowAction, row: T) => void
): Column<T> {
  return {
    key: "__actions",
    header: "Aksi",
    render: (row) => (
      <div className="flex flex-wrap gap-2">
        {actions.map((action) => (
          <Button
            key={action.label}
            size="sm"
            variant={action.variant ?? "outline"}
            onClick={() => handler(action, row)}
          >
            {action.label}
          </Button>
        ))}
      </div>
    ),
  }
}

function buildInitialValues(fields: FieldConfig[]) {
  return fields.reduce<FormValues>((acc, field) => {
    acc[field.name] = field.defaultValue ?? ""
    return acc
  }, {})
}

function buildValuesFromRow<T extends Record<string, unknown>>(fields: FieldConfig[], row: T) {
  return fields.reduce<FormValues>((acc, field) => {
    acc[field.name] = row[field.name as keyof T] ?? ""
    return acc
  }, {})
}

const currency = (value: unknown) =>
  typeof value === "number"
    ? value.toLocaleString("id-ID", { minimumFractionDigits: 0 })
    : String(value ?? "")

function formatByType(value: unknown, formatType: "currency" | "percentage" | "array"): React.ReactNode {
  switch (formatType) {
    case "currency":
      return currency(value)
    case "percentage":
      return `${Number(value) * 100}%`
    case "array":
      if (Array.isArray(value)) {
        if (value.length > 0 && typeof value[0] === "object" && value[0] !== null && "description" in value[0]) {
          return value.map((item: { description?: string; amount?: number }) => `${item.description}: ${currency(item.amount)}`).join("; ")
        }
        return value.join(", ")
      }
      return String(value ?? "")
    default:
      return value as React.ReactNode
  }
}

function formatValue(value: unknown) {
  if (value instanceof Date) return value.toLocaleDateString("id-ID")
  if (typeof value === "number") return value.toLocaleString("id-ID")
  if (typeof value === "boolean") return value ? "Ya" : "Tidak"
  if (Array.isArray(value)) return value.join(", ")
  return value as React.ReactNode
}

function FormField({
  field,
  value,
  onChange,
}: {
  field: FieldConfig
  value: unknown
  onChange: (value: unknown) => void
}) {
  const { label, type = "text", options, placeholder } = field

  if (type === "textarea") {
    return (
      <label className="grid gap-2 text-sm">
        <span className="font-medium text-muted-foreground">{label}</span>
        <Textarea value={String(value ?? "")} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
      </label>
    )
  }

  if (type === "select") {
    return (
      <label className="grid gap-2 text-sm">
        <span className="font-medium text-muted-foreground">{label}</span>
        <Select value={String(value ?? "")} onValueChange={(val) => onChange(val)}>
          <SelectTrigger>
            <SelectValue placeholder={placeholder ?? `Pilih ${label}`} />
          </SelectTrigger>
          <SelectContent>
            {(options ?? []).map((option) => (
              <SelectItem value={option} key={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </label>
    )
  }

  return (
    <label className="grid gap-2 text-sm">
      <span className="font-medium text-muted-foreground">{label}</span>
      <Input
        type={type}
        value={typeof value === "number" || typeof value === "string" ? value : ""}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </label>
  )
}

export function statusBadge(value: string) {
  const normalized = value.toLowerCase()
  const variant = normalized.includes("overdue") || normalized.includes("void")
    ? "destructive"
    : normalized.includes("posted") || normalized.includes("approved") || normalized.includes("paid")
    ? "default"
    : "secondary"
  return <Badge className={cn(variant === "secondary" && "bg-muted text-foreground")}>{value}</Badge>
}
