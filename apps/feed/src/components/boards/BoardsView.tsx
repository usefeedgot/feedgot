"use client"

import { useEffect, useMemo, useState } from "react"
import WorkspaceHeader from "@/components/boards/WorkspaceHeader"
import { Container } from "@/components/container"
import PostList from "./PostList"
import Sidebar from "./Sidebar"
import { useQueryClient } from "@tanstack/react-query"
import { client } from "@feedgot/api/client"
import { Button } from "@feedgot/ui/components/button"

type TabKey = "issues" | "roadmap" | "changelog"

export default function BoardsView({ workspaceSlug, workspaceName, defaultTab = "issues" }: { workspaceSlug: string; workspaceName: string; defaultTab?: TabKey }) {
  const [active] = useState<TabKey>(defaultTab)
  const qc = useQueryClient()
  const tabs = useMemo(() => ["issues", "roadmap", "changelog"] as const, [])

  useEffect(() => {
    tabs.filter((t) => t !== active).forEach(async (t) => {
      await qc.prefetchQuery({
        queryKey: ["posts", workspaceSlug, t],
        queryFn: async () => {
          const res = await client.board.postsByBoard.$get({ slug: workspaceSlug, boardSlug: t })
          const data = await res.json()
          return (data?.posts || []) as { id: string; title: string; content?: string | null; upvotes?: number | null; commentCount?: number | null; roadmapStatus?: string | null; publishedAt?: string | Date | null }[]
        },
      })
    })
  }, [active, tabs, workspaceSlug, qc])

  return (
    <main className="min-h-screen bg-background">
      <WorkspaceHeader name={workspaceName} slug={workspaceSlug} activeTab={active} hrefBase="" className="w-full rounded-none border-0 border-b border-zinc-200 dark:border-zinc-800" />
      <Container maxWidth="5xl">
        <div className="mt-6 grid grid-cols-1 md:grid-cols-[7fr_3fr] gap-6">
          <div>
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-medium">Have something to say?</div>
                  <div className="text-xs text-accent">Tell us how we could make the product more useful to you.</div>
                </div>
                <Button size="sm">Create a New Post</Button>
              </div>
              <div className="mt-4 flex items-center gap-2 flex-wrap">
                <span className="px-2 py-1 text-xs rounded-md bg-muted text-accent">New</span>
                <span className="px-2 py-1 text-xs rounded-md bg-muted text-accent">Top</span>
                <span className="px-2 py-1 text-xs rounded-md bg-muted text-accent">Trending</span>
                <span className="px-2 py-1 text-xs rounded-md bg-muted text-accent">Search</span>
              </div>
            </div>
            {active === "issues" && <PostList workspaceSlug={workspaceSlug} boardSlug="issues" />}
            {active === "roadmap" && <PostList workspaceSlug={workspaceSlug} boardSlug="roadmap" />}
            {active === "changelog" && <PostList workspaceSlug={workspaceSlug} boardSlug="changelog" />}
          </div>
          <Sidebar workspaceSlug={workspaceSlug} />
        </div>
      </Container>
    </main>
  )
}
