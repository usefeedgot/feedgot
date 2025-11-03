export const NEW_TOOL_SLUGS = new Set<string>([
  "feature-adoption-calculator",
  "cohort-analysis",
])

export function isToolNew(slug: string) {
  return NEW_TOOL_SLUGS.has(slug)
}