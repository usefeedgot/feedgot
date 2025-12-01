## Problem
- Subdomain pages set only `--primary` variables and wrap content in a `div.dark`.
- Global styles apply background and foreground to `body` using CSS variables from `:root`.
- A `div.dark` does not affect `body` or `html`, so the page stays light.

## Solution Overview
1. Create `DomainThemeEffect` client component
- Toggles the `dark` class on `document.documentElement` (the `<html>` element) based on workspace branding theme.
- Supports `dark`, `light`, and `system`:
  - `dark`: add `html.dark`
  - `light`: remove `html.dark`
  - `system`: use `matchMedia('(prefers-color-scheme: dark)')` to set and listen for changes

2. Use in subdomain layout only
- Import and render `DomainThemeEffect` in `apps/feed/src/app/[subdomain]/layout.tsx` with `theme` from `getBrandingBySlug(subdomain)`.
- Keep workspace layout unchanged so workspace pages continue using default theme behavior.

3. Optional: domain.css for polish
- Add `apps/feed/src/app/[subdomain]/domain.css` to declare `html.dark { color-scheme: dark; }` for consistent scrollbars and form controls.
- Import `domain.css` in the subdomain layout.

## Verification
- Set a workspace to theme `dark` and a red primary; subdomain shows dark background and red accents.
- Switch to `light`; subdomain returns to light.
- Set `system`; subdomain follows OS preference and updates on OS changes.

## Notes
- This approach leaves workspace theme untouched, as requested.
- It uses existing CSS variables and dark variant definitions already present in `@feedgot/ui` styles.