import type { Metadata } from "next"
import { createPageMetadata } from "@/lib/seo"

export const dynamic = "force-dynamic"

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  return createPageMetadata({
    title: "Roadmap",
    description: "Workspace roadmap",
    path: `/workspaces/${slug}/roadmap`,
    indexable: false,
  })
}

export default async function RoadmapPage({ params }: Props) {
  const { slug } = await params

  const columns = [
    {
      status: "Planned",
      items: [
        { title: "User profiles", summary: "Basic profile pages with avatar & bio." },
        { title: "Board tags", summary: "Tag posts to organize themes and priorities." },
      ],
    },
    {
      status: "In Progress",
      items: [
        { title: "Voting", summary: "Upvotes on posts to surface popular ideas." },
        { title: "Public widget", summary: "Embed roadmap & feedback widget in-app." },
      ],
    },
    {
      status: "Completed",
      items: [
        { title: "Changelog", summary: "Publish release notes with categories & links." },
        { title: "Workspace theming", summary: "Brand colors, logo, light/dark themes." },
      ],
    },
  ]

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-semibold">Roadmap</h1>
        <span className="text-accent text-sm">/ {slug}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map((col) => (
          <div key={col.status} className="rounded-lg border bg-card">
            <div className="px-3 py-2 border-b flex items-center justify-between">
              <div className="text-sm font-medium">{col.status}</div>
              <div className="text-xs text-accent tabular-nums">{col.items.length}</div>
            </div>
            <ul className="p-3 space-y-2">
              {col.items.map((it) => (
                <li key={it.title} className="rounded-md border bg-background px-3 py-2">
                  <div className="text-sm font-medium text-foreground">{it.title}</div>
                  <div className="text-xs text-accent mt-1">{it.summary}</div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}

