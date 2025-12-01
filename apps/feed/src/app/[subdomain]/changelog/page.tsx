export const dynamic = "force-dynamic"

import type { Metadata } from "next"
import DomainPageLayout from "@/components/domain/DomainPageLayout"
import { createWorkspaceSectionMetadata } from "@/lib/seo"
import { getSidebarPositionBySlug } from "@/lib/workspace"

export async function generateMetadata({ params }: { params: Promise<{ subdomain: string }> }): Promise<Metadata> {
  const { subdomain } = await params
  return createWorkspaceSectionMetadata(subdomain, "changelog")
}

export default async function ChangelogPage({ params }: { params: Promise<{ subdomain: string }> }) {
  const { subdomain } = await params
  const slug = subdomain
  const sidebarPosition = await getSidebarPositionBySlug(slug)
  return (
    <DomainPageLayout subdomain={subdomain} slug={slug} sidebarPosition={sidebarPosition}>
      <div>
          <h1 className="text-lg font-semibold mb-4">Changelog</h1>
          {/* TODO: render public changelog content */}
      </div>
    </DomainPageLayout>
  )
}
