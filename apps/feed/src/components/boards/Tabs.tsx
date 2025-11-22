"use client"

import Link from "next/link"
import { useMemo } from "react"

export default function Tabs({ active, className, onChange, hrefBase = "" }: { active: "issues" | "roadmap" | "changelog"; className?: string; onChange?: (tab: "issues" | "roadmap" | "changelog") => void; hrefBase?: string }) {
  const items = useMemo(() => ["issues", "roadmap", "changelog"] as const, [])
  const labels: Record<(typeof items)[number], string> = {
    issues: "Feedback",
    roadmap: "Roadmap",
    changelog: "Changelog",
  }
  const base = className || "mt-6 border-b border-zinc-200 dark:border-zinc-800 flex gap-6"
  return (
    <nav className={base}>
      {items.map((k) => (
        onChange ? (
          <button
            key={k}
            type="button"
            onClick={() => onChange(k)}
            className={
              active === k
                ? "px-2 py-2 rounded-md text-foreground font-medium"
                : "px-2 py-2 rounded-md text-accent hover:text-foreground"
            }
          >
            {labels[k]}
          </button>
        ) : (
          <Link
            key={k}
            href={`${hrefBase}/${k}`}
            className={
              active === k
                ? "px-2 py-2 rounded-md text-foreground font-medium"
                : "px-2 py-2 rounded-md text-accent hover:text-foreground"
            }
          >
            {labels[k]}
          </Link>
        )
      ))}
    </nav>
  )
}
