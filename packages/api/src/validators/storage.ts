import { z } from "zod"

export const getUploadUrlInputSchema = z.object({
  slug: z.string().min(1),
  fileName: z.string().min(1),
  contentType: z.string().min(1),
  folder: z.string().optional(),
})

export type GetUploadUrlInput = z.infer<typeof getUploadUrlInputSchema>
