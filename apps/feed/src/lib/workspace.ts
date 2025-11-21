import { db, workspace, workspaceMember } from "@feedgot/db"
import { eq } from "drizzle-orm"

export async function findFirstAccessibleWorkspaceSlug(userId: string): Promise<string | null> {
  const [owned] = await db
    .select({ slug: workspace.slug })
    .from(workspace)
    .where(eq(workspace.ownerId, userId))
    .limit(1)

  if (owned?.slug) return owned.slug

  const [memberWs] = await db
    .select({ slug: workspace.slug })
    .from(workspaceMember)
    .innerJoin(workspace, eq(workspaceMember.workspaceId, workspace.id))
    .where(eq(workspaceMember.userId, userId))
    .limit(1)

  return memberWs?.slug || null
}