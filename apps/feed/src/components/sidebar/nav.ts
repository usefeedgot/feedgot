import PlannedIcon from "@/components/icons/planned"
import InProgressIcon from "@/components/icons/inprogress"
import InReviewingIcon from "@/components/icons/inreviewing"
import CompleteIcon from "@/components/icons/complete"
import PendingIcon from "@/components/icons/pending"
import CloseIcon from "@/components/icons/close"
import { RoadmapIcon } from "@feedgot/ui/icons/roadmap"
import { ChangelogIcon } from "@feedgot/ui/icons/changelog"
import { BoardIcon } from "@feedgot/ui/icons/board"
import { SettingIcon } from "@feedgot/ui/icons/setting"
import { AiIcon } from "@feedgot/ui/icons/ai"
import { DocIcon } from "@feedgot/ui/icons/doc"
import { LogoutIcon } from "@feedgot/ui/icons/logout"
import type { NavItem } from "./types"

function w(slug: string, p: string) {
  return slug ? `/workspaces/${slug}${p}` : `/workspaces${p}`
}

export function getSlugFromPath(pathname: string) {
  const parts = pathname.split("/")
  return parts[2] || ""
}

export function buildTopNav(slug: string): NavItem[] {
  return [
    { label: "Planned", href: w(slug, "/planned"), icon: PlannedIcon },
    { label: "In Progress", href: w(slug, "/inprogress"), icon: InProgressIcon },
    { label: "In Reviewing", href: w(slug, "/inreviewing"), icon: InReviewingIcon },
    { label: "Complete", href: w(slug, "/complete"), icon: CompleteIcon },
    { label: "Pending", href: w(slug, "/pending"), icon: PendingIcon },
    { label: "Closed", href: w(slug, "/closed"), icon: CloseIcon },
  ]
}

export function buildMiddleNav(slug: string): NavItem[] {
  return [
    { label: "Roadmap", href: w(slug, "/roadmap"), icon: RoadmapIcon },
    { label: "Changelog", href: w(slug, "/changelog"), icon: ChangelogIcon },
    { label: "My Board", href: w(slug, "/board"), icon: BoardIcon },
    { label: "Settings", href: w(slug, "/settings"), icon: SettingIcon },
  ]
}

export function buildBottomNav(): NavItem[] {
  return [
    { label: "Show AI chat", href: "/chat", icon: AiIcon },
    { label: "Docs", href: "/docs", icon: DocIcon },
    { label: "Sign out", href: "/auth/sign-in", icon: LogoutIcon },
  ]
}

export function workspaceBase(slug: string) {
  return w(slug, "")
}

