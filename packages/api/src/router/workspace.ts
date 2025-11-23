import { HTTPException } from "hono/http-exception"
import { eq } from "drizzle-orm"
import { j, privateProcedure, publicProcedure } from "../jstack"
import { workspace, workspaceMember, board, brandingConfig } from "@feedgot/db"
import { createWorkspaceInputSchema, checkSlugInputSchema } from "../validators/workspace"

export function createWorkspaceRouter() {
  return j.router({
    bySlug: publicProcedure
      .input(checkSlugInputSchema)
      .get(async ({ ctx, input, c }: any) => {
        const [ws] = await ctx.db
          .select({ id: workspace.id, name: workspace.name, slug: workspace.slug, domain: workspace.domain })
          .from(workspace)
          .where(eq(workspace.slug, input.slug))
          .limit(1)
        if (!ws) return c.json({ workspace: null })
        return c.superjson({ workspace: ws })
      }),
    checkSlug: privateProcedure
      .input(checkSlugInputSchema)
      .post(async ({ ctx, input, c }: any) => {
        const existing = await ctx.db
          .select({ id: workspace.id })
          .from(workspace)
          .where(eq(workspace.slug, input.slug))
          .limit(1)
        return c.json({ available: existing.length === 0 })
      }),

    exists: privateProcedure.get(async ({ ctx, c }: any) => {
      const userId = ctx.session.user.id
      const owned = await ctx.db
        .select({ id: workspace.id })
        .from(workspace)
        .where(eq(workspace.ownerId, userId))
        .limit(1)
      const member = await ctx.db
        .select({ id: workspaceMember.id })
        .from(workspaceMember)
        .where(eq(workspaceMember.userId, userId))
        .limit(1)
      return c.json({ hasWorkspace: owned.length > 0 || member.length > 0 })
    }),

    create: privateProcedure
      .input(createWorkspaceInputSchema)
      .post(async ({ ctx, input, c }: any) => {
        const slug = input.slug.toLowerCase()
        const exists = await ctx.db
          .select({ id: workspace.id })
          .from(workspace)
          .where(eq(workspace.slug, slug))
          .limit(1)
        if (exists.length > 0) {
          throw new HTTPException(409, { message: "Slug is already taken" })
        }

        const host = (() => {
          try {
            return new URL(input.domain.trim()).host
          } catch {
            return input.domain.trim()
          }
        })()
        const favicon = `https://www.google.com/s2/favicons?domain=${host}&sz=128`

        let created: any
        try {
          const [ws] = await ctx.db
            .insert(workspace)
            .values({
              name: input.name.trim(),
              slug,
              domain: input.domain.trim(),
              ownerId: ctx.session.user.id,
              timezone: input.timezone,
              logo: favicon,
            })
            .returning()
          created = ws

          await ctx.db.insert(workspaceMember).values({
            workspaceId: ws.id,
            userId: ctx.session.user.id,
            role: "admin",
            permissions: {
              canManageWorkspace: true,
              canManageBilling: true,
              canManageMembers: true,
              canManageBoards: true,
              canModerateAllBoards: true,
              canConfigureBranding: true,
            },
            joinedAt: new Date(),
          })

          await ctx.db.insert(brandingConfig).values({
            workspaceId: ws.id,
            faviconUrl: favicon,
            logoUrl: favicon,
          })

          await ctx.db.insert(board).values([
            {
              workspaceId: ws.id,
              name: "Features",
              slug: "features",
              sortOrder: 0,
              createdBy: ctx.session.user.id,
              isSystem: false,
            },
            {
              workspaceId: ws.id,
              name: "Bugs",
              slug: "bugs",
              sortOrder: 1,
              createdBy: ctx.session.user.id,
              isSystem: false,
            },
            {
              workspaceId: ws.id,
              name: "Roadmap",
              slug: "roadmap",
              sortOrder: 2,
              createdBy: ctx.session.user.id,
              isSystem: true,
              systemType: "roadmap",
            },
            {
              workspaceId: ws.id,
              name: "Changelog",
              slug: "changelog",
              sortOrder: 3,
              createdBy: ctx.session.user.id,
              isSystem: true,
              systemType: "changelog",
            },
          ])
        } catch (err) {
          if (created?.id) {
            try {
              await ctx.db.delete(workspace).where(eq(workspace.id, created.id))
            } catch {}
          }
          throw new HTTPException(500, { message: "Failed to provision workspace" })
        }

        return c.superjson({ workspace: created })
      }),
  })
}
