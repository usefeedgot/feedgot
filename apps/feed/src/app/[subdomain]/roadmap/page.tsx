export const dynamic = "force-dynamic"

import type { Metadata } from "next"
import DomainPageLayout from "@/components/domain/DomainPageLayout"
import DomainRoadmapItem from "@/components/domain/DomainRoadmapItem"
import { getPlannedRoadmapPosts, getSidebarPositionBySlug } from "@/lib/workspace"
import { createWorkspaceSectionMetadata } from "@/lib/seo"

export async function generateMetadata({ params }: { params: Promise<{ subdomain: string }> }): Promise<Metadata> {
  const { subdomain } = await params
  return createWorkspaceSectionMetadata(subdomain, "roadmap")
}

export default async function RoadmapPage({ params }: { params: Promise<{ subdomain: string }> }) {
  const { subdomain } = await params
  const slug = subdomain
  const items = await getPlannedRoadmapPosts(slug, { limit: 100, order: "newest" })
  const sidebarPosition = await getSidebarPositionBySlug(slug)
  return (
    <DomainPageLayout subdomain={subdomain} slug={slug} sidebarPosition={sidebarPosition}>
      <div>
          <h1 className="text-lg font-semibold mb-4">Roadmap</h1>
          <div className="space-y-3">
            {(items || []).map((it) => (
              <div key={it.id} className="rounded-md border bg-background px-3 py-2">
                <DomainRoadmapItem
                  item={{ id: it.id, title: it.title, slug: it.slug, roadmapStatus: it.roadmapStatus, content: it.content }}
                  subdomain={subdomain}
                  slug={slug}
                />
              </div>
            ))}
            {items.length === 0 ? (
              <p className="text-sm text-accent">No planned items yet.</p>
            ) : null}
          </div>
      </div>
    </DomainPageLayout>
  )
}
