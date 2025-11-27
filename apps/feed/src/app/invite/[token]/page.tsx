"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { client } from "@feedgot/api/client"
import { toast } from "sonner"

export default function InviteAcceptPage({ params }: { params: Promise<{ token: string }> }) {
  const [busy, setBusy] = React.useState(false)
  const [ok, setOk] = React.useState<boolean | null>(null)
  const router = useRouter()

  React.useEffect(() => {
    let mounted = true
    ;(async () => {
      const { token } = await params
      if (!token) return
      setBusy(true)
      try {
        const res = await client.team.acceptInvite.$post({ token })
        if (!mounted) return
        if (!res.ok) {
          setOk(false)
          toast.error("Invite failed")
          return
        }
        setOk(true)
        toast.success("Invite accepted")
        setTimeout(() => router.replace("/start"), 600)
      } catch {
        if (!mounted) return
        setOk(false)
        toast.error("Invite failed")
      } finally {
        if (mounted) setBusy(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [params, router])

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="bg-card rounded-xl border shadow-sm p-6 w-[min(92vw,520px)]">
        <h1 className="text-lg font-semibold">Accepting invite</h1>
        <p className="text-sm text-accent mt-1">Please wait…</p>
        <div className="mt-4 text-sm">
          {busy ? "Processing" : ok ? "Redirecting" : ok === false ? "Invite invalid or expired" : null}
        </div>
      </div>
    </div>
  )
}

