"use client"

import React from "react"
import SectionCard from "../global/SectionCard"
import AllowAnonymousToggle from "./AllowAnonymousToggle"
import RequireApprovalToggle from "./RequireApprovalToggle"
import AllowVotingToggle from "./AllowVotingToggle"
import AllowCommentsToggle from "./AllowCommentsToggle"
import HidePublicMemberIdentityToggle from "./HidePublicMemberIdentityToggle"

export default function BoardSettings({ slug }: { slug: string }) {
  return (
    <SectionCard title="Board Settings" description="Configure board settings">
      <div className="space-y-6">
        <AllowAnonymousToggle slug={slug} />
        <RequireApprovalToggle slug={slug} />
        <AllowVotingToggle slug={slug} />
        <AllowCommentsToggle slug={slug} />
        <HidePublicMemberIdentityToggle slug={slug} />
      </div>
    </SectionCard>
  )
}
