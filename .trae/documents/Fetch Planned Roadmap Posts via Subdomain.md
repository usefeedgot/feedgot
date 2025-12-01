## Context Overview
- Data access uses Drizzle ORM; `getWorkspacePosts` already filters by `post.roadmapStatus` (apps/feed/src/lib/workspace.ts:107–175).
- Roadmap status set includes `planned` (apps/feed/src/lib/roadmap.ts:1). Status normalization is handled by `normalizeStatus` (apps/feed/src/lib/workspace.ts:58–70).
- Subdomain routing is implemented in middleware (apps/feed/src/proxy.ts), rewriting `/{subdomain}/roadmap` based on the request host. Custom domains with the `feedback.` subdomain are supported via domain service (apps/feed/src/lib/domain-service.ts).

## Implementation Steps
1. Add a server helper to fetch planned posts
   - Create `getPlannedRoadmapPosts(slug: string, opts?: { limit?: number; offset?: number; order?: "newest" | "oldest" })` that wraps `getWorkspacePosts(slug, { statuses: ["planned"], limit, offset, order })`.
   - Location: extend `apps/feed/src/lib/workspace.ts` (keeps all workspace data fetchers in one place and leverages existing Drizzle queries).

2. Render planned items on the public roadmap page (subdomain)
   - Update `apps/feed/src/app/[subdomain]/roadmap/page.tsx` to:
     - Read `params.subdomain` as the workspace slug.
     - Call `getPlannedRoadmapPosts(slug, { limit: 100, order: "newest" })`.
     - Render the list using the existing `RoadmapRequestItem` component for visual consistency, showing only items with `roadmapStatus = "planned"`.
   - Keep the `DomainSidebar` intact.

3. Optional: Reuse board UI
   - If you prefer the column board UI, pass only planned items to `RoadmapBoard` so other columns remain empty. The default simple list avoids empty columns and matches the requirement to “only display planned”.

## Verification
- Navigate to `https://{slug}.feedgot.com/roadmap` to confirm only planned posts are shown.
- Test the custom-domain path (if configured) with `https://feedback.{baseDomain}/` rewrite to ensure the same fetch works when `apps/feed/src/proxy.ts` maps the host to the workspace slug.
- Validate large workspaces by adjusting `limit` and confirming pagination/offset behaves correctly.

## Notes
- No changes are required to subdomain resolution; it already maps host → `/{subdomain}/roadmap` (apps/feed/src/proxy.ts).
- Secrets like `DATABASE_URL` remain in env; we won’t expose them. Data access continues to use existing Drizzle models (`post`, `board`).
- The fetch respects normalization so variants like `Planned` or `planned` are handled consistently.