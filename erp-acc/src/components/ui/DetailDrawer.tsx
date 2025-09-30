"use client"

import * as React from "react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

interface DetailDrawerProps {
  title: React.ReactNode
  description?: React.ReactNode
  open: boolean
  onOpenChange: (open: boolean) => void
  side?: "right" | "left"
  children: React.ReactNode
}

export function DetailDrawer({
  title,
  description,
  open,
  onOpenChange,
  side = "right",
  children,
}: DetailDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side={side} className="flex w-full flex-col gap-4 overflow-y-auto sm:max-w-xl">
        <SheetHeader className="border-b pb-3">
          <SheetTitle>{title}</SheetTitle>
          {description ? <SheetDescription>{description}</SheetDescription> : null}
        </SheetHeader>
        <div className="flex-1 space-y-4 pb-8 text-sm leading-relaxed">{children}</div>
      </SheetContent>
    </Sheet>
  )
}
