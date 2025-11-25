"use client"

import RequestItem, { type RequestItemData } from "./RequestItem"

export default function RequestList({ items, workspaceSlug }: { items: RequestItemData[]; workspaceSlug: string }) {
  if (items.length === 0) {
    return <div className="text-accent text-sm">No requests found</div>
  }
  return (
    <ul className="space-y-2">
      {items.map((p) => (
        <RequestItem key={p.id} item={p} workspaceSlug={workspaceSlug} />
      ))}
    </ul>
  )
}

