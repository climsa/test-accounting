"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Search } from "lucide-react"
import { SidebarNav } from "./SidebarNav"

export function Topbar() {
  const pathname = usePathname()
  const crumbs = React.useMemo(() => {
    if (pathname === "/" || pathname === "") return []
    const segments = pathname.split("/").filter(Boolean)
    const paths: { href: string; label: string }[] = []
    segments.reduce((prev, segment) => {
      const href = `${prev}/${segment}`
      const label = segment
        .replace(/-/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase())
      paths.push({ href, label })
      return href
    }, "")
    return paths
  }, [pathname])

  return (
    <header className="flex flex-col gap-3 border-b bg-background/95 px-4 py-3 backdrop-blur">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <SidebarNav />
            </SheetContent>
          </Sheet>
          <span className="text-sm font-semibold">ERP Accounting</span>
        </div>
        <div className="hidden items-center gap-2 text-sm text-muted-foreground lg:flex">
          <Search className="h-4 w-4" />
          <span>Periode aktif: Sep 2025</span>
        </div>
        <div className="flex items-center gap-2">
          <Input placeholder="Cari modul atau dokumen" className="hidden w-64 lg:block" />
          <Button variant="outline" size="sm">
            Export
          </Button>
          <Button size="sm">Buat Baru</Button>
        </div>
      </div>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
          </BreadcrumbItem>
          {crumbs.map((crumb, index) => (
            <React.Fragment key={crumb.href}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {index === crumbs.length - 1 ? (
                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  )
}

