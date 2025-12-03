"use client"

import React from "react"
import SectionCard from "../global/SectionCard"
import RoadmapVisibility from "./RoadmapVisibility"
import ManageBoards from "./ManageBoards"
import ManageTags from "./ManageTags"

export default function FeedbackSection({ slug, plan }: { slug: string; plan?: string }) {
  return (
    <SectionCard title="Feedback" description="Configure boards and feedback">
      <div className="space-y-6">
        <RoadmapVisibility slug={slug} />
        <ManageBoards slug={slug} plan={plan} />
        <ManageTags slug={slug} plan={plan} />
      </div>
    </SectionCard>
  )
}
