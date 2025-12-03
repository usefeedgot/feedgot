"use client"

import React from "react"
import SectionCard from "../global/SectionCard"
import AllowAnonymousToggle from "./AllowAnonymousToggle"
import AllowCommentsToggle from "./AllowCommentsToggle"
import ManageBoards from "./ManageBoards"
import HidePublicMemberIdentityToggle from "./HidePublicMemberIdentityToggle"

export default function BoardSettings({ slug, plan }: { slug: string; plan?: string }) {
  return (
    <SectionCard title="Board Settings" description="Configure board settings">
      <div className="space-y-3">

        <AllowAnonymousToggle slug={slug} />
        <AllowCommentsToggle slug={slug} />
        <HidePublicMemberIdentityToggle slug={slug} />
        <ManageBoards slug={slug} plan={plan} />
      </div>
    </SectionCard>
  )
}
