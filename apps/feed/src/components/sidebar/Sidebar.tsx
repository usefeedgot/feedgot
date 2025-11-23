"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@feedgot/ui/lib/utils"
import type { NavItem } from "./types"
import { buildTopNav, buildMiddleNav, buildBottomNav, getSlugFromPath, workspaceBase } from "./nav"
const secondaryNav: NavItem[] = buildBottomNav()

export default function Sidebar({ className = "" }: { className?: string }) {
  const pathname = usePathname()
  const slug = getSlugFromPath(pathname)

  const renderItem = (item: NavItem) => {
    const Icon = item.icon
    const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
    return (
      <Link
        key={item.label}
        href={item.href}
        className={cn(
          "group flex items-center gap-2 rounded-md px-3 py-2 text-sm",
          active ? "bg-card text-foreground" : "text-accent hover:bg-muted",
        )}
      >
        <Icon className="w-[18px] h-[18px] text-foreground/80 group-hover:text-primary transition-colors" />
        <span className="transition-colors">{item.label}</span>
      </Link>
    )
  }

  const primaryNav = buildTopNav(slug)
  const middleNav = buildMiddleNav(slug)
  return (
    <aside
      className={cn(
        "flex md:h-screen h-auto w-full md:w-60 flex-col bg-background",
        "md:sticky md:top-0",
        className,
      )}
    >
      <div className="p-4">
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="feedback" className="h-6 w-6" />
          <div className="text-sm font-semibold">feedback</div>
        </div>
      </div>
      <nav className="p-3 space-y-1">
        {primaryNav.map(renderItem)}
      </nav>

      <div className="p-3 mt-8">
        <Link href={workspaceBase(slug)} className="block rounded-md px-3 py-2">
          <div className="text-xs text-accent">Workspace</div>
          <div className="text-sm font-medium truncate">{slug || "Current"}</div>
        </Link>
        <div className="mt-3 space-y-1">
          {middleNav.map(renderItem)}
        </div>
      </div>

      <div className="mt-auto p-3 space-y-1">
        {secondaryNav.map(renderItem)}
      </div>
    </aside>
  )
}
