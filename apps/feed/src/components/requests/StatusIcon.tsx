"use client"

import PlannedIcon from "@feedgot/ui/icons/planned"
import InProgressIcon from "@feedgot/ui/icons/inprogress"
import InReviewingIcon from "@feedgot/ui/icons/inreviewing"
import CompleteIcon from "@feedgot/ui/icons/complete"
import PendingIcon from "@feedgot/ui/icons/pending"
import CloseIcon from "@feedgot/ui/icons/close"

export default function StatusIcon({ status, className = "" }: { status?: string; className?: string }) {
  const s = (status || "").toLowerCase()
  const map: Record<string, any> = {
    planned: PlannedIcon,
    "in-progress": InProgressIcon,
    progress: InProgressIcon,
    "under-review": InReviewingIcon,
    review: InReviewingIcon,
    completed: CompleteIcon,
    complete: CompleteIcon,
    pending: PendingIcon,
    closed: CloseIcon,
    close: CloseIcon,
  }
  const Icon = map[s] || PendingIcon
  return <Icon className={className} />
}

