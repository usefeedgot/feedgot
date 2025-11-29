"use client"

import React from "react"
import RequestItem, { type RequestItemData } from "./RequestItem"
import EmptyRequests from "./EmptyRequests"

function RequestListBase({ items, workspaceSlug, linkBase }: { items: RequestItemData[]; workspaceSlug: string; linkBase?: string }) {
  if (items.length === 0) {
    return <EmptyRequests workspaceSlug={workspaceSlug} />
  }
  return (
    <ul className="space-y-2 mt-4">
      {items.map((p) => (
        <RequestItem key={p.id} item={p} workspaceSlug={workspaceSlug} linkBase={linkBase} />
      ))}
    </ul>
  )
}

export default React.memo(RequestListBase)
