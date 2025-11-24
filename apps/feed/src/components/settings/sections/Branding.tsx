"use client"

import React from "react"
import SectionCard from "../SectionCard"
import { Input } from "@feedgot/ui/components/input"
import { Label } from "@feedgot/ui/components/label"
import { LoadingButton } from "@/components/loading-button"
import { client } from "@feedgot/api/client"
import { toast } from "sonner"

export default function BrandingSection({ slug }: { slug: string }) {
  const [logoUrl, setLogoUrl] = React.useState("")
  const [primaryColor, setPrimaryColor] = React.useState("#3b82f6")
  const [saving, setSaving] = React.useState(false)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await client.branding.byWorkspaceSlug.$get({ slug })
        const conf = (res as any)?.config
        if (mounted && conf) {
          setLogoUrl(conf.logoUrl || "")
          setPrimaryColor(conf.primaryColor || "#3b82f6")
        }
      } catch {}
      finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [slug])

  const handleSave = async () => {
    if (saving) return
    setSaving(true)
    try {
      await client.branding.update.$post({ slug, logoUrl: logoUrl.trim(), primaryColor: primaryColor.trim() as any })
      toast.success("Branding updated")
    } catch {
      toast.error("Failed to update branding")
    } finally {
      setSaving(false)
    }
  }

  return (
    <SectionCard title="Branding" description="Customize your logo and identity">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="logo">Logo URL</Label>
          <Input id="logo" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="https://example.com/logo.png" className="placeholder:text-accent/60" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="primary">Primary Color</Label>
          <div className="flex items-center gap-2">
            <Input id="primary" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} placeholder="#3b82f6" className="placeholder:text-accent/60" />
            <div aria-hidden className="w-6 h-6 rounded border" style={{ background: primaryColor }} />
          </div>
        </div>
        <div className="pt-2">
          <LoadingButton onClick={handleSave} loading={saving} disabled={loading}>Save Changes</LoadingButton>
        </div>
      </div>
    </SectionCard>
  )
}
