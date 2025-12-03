import React from "react"
import { DomainSidebar } from "./DomainSidebar"

export default function DomainPageLayout({ subdomain, slug, sidebarPosition = "right", children }: { subdomain: string; slug: string; sidebarPosition?: "left" | "right"; children: React.ReactNode }) {
  const grid = sidebarPosition === "left" ? "lg:grid lg:grid-cols-[250px_minmax(0,1.5fr)] lg:gap-6" : "lg:grid lg:grid-cols-[minmax(0,1.5fr)_250px] lg:gap-6"
  return (
    <section>
      <div className={grid}>
        {sidebarPosition === "left" ? (
          <aside className="hidden lg:block mt-10 lg:mt-0">
            <DomainSidebar subdomain={subdomain} slug={slug} />
          </aside>
        ) : null}
        <div>{children}</div>
        {sidebarPosition === "right" ? (
          <aside className="hidden lg:block mt-10 lg:mt-0">
            <DomainSidebar subdomain={subdomain} slug={slug} />
          </aside>
        ) : null}
      </div>
    </section>
  )
}

