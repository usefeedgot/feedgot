import { db, workspace, workspaceMember, brandingConfig } from "@feedgot/db"
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

export async function getBrandingColorsBySlug(slug: string): Promise<{ primary: string; accent?: string }> {
  let primary = "#3b82f6"
  let accent: string | undefined
  const [ws] = await db
    .select({ id: workspace.id })
    .from(workspace)
    .where(eq(workspace.slug, slug))
    .limit(1)
  if (!ws?.id) return { primary, accent }
  const [conf] = await db
    .select({ primaryColor: brandingConfig.primaryColor, accentColor: brandingConfig.accentColor })
    .from(brandingConfig)
    .where(eq(brandingConfig.workspaceId, ws.id))
    .limit(1)
  if (conf?.primaryColor) primary = conf.primaryColor
  if (conf?.accentColor) accent = conf.accentColor
  return { primary, accent }
}
