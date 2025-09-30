"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { navGroups } from "@/config/navigation"
import { cn } from "@/lib/utils"

interface SidebarNavProps {
  className?: string
}

export function SidebarNav({ className }: SidebarNavProps) {
  const pathname = usePathname()

  return (
    <div className={cn("flex h-full flex-col gap-6 overflow-y-auto p-4", className)}>
      <div className="flex items-center gap-2">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary text-primary-foreground font-semibold">
          ERP
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground">Dermatology</p>
          <p className="text-base font-semibold tracking-tight">Accounting</p>
        </div>
      </div>
      <nav className="flex flex-1 flex-col gap-6">
        {navGroups.map((group) => (
          <div key={group.title} className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {group.title}
            </p>
            <ul className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon
                const active = pathname.startsWith(item.href)
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                        active
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>
      <p className="mt-auto text-xs text-muted-foreground">Mock ERP • v0.1</p>
    </div>
  )
}

