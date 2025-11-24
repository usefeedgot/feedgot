"use client"

import React from "react"
import { toast } from "sonner"
import { getLogoUploadUrl, saveBranding } from "./service"
import { setWorkspaceLogo } from "@/lib/branding-store"

type Props = {
  slug: string
  value?: string
  onChange: (url: string) => void
}

export default function LogoUploader({ slug, value = "", onChange }: Props) {
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
    <div
      className="relative w-8 h-8 rounded-md bg-muted border ring-1 ring-border overflow-hidden cursor-pointer"
      onClick={pick}
      onDrop={onDrop}
      onDragOver={onDragOver}
      role="button"
      aria-label="Upload workspace logo"
    >
      {preview ? (
        <img src={preview} alt="Logo" className="absolute inset-0 w-full h-full object-cover" />
      ) : null}
      <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" className="hidden" onChange={onInputChange} />
    </div>
  )
}
