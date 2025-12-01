import React from "react"
import { notFound } from "next/navigation"
import { db, workspace } from "@feedgot/db"
import { eq } from "drizzle-orm"

import { Container } from "@/components/global/container"
import { DomainHeader } from "@/components/domain/DomainHeader"
import BrandVarsEffect from "@/components/global/BrandVarsEffect"
import { getBrandingBySlug } from "@/lib/workspace"

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ subdomain: string }>
}) {
  const { subdomain } = await params
  const [ws] = await db
    .select({ id: workspace.id, name: workspace.name, slug: workspace.slug, domain: workspace.domain, logo: workspace.logo })
    .from(workspace)
    .where(eq(workspace.slug, subdomain))
    .limit(1)

  if (!ws) notFound()

  const branding = await getBrandingBySlug(subdomain)
  const p = branding.primary
  const isDark = branding.theme === "dark"
  return (
    <div className={isDark ? "dark" : undefined}>
      <style>{`:root{--primary:${p};--ring:${p};--sidebar-primary:${p};}`}</style>
      <BrandVarsEffect primary={p} />
      <div className="fixed inset-0 -z-10 flex flex-col">
        <div className="bg-muted border-b h-48 sm:h-56" />
        <div className="bg-card border-b flex-1" />
      </div>
      <Container maxWidth="5xl">
        <DomainHeader workspace={ws} subdomain={subdomain} />
      </Container>
      <Container maxWidth="5xl">{children}</Container>
    </div>
  )
}
