"use client"

import { Search, Tags, ArrowUpDown, ListFilter } from "lucide-react"
import { BoardIcon } from "@feedgot/ui/icons/board"
import { cn } from "@feedgot/ui/lib/utils"

export default function HeaderActions({ className = "" }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
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
  )
}

