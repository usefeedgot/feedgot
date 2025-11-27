"use client"

import { cn } from "@feedgot/ui/lib/utils"
import BoardsAction from "./actions/BoardsAction"
import StatusAction from "./actions/StatusAction"
import TagsAction from "./actions/TagsAction"
import SortAction from "./actions/SortAction"
import SearchAction from "./actions/SearchAction"
import { usePathname, useSearchParams } from "next/navigation"
import React from "react"
import { useQuery } from "@tanstack/react-query"
import { client } from "@feedgot/api/client"
import { parseArrayParam } from "@/utils/request-filters"
import { getSlugFromPath } from "@/config/nav"

export default function HeaderActions({ className = "" }: { className?: string }) {
  const pathname = usePathname() || "/"
  const sp = useSearchParams()
  const slug = React.useMemo(() => getSlugFromPath(pathname), [pathname])

  const statuses = parseArrayParam(sp.get("status"))
  const boards = parseArrayParam(sp.get("board"))
  const tags = parseArrayParam(sp.get("tag"))
  const search = sp.get("search") || ""

  const { data: countData } = useQuery({
    queryKey: ["post-count", slug, statuses, boards, tags, search],
    queryFn: async () => {
      const res = await client.board.postCountByWorkspaceSlug.$get({
        slug,
        statuses,
        boardSlugs: boards,
        tagSlugs: tags,
        search,
      })
      const data = await res.json()
      return Number(data?.count || 0)
    },
    staleTime: 10_000,
    enabled: !!slug,
  })

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {typeof countData === "number" ? (
        <span className="inline-flex items-center gap-1 bg-muted rounded-md ring-1 ring-border px-2 py-2 text-xs tabular-nums text-accent">
          {countData} {countData === 1 ? "Post" : "Posts"}
        </span>
      ) : null}
      <SearchAction />
      <BoardsAction />
      <StatusAction />
      <TagsAction />
      <SortAction />
    </div>
  )
}
