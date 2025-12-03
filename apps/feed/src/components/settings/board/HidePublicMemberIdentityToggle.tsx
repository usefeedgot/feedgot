"use client"

import React from "react"
import { Switch } from "@feedgot/ui/components/switch"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { client } from "@feedgot/api/client"
import { toast } from "sonner"

export default function HidePublicMemberIdentityToggle({ slug }: { slug: string }) {
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
  const [value, setValue] = React.useState<boolean>(allTrue("hidePublicMemberIdentity"))

  React.useEffect(() => { setValue(allTrue("hidePublicMemberIdentity")) }, [allTrue])

  const apply = async (v: boolean) => {
    try {
      queryClient.setQueryData(["feedback-boards", slug], (prev: any) => {
        const arr = Array.isArray(prev) ? prev : []
        return arr.map((it: any) => (it.slug !== "roadmap" && it.slug !== "changelog") ? { ...it, hidePublicMemberIdentity: v } : it)
      })
    } catch {}
    try {
      const res = await client.board.updateGlobalSettings.$post({ slug, patch: { hidePublicMemberIdentity: v } })
      if (!res.ok) {
        const err = (await res.json().catch(() => null)) as { message?: string } | null
        throw new Error(err?.message || "Update failed")
      }
      await refetch()
      toast.success("Public member identity setting updated")
    } catch (e: unknown) {
      await refetch()
      toast.error((e as { message?: string })?.message || "Failed to update setting")
    }
  }

  return (
    <div className="space-y-2">
      <div className="text-md font-medium">Hide Public Member Identity</div>
      <div className="text-sm text-accent">Keep member names hidden on the public site.</div>
      <div className="rounded-md border bg-card p-3 flex items-center justify-between">
        <div className="text-sm">Hide public member names</div>
        <Switch checked={value} onCheckedChange={(v) => { setValue(v); apply(v) }} aria-label="Hide Public Member Identity" />
      </div>
    </div>
  )
}

