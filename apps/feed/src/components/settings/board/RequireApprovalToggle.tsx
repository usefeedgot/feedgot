"use client"

import React from "react"
import { Switch } from "@feedgot/ui/components/switch"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { client } from "@feedgot/api/client"
import { toast } from "sonner"

export default function RequireApprovalToggle({ slug }: { slug: string }) {
  const queryClient = useQueryClient()
  const { data: boards = [], refetch } = useQuery({
    queryKey: ["feedback-boards", slug],
    queryFn: async () => {
      const res = await client.board.settingsByWorkspaceSlug.$get({ slug })
      const d = await res.json()
      return (d as any)?.boards || []
    },
    staleTime: 300000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  })

  const otherBoards = React.useMemo(() => (boards || []).filter((b: any) => b.slug !== "roadmap" && b.slug !== "changelog"), [boards])
  const allTrue = React.useCallback((key: string) => (otherBoards || []).length > 0 && (otherBoards || []).every((b: any) => Boolean(b?.[key])), [otherBoards])
  const [value, setValue] = React.useState<boolean>(allTrue("requireApproval"))

  React.useEffect(() => { setValue(allTrue("requireApproval")) }, [allTrue])

  const apply = async (v: boolean) => {
    try {
      queryClient.setQueryData(["feedback-boards", slug], (prev: any) => {
        const arr = Array.isArray(prev) ? prev : []
        return arr.map((it: any) => (it.slug !== "roadmap" && it.slug !== "changelog") ? { ...it, requireApproval: v } : it)
      })
    } catch {}
    try {
      const res = await client.board.updateGlobalSettings.$post({ slug, patch: { requireApproval: v } })
      if (!res.ok) {
        const err = (await res.json().catch(() => null)) as { message?: string } | null
        throw new Error(err?.message || "Update failed")
      }
      await refetch()
      toast.success("Approval requirement updated")
    } catch (e: unknown) {
      await refetch()
      toast.error((e as { message?: string })?.message || "Failed to update setting")
    }
  }

  return (
    <div className="space-y-2">
      <div className="text-md font-medium">Require Approval</div>
      <div className="text-sm text-accent">Require manual approval before publishing feedback.</div>
      <div className="rounded-md border bg-card p-3 flex items-center justify-between">
        <div className="text-sm">Approval required before publishing</div>
        <Switch checked={value} onCheckedChange={(v) => { setValue(v); apply(v) }} aria-label="Require Approval" />
      </div>
    </div>
  )
}

