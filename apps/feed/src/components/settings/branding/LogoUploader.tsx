"use client"

import React from "react"
import { Button } from "@feedgot/ui/components/button"
import { toast } from "sonner"
import { getLogoUploadUrl, saveBranding } from "./service"
import { setWorkspaceLogo } from "@/lib/branding-store"

type Props = {
  slug: string
  value?: string
  onChange: (url: string) => void
}

export default function LogoUploader({ slug, value = "", onChange }: Props) {
  const [fileName, setFileName] = React.useState("")
  const [preview, setPreview] = React.useState<string>(value || "")
  const [uploading, setUploading] = React.useState(false)

  React.useEffect(() => {
    setPreview(value || "")
  }, [value])

  const inputRef = React.useRef<HTMLInputElement | null>(null)
  const allowed = React.useMemo(() => [
    "image/png",
    "image/jpeg",
    "image/webp",
    "image/svg+xml",
  ], [])

  const pick = () => inputRef.current?.click()

  const onFile = async (file: File) => {
    if (!allowed.includes(file.type)) {
      toast.error("Unsupported file type")
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File too large")
      return
    }
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = () => setPreview(typeof reader.result === "string" ? reader.result : "")
    reader.readAsDataURL(file)
    setUploading(true)
    try {
      const { uploadUrl, publicUrl } = await getLogoUploadUrl(slug, file.name, file.type)
      const res = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      })
      if (!res.ok) throw new Error("Upload failed")
      const ok = await saveBranding(slug, { logoUrl: publicUrl })
      if (!ok) throw new Error("Save failed")
      setWorkspaceLogo(slug, publicUrl)
      onChange(publicUrl)
      toast.success("Logo updated")
    } catch (e: any) {
      toast.error(e?.message || "Failed to upload")
    } finally {
      setUploading(false)
    }
  }

  const onInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const f = e.currentTarget.files?.[0]
    if (f) void onFile(f)
  }

  const onDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault()
    const f = e.dataTransfer.files?.[0]
    if (f) void onFile(f)
  }

  const onDragOver: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault()
  }

  return (
    <div className="space-y-2">
      <div
        className="relative flex items-center gap-3 rounded-md border bg-muted/30 p-3"
        onDrop={onDrop}
        onDragOver={onDragOver}
      >
        <div className="relative w-14 h-14 rounded-md bg-muted border ring-1 ring-border overflow-hidden">
          {preview ? (
            <img src={preview} alt="Logo preview" className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-accent text-xs">No logo</div>
          )}
        </div>
        <div className="flex-1">
          <div className="text-sm">{fileName || "Upload a logo image"}</div>
          <div className="text-xs text-accent">PNG, JPG, WEBP, SVG up to 2MB</div>
        </div>
        <div className="ml-auto">
          <Button type="button" onClick={pick} disabled={uploading}>{uploading ? "Uploading..." : "Choose"}</Button>
          <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" className="hidden" onChange={onInputChange} />
        </div>
      </div>
    </div>
  )
}
