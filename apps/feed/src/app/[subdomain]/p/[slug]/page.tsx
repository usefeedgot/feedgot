import { notFound } from "next/navigation"
import { db, workspace, board, post, user, workspaceMember } from "@feedgot/db"
import { eq, and, sql } from "drizzle-orm"
import SubdomainRequestDetail from "@/components/subdomain/SubdomainRequestDetail"
import { client } from "@feedgot/api/client"
import { readHasVotedForPost } from "@/lib/vote.server"
import { readInitialCollapsedCommentIds } from "@/lib/comments.server"
import { getServerSession } from "@feedgot/auth/session"

export const revalidate = 30

type Props = { params: Promise<{ subdomain: string; slug: string }> }

export default async function PublicRequestDetailPage({ params }: Props) {
  const { subdomain, slug: postSlug } = await params
  const [ws] = await db
    .select({ id: workspace.id, name: workspace.name, ownerId: workspace.ownerId })
    .from(workspace)
    .where(eq(workspace.slug, subdomain))
    .limit(1)
  if (!ws) return notFound()

  const [p] = await db
    .select({
      id: post.id,
      title: post.title,
      content: post.content,
      image: post.image,
      upvotes: post.upvotes,
      commentCount: post.commentCount,
      roadmapStatus: post.roadmapStatus,
      isFeatured: post.isFeatured,
      isLocked: post.isLocked,
      isPinned: post.isPinned,
      publishedAt: post.publishedAt,
      createdAt: post.createdAt,
      boardName: board.name,
      boardSlug: board.slug,
      author: {
        name: user.name,
        image: user.image,
        email: user.email,
      },
    })
    .from(post)
    .innerJoin(board, eq(post.boardId, board.id))
    .leftJoin(user, eq(post.authorId, user.id))
    .where(and(eq(board.workspaceId, ws.id), sql`(board.system_type is null or board.system_type not in ('roadmap','changelog'))`, eq(post.slug, postSlug)))
    .limit(1)
  if (!p) return notFound()

  const hasVoted = await readHasVotedForPost(p.id)
  const commentsRes = await client.comment.list.$get({ postId: p.id })
  const commentsJson = await commentsRes.json().catch(() => ({ comments: [] }))
  const initialComments = Array.isArray((commentsJson as any)?.comments) ? (commentsJson as any).comments : []
  const initialCollapsedIds = await readInitialCollapsedCommentIds(p.id)

  // Server-side permission check
  let canEdit = false
  const session = await getServerSession()
  const userId = session?.user?.id

  if (userId) {
    if (ws.ownerId === userId) {
      canEdit = true
    } else {
      const [member] = await db
        .select({ role: workspaceMember.role })
        .from(workspaceMember)
        .where(and(eq(workspaceMember.workspaceId, ws.id), eq(workspaceMember.userId, userId)))
        .limit(1)
      if (member?.role === "admin") {
        canEdit = true
      }
    }
  }

  return <SubdomainRequestDetail post={{ ...p, hasVoted } as any} workspaceSlug={subdomain} initialComments={initialComments as any} initialCollapsedIds={initialCollapsedIds} initialCanEdit={canEdit} />
}
