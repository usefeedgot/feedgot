## What’s Missing
- Subdomain pages (`apps/feed/src/app/[subdomain]/layout.tsx`) render the logo and use theme tokens, but never set workspace-specific CSS variables or theme.
- Workspace pages already set branding via `getBrandingColorsBySlug` + `BrandVarsEffect` (`apps/feed/src/app/workspaces/[slug]/layout.tsx:36–38`).

## Changes
1. Add a branding fetch helper
- Create `getBrandingBySlug(slug): { primary: string; theme: "light"|"dark"|"system" }` in `apps/feed/src/lib/workspace.ts` (near `getBrandingColorsBySlug` at `apps/feed/src/lib/workspace.ts:24–34`).
- Implementation: left-join `branding_config` to `workspace` and return `brandingConfig.primaryColor` and `brandingConfig.theme` with safe defaults (`#3b82f6`, `system`).

2. Apply branding on subdomain layout
- In `apps/feed/src/app/[subdomain]/layout.tsx:25–35`, fetch branding using `getBrandingBySlug(subdomain)` alongside current workspace query.
- Inject vars like workspace layout:
  - Inline `<style>` to set `--primary`, `--ring`, `--sidebar-primary` to `primary`.
  - Render `<BrandVarsEffect primary={primary} />` (`apps/feed/src/components/global/BrandVarsEffect.tsx:5–13`).
- Theme handling:
  - Wrap content in a div whose `className` is `theme === "dark" ? "dark" : undefined`.
  - Light and system → no class (default light tokens). (We can extend later to respect system using a provider, but not necessary for this fix.)

3. Keep API/UI consistent
- No UI changes needed: `DomainHeader` already uses semantic classes (`apps/feed/src/components/domain/DomainHeader.tsx`).
- Branding settings UI already persists `primaryColor` and `theme` (`apps/feed/src/lib/branding-service.ts:10–24`, `packages/api/src/router/branding.ts:49–56`).

## Verification
- Run the app and open a subdomain with a known branding (e.g., primary `#ff0000`, theme `light`).
- Confirm header, buttons, focus rings reflect red (via `--primary`, `--ring`) and page stays light.
- Flip theme to `dark` in Branding settings; reload subdomain → dark variables apply under the wrapper `dark` class.

## Notes
- No changes to workspace pages; they already set vars.
- Future improvement: introduce `next-themes` `ThemeProvider` to support `system` properly across the app.