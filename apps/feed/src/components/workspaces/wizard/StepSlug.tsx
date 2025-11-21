"use client"

import { Input } from "@feedgot/ui/components/input"
import { Link2 } from "lucide-react"

export default function StepSlug({ slug, onChange, checking, available }: { slug: string; onChange: (v: string) => void; checking: boolean; available: boolean | null }) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg sm:text-xl font-semibold">Choose a subdomain.</h2>
        <p className="text-xs sm:text-sm text-accent">This will be used for your workspace URL.</p>
      </div>
      <div className="space-y-2">
        <div className="relative">
          <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-accent" />
          <Input
            id="slug"
            value={slug}
            onChange={(e) => onChange(e.target.value)}
            placeholder="mywebsite"
            className="placeholder:text-accent/70 pr-28 sm:pr-36 pl-9 sm:pl-10"
            aria-invalid={available === false || (!!slug && slug.length < 5)}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs sm:text-sm text-accent select-none">.feedgot.com</span>
          <div className={"absolute left-3 -bottom-6 text-xs " + (slug && slug.length < 5 ? "text-destructive" : checking ? "text-accent" : available === true ? "text-emerald-600" : available === false ? "text-destructive" : "text-accent")}>{slug && slug.length < 5 ? "Min 5 chars" : checking ? "Checking..." : available === true ? "Available" : available === false ? "Taken" : ""}</div>
        </div>
      </div>
    </div>
  )
}