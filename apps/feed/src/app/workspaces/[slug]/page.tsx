import { getWorkspaceBySlug, getWorkspacePosts } from "@/lib/workspace";
import { notFound } from "next/navigation";
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export default async function WorkspacePage({ params }: Props) {
  const { slug } = await params;
  const ws = await getWorkspaceBySlug(slug);
  if (!ws) return notFound();

  const rows = await getWorkspacePosts(slug, { order: "newest" });

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-xl font-semibold">{ws.name}</div>
        <div className="text-sm text-accent">{rows.length} items</div>
      </div>
      <ul className="space-y-2">
        {rows.map((p) => (
          <li key={p.id} className="rounded-md border bg-card p-3">
            <div className="flex items-start gap-3">
              {p.image ? (
                <img
                  src={p.image}
                  alt=""
                  className="w-16 h-16 rounded-md object-cover border"
                />
              ) : null}
              <div className="flex-1">
                <div className="text-sm font-medium">{p.title}</div>
                <div className="text-xs text-accent mt-0.5">{p.boardName}</div>
                <div className="mt-2 flex items-center gap-3 text-xs text-accent">
                  <span className="rounded-md bg-muted px-2 py-0.5">
                    {p.roadmapStatus || "pending"}
                  </span>
                  <span>↑ {p.upvotes}</span>
                  <span>💬 {p.commentCount}</span>
                  <span>
                    {new Date(
                      p.publishedAt ?? p.createdAt
                    ).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
