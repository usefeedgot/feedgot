"use client"

import React from "react"
import SectionCard from "../SectionCard"
import { Input } from "@feedgot/ui/components/input"
import { Label } from "@feedgot/ui/components/label"
import { Button } from "@feedgot/ui/components/button"
import { Popover, PopoverTrigger, PopoverContent } from "@feedgot/ui/components/popover"
import { LoadingButton } from "@/components/loading-button"
import { client } from "@feedgot/api/client"
import { toast } from "sonner"
import { Switch } from "@feedgot/ui/components/switch"
import { Badge } from "@feedgot/ui/components/badge"
import DropdownIcon from "@feedgot/ui/icons/dropdown"
import { BRANDING_COLORS, findColorByPrimary, applyBrandPrimary } from "../colors"

type BrandingConfig = {
  logoUrl?: string
  primaryColor?: string
  accentColor?: string
  theme?: "light" | "dark" | "system" | "custom"
  hidePoweredBy?: boolean
}

type BrandingResponse = { config: BrandingConfig | null }

export default function BrandingSection({ slug }: { slug: string }) {
  const [logoUrl, setLogoUrl] = React.useState("")
  const [primaryColor, setPrimaryColor] = React.useState("#3b82f6")
  const [accentColor, setAccentColor] = React.useState("#60a5fa")
  const [colorKey, setColorKey] = React.useState<string>("blue")
  const [theme, setTheme] = React.useState<"light" | "dark" | "system">("system")
  const [hidePoweredBy, setHidePoweredBy] = React.useState<boolean>(false)
  const [saving, setSaving] = React.useState(false)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    let mounted = true
    void (async () => {
      try {
        const res = await client.branding.byWorkspaceSlug.$get({ slug })
        const data = (await res.json()) as BrandingResponse
        const conf = data?.config
        if (mounted && conf) {
          setLogoUrl(conf.logoUrl || "")
          const currentPrimary = conf.primaryColor || "#3b82f6"
          const found = findColorByPrimary(currentPrimary) || BRANDING_COLORS[1]
          setPrimaryColor(currentPrimary)
          setAccentColor(conf.accentColor || (found && found.accent) || "#60a5fa")
          setColorKey(found ? found.key : "blue")
          if (conf.theme === "light" || conf.theme === "dark" || conf.theme === "system") setTheme(conf.theme)
          setHidePoweredBy(Boolean(conf.hidePoweredBy))
        }
      } catch (e) {}
      finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [slug])

  const handleSave = async () => {
    if (saving) return
    setSaving(true)
    const root = document.documentElement
    const prevP = getComputedStyle(root).getPropertyValue("--primary").trim()
    const p = primaryColor.trim()
    const a = accentColor.trim()
    applyBrandPrimary(p)
    try {
      const res = await client.branding.update.$post({ slug, logoUrl: logoUrl.trim(), primaryColor: p, accentColor: a, theme, hidePoweredBy })
      if (!res.ok) {
        const err = await res.json().catch(() => null)
        throw new Error(err?.message || "Update failed")
      }
      toast.success("Branding updated")
    } catch (e) {
      applyBrandPrimary(prevP || "#3b82f6")
      toast.error("Failed to update branding")
    } finally {
      setSaving(false)
    }
  }

  return (
    <SectionCard title="Branding" description="Change your brand settings.">
      <div className="divide-y rounded-md border">
        <div className="flex items-center justify-between p-4">
          <div className="text-sm">Logo</div>
          <div className="w-full max-w-md">
            <Input id="logo" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="https://example.com/logo.png" className="h-9" />
          </div>
        </div>

        <div className="flex items-center justify-between p-4">
          <div className="text-sm">Primary Color</div>
          <div className="w-full max-w-md flex items-center justify-end">
            <Popover>
              <PopoverTrigger asChild>
                <Button type="button" variant="outline" className="h-9 min-w-[12rem] justify-between">
                  <span className="inline-flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full border" style={{ background: primaryColor }} />
                    <span className="text-sm">{BRANDING_COLORS.find((x) => x.key === colorKey)?.name || "Select color"}</span>
                  </span>
                  <DropdownIcon className="opacity-60" size={16} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0 w-auto min-w-[10rem]">
                <div className="max-h-[50vh] sm:max-h-64 overflow-y-auto">
                  {BRANDING_COLORS.map((c) => (
                    <button
                      key={c.key}
                      type="button"
                      onClick={() => {
                        setColorKey(c.key)
                        setPrimaryColor(c.primary)
                        setAccentColor(c.accent)
                        applyBrandPrimary(c.primary)
                      }}
                      className="relative group w-full text-left px-3 py-2 hover:bg-muted flex items-center gap-3"
                    >
                      <span className="absolute left-0 top-0 bottom-0 w-[2px] opacity-0 group-hover:opacity-100" style={{ background: c.primary }} />
                      <span className="w-4 h-4 rounded-full border" style={{ background: c.primary }} />
                      <span className="text-sm">{c.name}</span>
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="flex items-center justify-between p-4">
          <div className="text-sm">Theme</div>
          <div className="w-full max-w-md flex items-center justify-end">
            <Popover>
              <PopoverTrigger asChild>
                <Button type="button" variant="outline" className="h-9 min-w-[12rem] justify-between">
                  <span className="text-sm capitalize">{theme}</span>
                  <DropdownIcon className="opacity-60" size={16} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0 w-auto min-w-[10rem]">
                <div className="max-h-[50vh] sm:max-h-64 overflow-y-auto">
                  {(["system", "light", "dark"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTheme(t)}
                      className="relative group w-full text-left px-3 py-2 hover:bg-muted flex items-center gap-3"
                    >
                      <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-primary opacity-0 group-hover:opacity-100" />
                      <span className="text-sm capitalize">{t}</span>
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="flex items-center justify-between p-4">
          <div className="text-sm text-muted-foreground">Hide "Powered by" Branding</div>
          <div className="w-full max-w-md flex items-center justify-end">
            <Switch checked={hidePoweredBy} onCheckedChange={(v) => setHidePoweredBy(Boolean(v))} aria-label="Hide Powered by" />
          </div>
        </div>
      </div>

      <div className="p-4">
        <Badge variant="outline">Custom branding is only available on our paid plans.</Badge>
      </div>

      <div className="px-4 pb-4">
        <LoadingButton onClick={handleSave} loading={saving} disabled={loading}>Save</LoadingButton>
      </div>
    </SectionCard>
  )
}
