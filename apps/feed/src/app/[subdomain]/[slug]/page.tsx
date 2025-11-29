import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { db, workspace } from "@feedgot/db"
import { eq } from "drizzle-orm"
import { createPageMetadata } from "@/lib/seo"
import { getWorkspaceBySlug } from "@/lib/workspace"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const ws = await getWorkspaceBySlug(slug)
  const title = ws?.name || "Workspace"
  const baseUrl = ws?.customDomain ? `https://${ws.customDomain}` : `https://${slug}.feedgot.com`
  const meta = createPageMetadata({
    title,
    description: ws?.domain ? `Feedback for ${ws.domain}` : title,
    path: "/",
    image: ws?.logo || undefined,
    absoluteTitle: true,
    baseUrl,
  })
  return {
    ...meta,
    ...(ws?.logo ? { icons: { icon: [ws.logo], shortcut: [ws.logo], apple: [ws.logo] } } : {}),
  }
}

export default async function SitePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [ws] = await db
    .select({ id: workspace.id, name: workspace.name, slug: workspace.slug, domain: workspace.domain })
    .from(workspace)
    .where(eq(workspace.slug, slug))
    .limit(1)
  if (!ws) notFound()

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-semibold">{ws.name}</h1>
        <p className="text-accent text-sm">{ws.slug}.feedgot.com</p>
        <div className="mt-6 text-sm text-accent">Domain: {ws.domain}</div>
      </div>
    </main>
  )
}