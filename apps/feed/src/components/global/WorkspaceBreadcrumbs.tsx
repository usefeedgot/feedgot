"use client"

import React from "react"
import { usePathname } from "next/navigation"
import { SECTIONS } from "@/config/sections"

function titleFor(segment: string): string {
  const s = segment.toLowerCase()
  if (s === "roadmap") return "Roadmap"
  if (s === "changelog") return "Changelog"
  if (s === "settings") return "Settings"
  if (s === "system") return "System"
  const found = SECTIONS.find((x) => x.value === s)
  if (found) return found.label
  return ""
}

export default function WorkspaceBreadcrumbs() {
  const pathname = usePathname() || "/"
  const parts = pathname.split("/").filter(Boolean)
  const idx = parts.indexOf("workspaces")
  const rest = idx >= 0 ? parts.slice(idx + 2) : []

  let title = "Overview"
  if (rest.length > 0) {
    const t = titleFor(rest[0] ?? "")
    title = t || ""
  }

  if (!title) return null

  return (
    <div className="p-3">
      <h1 className="text-xl font-semibold">{title}</h1>
    </div>
  )
}
