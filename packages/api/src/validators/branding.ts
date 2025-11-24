import { z } from "zod"
import { slugSchema as workspaceSlugSchema } from "./workspace"

export const updateBrandingInputSchema = z.object({
  slug: workspaceSlugSchema,
  logoUrl: z.string().url().optional(),
  faviconUrl: z.string().url().optional(),
  primaryColor: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/).optional(),
  accentColor: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/).optional(),
  theme: z.enum(["light", "dark", "system", "custom"]).optional(),
  showLogo: z.boolean().optional(),
  showWorkspaceName: z.boolean().optional(),
  hidePoweredBy: z.boolean().optional(),
})

