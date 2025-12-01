export const dynamic = "force-dynamic"

import type { Metadata } from "next"
import { DomainSidebar } from "@/components/domain/DomainSidebar"
import { createWorkspaceSectionMetadata } from "@/lib/seo"

export async function generateMetadata({ params }: { params: Promise<{ subdomain: string }> }): Promise<Metadata> {
  const { subdomain } = await params
  return createWorkspaceSectionMetadata(subdomain, "changelog")
}

export default async function ChangelogPage({ params }: { params: Promise<{ subdomain: string }> }) {
  const { subdomain } = await params
  const slug = subdomain
  return (
    <section>
      <div className="lg:grid lg:grid-cols-[minmax(0,1.5fr)_250px] lg:gap-6">
        <div>
          <h1 className="text-lg font-semibold mb-4">Changelog</h1>
          {/* TODO: render public changelog content */}
        </div>  
        <div className="mt-10 lg:mt-0">
          <DomainSidebar subdomain={subdomain} slug={slug} />
        </div>
      </div>
    </section>
  )
}
