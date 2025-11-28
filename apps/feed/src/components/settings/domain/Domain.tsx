"use client"

import React from "react"
import SectionCard from "../global/SectionCard"
import { toast } from "sonner"
import { Button } from "@feedgot/ui/components/button"
import AddDomainDialog from "./AddDomainDialog"
import RecordsTable from "./RecordsTable"
import { loadDomain, createDomain, verifyDomain, deleteDomain } from "./service"
import type { DomainInfo } from "./types"

export default function DomainSection({ slug }: { slug: string }) {
  const [plan, setPlan] = React.useState<string>("free")
  const [defaultDomain, setDefaultDomain] = React.useState<string>("")
  const [info, setInfo] = React.useState<DomainInfo>(null)
  const [loading, setLoading] = React.useState(true)

  const [open, setOpen] = React.useState(false)
  const [saving, setSaving] = React.useState(false)
  const [verifying, setVerifying] = React.useState(false)

  const load = React.useCallback(async () => {
    setLoading(true)
    try {
      const data = await loadDomain(slug)
      setPlan(data.plan)
      setDefaultDomain(data.defaultDomain)
      setInfo(data.info)
    } catch {}
    finally { setLoading(false) }
  }, [slug])

  React.useEffect(() => { void load() }, [load])

  const canUse = plan === "starter" || plan === "professional"
  const hostBase = (() => { try { return new URL(defaultDomain).host } catch { return defaultDomain.replace(/^https?:\/\//, "") } })()
  const suggested = hostBase ? `https://feedback.${hostBase}` : ""

  const handleCreate = async (base: string) => {
    if (!canUse) { toast.error("Upgrade to Starter or Professional to use a custom domain"); return }
    const v = base.trim()
    if (!v) { toast.error("Enter a domain"); return }
    setSaving(true)
    try {
      const result = await createDomain(slug, v)
      if (!result.ok) throw new Error(result.message || "Failed to add domain")
      toast.success("Domain added. Configure DNS and verify.")
      setOpen(false)
      await load()
    } catch (e: any) {
      toast.error(e?.message || "Failed to add domain")
    } finally { setSaving(false) }
  }

  const handleVerify = async () => {
    setVerifying(true)
    try {
      const result = await verifyDomain(slug)
      if (!result.ok) throw new Error(result?.message || "Verify failed")
      if (result?.status === "verified") toast.success("Domain verified")
      else toast.info("Records not found yet. Still pending.")
      await load()
    } catch (e: any) {
      toast.error(e?.message || "Failed to verify domain")
    } finally { setVerifying(false) }
  }

  return (
    <SectionCard title="Domain" description="Custom domain settings">
      <div className="divide-y">
        <div className="flex items-center justify-between p-4">
          <div className="text-sm">Default URL</div>
          <div className="text-sm">{`https://${slug}.feedgot.com`}</div>
        </div>

        <div className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm">Manage Domain</div>
            <div className="flex items-center gap-2">
              <Button variant="quiet" onClick={() => setOpen(true)} disabled={loading || !canUse || Boolean(info?.host)}>Add domain</Button>
              {info?.host ? (
                <Button variant="quiet" asChild>
                  <a href={`https://${info.host}`} target="_blank" rel="noopener noreferrer">Visit</a>
                </Button>
              ) : null}
            </div>
          </div>
          {info?.host ? (
            <RecordsTable info={info} onVerify={handleVerify} verifying={verifying} onDelete={async () => { const r = await deleteDomain(slug); if (!r.ok) { toast.error(r.message || 'Delete failed'); return } toast.success('Domain deleted'); await load() }} />
          ) : (
            <div className="text-xs text-muted-foreground">No custom domain configured. Suggested: {suggested || "https://feedback.example.com"}</div>
          )}
          {!canUse ? <div className="text-xs text-muted-foreground">Custom domains are available on Starter and Professional plans.</div> : null}
        </div>
      </div>
      <AddDomainDialog open={open} onOpenChange={setOpen} onSave={(v) => handleCreate(v)} />
    </SectionCard>
  )
}
