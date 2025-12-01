import { z } from "zod"
import { slugSchema as workspaceSlugSchema } from "./workspace"

export const updateBrandingInputSchema = z.object({
  slug: workspaceSlugSchema,
  logoUrl: z.string().url().optional(),
  primaryColor: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/).optional(),
  theme: z.enum(["light", "dark", "system"]).optional(),
  showLogo: z.boolean().optional(),
  showWorkspaceName: z.boolean().optional(),
  hidePoweredBy: z.boolean().optional(),
  layoutStyle: z.enum(["compact", "comfortable", "spacious"]).optional(),
  sidebarPosition: z.enum(["left", "right"]).optional(),
})
