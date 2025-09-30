"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { CalendarIcon, FilterIcon } from "lucide-react"

interface PeriodFilter {
  value: string
  onChange: (value: string) => void
  options: string[]
  label?: string
}

interface ToolbarProps {
  className?: string
  search?: {
    value: string
    onChange: (value: string) => void
    placeholder?: string
  }
  period?: PeriodFilter
  actions?: React.ReactNode
  filters?: React.ReactNode
  extra?: React.ReactNode
}

export function Toolbar({ className, search, period, actions, filters, extra }: ToolbarProps) {
  return (
    <div className={cn("flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-card p-4", className)}>
      <div className="flex flex-1 flex-wrap items-center gap-3">
        {search && (
          <Input
            value={search.value}
            onChange={(event) => search.onChange(event.target.value)}
            placeholder={search.placeholder ?? "Cari..."}
            className="w-full min-w-[220px] max-w-[280px]"
          />
        )}
        {period && (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="pointer-events-none">
              <CalendarIcon className="h-4 w-4" />
            </Button>
            <Select value={period.value} onValueChange={period.onChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Pilih Periode" />
              </SelectTrigger>
              <SelectContent>
                {period.options.map((option) => (
                  <SelectItem value={option} key={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        {filters ? (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon">
              <FilterIcon className="h-4 w-4" />
            </Button>
            {filters}
          </div>
        ) : null}
        {extra}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}

