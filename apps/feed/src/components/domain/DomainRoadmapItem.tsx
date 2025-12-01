"use client"

import Link from "next/link"
import PlannedIcon from "@feedgot/ui/icons/planned"

export type RoadmapItemData = {
  id: string
  title: string
  slug: string
  roadmapStatus: string | null
  content?: string | null
}

function toPlain(s?: string | null): string {
  if (!s) return ""
  return s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
}

export default function DomainRoadmapItem({ item, subdomain, slug }: { item: RoadmapItemData; subdomain: string; slug: string }) {
  const href = `/${subdomain}/${slug}/requests/${item.slug}`
  return (
    <div className="flex flex-col w-full overflow-hidden min-w-0">
      <div className="flex items-center gap-2 min-w-0">
        <Link href={href} className="text-sm font-medium text-foreground hover:text-primary truncate min-w-0">
          {item.title}
        </Link>
      </div>
      {item.content ? (
        <p className="text-accent mt-1 text-xs break-words whitespace-normal line-clamp-2 max-w-full overflow-hidden">
          {toPlain(item.content)}
        </p>
      ) : null}
      <div className="mt-3 flex items-center gap-1.5">
        <PlannedIcon className="w-[18px] h-[18px] text-foreground/80" size={18} />
        <span className="text-[11px] text-accent">Planned</span>
      </div>
    </div>
  )
}
