import type { Metadata } from "next"
import { getServerSession } from "@feedgot/auth/session"
import { notFound } from "next/navigation"
import { getWorkspaceBySlug, getWorkspacePosts, parseArrayParam, normalizeStatus } from "@/lib/workspace"
import { createPageMetadata } from "@/lib/seo"

export const dynamic = "force-dynamic"

type SearchParams = {
  status?: string | string[]
  board?: string | string[]
  tag?: string | string[]
  order?: string
  search?: string
}

type Props = { params: Promise<{ slug: string }>; searchParams?: Promise<SearchParams> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  return createPageMetadata({
    title: "Requests",
    description: "Workspace requests",
    path: `/workspaces/${slug}/requests`,
    indexable: false,
  })
}


export default async function RequestsPage({ params, searchParams }: Props) {
  const { slug } = await params
  let sp: SearchParams = {}
  if (searchParams) {
    try {
      sp = await searchParams
    } catch {}
  }

  try {
    await getServerSession()
  } catch {}

  const ws = await getWorkspaceBySlug(slug)
  if (!ws) return notFound()

  const statusRaw = parseArrayParam((sp as any).status)
  const boardRaw = parseArrayParam((sp as any).board)
  const tagRaw = parseArrayParam((sp as any).tag)
  const order = typeof (sp as any).order === "string" && (sp as any).order ? (sp as any).order : "newest"

  const statusFilter = statusRaw.map(normalizeStatus)
  if (statusFilter.length === 0) statusFilter.push("pending", "under-review", "planned", "in-progress")

  const boardSlugs = boardRaw.map((b: string) => b.trim().toLowerCase()).filter(Boolean)
  const tagSlugs = tagRaw.map((t: string) => t.trim().toLowerCase()).filter(Boolean)
  const rows = await getWorkspacePosts(slug, {
    statuses: statusFilter,
    boardSlugs,
    tagSlugs,
    order: order === "oldest" ? "oldest" : "newest",
  })

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-xl font-semibold">Requests</div>
        <div className="text-sm text-accent">{rows.length} items</div>
      </div>
      <ul className="space-y-2">
        {rows.map((p) => (
          <li key={p.id} className="rounded-md border bg-card p-3">
            <div className="flex items-start gap-3">
              {p.image ? <img src={p.image} alt="" className="w-16 h-16 rounded-md object-cover border" /> : null}
              <div className="flex-1">
                <div className="text-sm font-medium">{p.title}</div>
                <div className="text-xs text-accent mt-0.5">{p.boardName}</div>
                <div className="mt-2 flex items-center gap-3 text-xs text-accent">
                  <span className="rounded-md bg-muted px-2 py-0.5">{p.roadmapStatus || "pending"}</span>
                  <span>↑ {p.upvotes}</span>
                  <span>💬 {p.commentCount}</span>
                  <span>{new Date(p.publishedAt ?? p.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
