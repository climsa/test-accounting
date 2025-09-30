"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface EditDialogProps {
  title: React.ReactNode
  description?: React.ReactNode
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit?: () => void
  isSaving?: boolean
  children: React.ReactNode
  submitLabel?: string
}

export function EditDialog({
  title,
  description,
  open,
  onOpenChange,
  onSubmit,
  isSaving,
  children,
  submitLabel = "Simpan",
}: EditDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? <DialogDescription>{description}</DialogDescription> : null}
        </DialogHeader>
        <div className="space-y-4 py-2">{children}</div>
        {onSubmit ? (
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
              Batal
            </Button>
            <Button onClick={onSubmit} disabled={isSaving}>
              {isSaving ? "Menyimpan..." : submitLabel}
            </Button>
          </DialogFooter>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

