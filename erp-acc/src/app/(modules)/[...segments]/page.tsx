import { notFound } from "next/navigation"

import { ModuleScreen } from "@/components/modules/ModuleScreen"
import { getModuleConfig } from "@/config/modules"

export const dynamic = "force-dynamic"

export default function ModulePage({ params }: { params: { segments?: string[] } }) {
  const slugSegments = params.segments ?? []
  const path = slugSegments.join("/")

  const config = getModuleConfig(path)
  if (process.env.NODE_ENV !== "production") {
    console.log("[ModulePage] path:", path, "config:", Boolean(config))
  }
  if (!config) {
    return notFound()
  }

  return <ModuleScreen config={config} />
}
