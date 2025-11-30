## Goal
Create a clean, modular static layout for the public workspace page at `apps/feed/src/app/[subdomain]/[slug]/page.tsx` that:
- Uses a `Container` wrapper
- Renders a `DomainHeader` with logo, name, and nav links (Feedback, Roadmap, Changelog), plus Sign in/Sign up on the right
- Shows all feedback flowing down the page with pagination
- Provides a board-selection dropdown that excludes Roadmap and Changelog boards
- Keeps the page as a layout shell; actual content listing is delegated to components

## Current State
- `apps/feed/src/app/[subdomain]/[slug]/page.tsx` renders a minimal workspace landing (no boards, pagination, or header) [apps/feed/src/app/[subdomain]/[slug]/page.tsx:1-32].
- `Container` is available and should wrap the page [apps/feed/src/components/global/container.tsx:12-35].
- Workspace requests listing, pagination, and board filter logic already exist for internal workspace routes:
  - `getWorkspacePosts` and `getWorkspacePostsCount` [apps/feed/src/lib/workspace.ts]
  - `RequestList` and `RequestPagination` [apps/feed/src/components/requests/RequestList.tsx, apps/feed/src/components/requests/RequestPagination.tsx]
  - `BoardsAction` filters out `roadmap` and `changelog` boards [apps/feed/src/components/requests/actions/BoardsAction.tsx]
- Public subdomain has only the root page; roadmap/changelog public routes are not yet implemented.

## Implementation Overview
We will add a layout and modular components under a `domain` namespace and update the page to assemble them. Server components will fetch data; client components will handle interactions.

## Files To Add
- `apps/feed/src/app/[subdomain]/[slug]/layout.tsx`
  - Server component; wraps children in `Container`
  - Fetches workspace (`id, name, slug, logo, domain`)
  - Renders `<DomainHeader workspace={...} subdomain={params.subdomain} />` and `{children}`

- `apps/feed/src/components/domain/DomainHeader.tsx`
  - Server component; props: `{ workspace, subdomain }`
  - Left: logo (`workspace.logo`) + name (`workspace.name`)
  - Center: nav links pointing to public paths: `/${subdomain}/${workspace.slug}` (Feedback), `/${subdomain}/${workspace.slug}/roadmap`, `/${subdomain}/${workspace.slug}/changelog`
  - Right: `Link` buttons to `/auth/sign-in` and `/auth/sign-up`
  - Wrapped in `Container` or rely on layout’s container; follows app header styles

- `apps/feed/src/components/domain/BoardsDropdown.tsx`
  - Client component; props: `{ slug: string, subdomain: string }`
  - Loads boards: `client.board.byWorkspaceSlug.$get({ slug })`
  - Excludes `roadmap` and `changelog` (by slug/type)
  - Reflects selected board from `useSearchParams()` (`board=<slug>`) and updates URL via router push/replace to `/${subdomain}/${slug}?board=<slug>` (resets `page=1`)

- `apps/feed/src/components/domain/PublicRequestPagination.tsx`
  - Client component; props: `{ subdomain: string, slug: string, page: number, pageSize: number, totalCount: number }`
  - Computes hrefs for Prev/Next using `/${subdomain}/${slug}?page=N` (preserves `board` if present)
  - Mirrors look-and-feel of `RequestPagination` without changing shared workspace URLs

- `apps/feed/src/components/domain/MainContent.tsx`
  - Server component composing the two-column layout
  - Left column: section header with `BoardsDropdown`, `RequestList` (with `linkBase=/${subdomain}/${slug}`), and `PublicRequestPagination`
  - Right column: reserved for domain sidebar (optional CTA and board list; can be a simple placeholder for now)

## Page Update
- Modify `apps/feed/src/app/[subdomain]/[slug]/page.tsx` to:
  - Parse `searchParams` → `page` (default 1), `board` (optional)
  - Fetch rows: `getWorkspacePosts(slug, { order: "newest", limit: PAGE_SIZE, offset, boardSlugs: board ? [board] : undefined })`
  - Fetch total: `getWorkspacePostsCount(slug, { boardSlugs: board ? [board] : undefined })`
  - Render `<MainContent subdomain={params.subdomain} slug={slug} items={rows} totalCount={...} page={...} pageSize={PAGE_SIZE} />`

## Routing & Links
- Public Feedback: `/${subdomain}/${slug}` (this page)
- Public Roadmap: `/${subdomain}/${slug}/roadmap` (planned follow-up route)
- Public Changelog: `/${subdomain}/${slug}/changelog` (planned follow-up route)
- Auth: `/auth/sign-in` and `/auth/sign-up`
- Request item links: `linkBase=/${subdomain}/${slug}` → `${base}/requests/{item.slug}` (follow-up to add public request details page)

## Styling & Patterns
- Reuse existing UI primitives and classes; follow the `Container` and header spacing conventions
- Grid layout: `lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-8` (left content flows; right fixed width)
- Maintain `dynamic = "force-dynamic"` on the page to keep DB-driven listing responsive to filters

## Verification Plan
- Manual: visit `/{subdomain}/{slug}` locally, verify:
  - Header renders logo/name, nav links, and auth buttons
  - List shows feedback with correct pagination for > PAGE_SIZE items
  - Board dropdown filters results and excludes Roadmap/Changelog
  - Pagination preserves selected board when navigating pages
- Code: ensure imports resolve (`@feedgot/api/client`, `getWorkspacePosts`), and no changes to shared workspace components

## Follow-Ups (Optional)
- Implement public `/${subdomain}/${slug}/roadmap` and `/changelog` pages to complete header links
- Add public `/${subdomain}/${slug}/requests/[postSlug]` details page so `RequestItem` links resolve

If this plan looks good, I’ll implement the components and page updates accordingly.