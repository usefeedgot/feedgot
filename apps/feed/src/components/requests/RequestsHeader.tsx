"use client"

import { useMemo } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { cn } from "@feedgot/ui/lib/utils"
import { Search, Tags, ArrowUpDown, ListFilter } from "lucide-react"
import { BoardIcon } from "@feedgot/ui/icons/board"

function toLabel(s: string) {
  const t = s.toLowerCase()
  if (t === "under-review" || t === "review") return "Review"
  if (t === "in-progress" || t === "progress") return "Progress"
  if (t === "completed" || t === "complete") return "Complete"
  if (t === "planned") return "Planned"
  if (t === "pending") return "Pending"
  if (t === "closed" || t === "close") return "Closed"
  return s
}

export default function RequestsHeader({ slug, selectedStatuses, order, className = "" }: { slug: string; selectedStatuses: string[]; order: string; className?: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const statusLabels = useMemo(() => selectedStatuses.map(toLabel), [selectedStatuses])

  const clearFilters = () => {
    const sp = new URLSearchParams(searchParams.toString())
    sp.delete("status")
    sp.set("order", "newest")
    const u = `${pathname}?${sp.toString()}`
    router.push(u)
  }

  return (
    <div className={cn("flex items-center justify-between", className)}>
      <div className="flex items-center gap-2">
        <div className="text-xl font-semibold">Requests</div>
        {statusLabels.length > 0 ? (
          <div className="ml-2 flex items-center gap-1">
            {statusLabels.map((l) => (
              <span key={l} className="rounded-md bg-muted px-2 py-0.5 text-xs">{l}</span>
            ))}
            <button type="button" onClick={clearFilters} className="text-xs text-primary hover:underline px-2 py-0.5">Clear</button>
          </div>
        ) : null}
      </div>
      <div className="flex items-center gap-2">
        <button type="button" className="rounded-md border bg-card px-2 py-1" aria-label="Search">
          <Search className="w-4 h-4" />
        </button>
        <button type="button" className="rounded-md border bg-card px-2 py-1" aria-label="Boards">
          <BoardIcon className="w-4 h-4" />
        </button>
        <button type="button" className="rounded-md border bg-card px-2 py-1" aria-label="Requests">
          <ListFilter className="w-4 h-4" />
        </button>
        <button type="button" className="rounded-md border bg-card px-2 py-1" aria-label="Tags">
          <Tags className="w-4 h-4" />
        </button>
        <button type="button" className="rounded-md border bg-card px-2 py-1" aria-label="Sort">
          <ArrowUpDown className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

