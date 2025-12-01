## Overview
- Add a modal-based auth UI on subdomain pages and sync login state across main domain and all subdomains using Better Auth’s cross-subdomain cookies.
- Keep cookies httpOnly and secure, enable CSRF and HTTPS, and show robust loading, validation, and error states.

## Files to Add
- apps/feed/src/components/domain/DomainAuthModal.tsx
  - Centered modal built with `@feedgot/ui/components/dialog` + `@feedgot/ui/components/tabs`.
  - Contains both Sign In and Sign Up, reusing existing forms: `apps/feed/src/components/auth/SignIn.tsx` and `apps/feed/src/components/auth/SignUp.tsx`.
  - Controls: `open`, `onOpenChange`, internal tab state (`sign-in` | `sign-up`).
  - Loading via `apps/feed/src/components/global/loading-button.tsx` where applicable.

## Files to Modify
- packages/auth/src/auth.ts
  - Enable cross-subdomain cookie sharing and secure cookies:
    - `advanced.useSecureCookies: true`
    - `advanced.crossSubDomainCookies: { enabled: true, domain: ROOT_DOMAIN }` (e.g., `example.com`)
  - Configure `trustedOrigins` to include main app and subdomains (wildcards):
    - `["https://app.example.com", "https://*.example.com"]` (use full protocol prefixes)
  - Keep existing `toNextJsHandler(auth)` integration at `apps/feed/src/app/api/auth/[...all]/route.ts` as-is for CSRF and session routing.

- packages/auth/src/client.ts
  - Ensure `baseURL` points to the main app domain (`process.env.NEXT_PUBLIC_APP_URL`) so subdomains use the centralized auth API.

- apps/feed/src/components/domain/DomainHeader.tsx
  - Replace Sign In/Sign Up Links with modal triggers:
    - Mobile: lines `apps/feed/src/components/domain/DomainHeader.tsx:65`, `:73`
    - Desktop: lines `apps/feed/src/components/domain/DomainHeader.tsx:160`, `:168`
  - Add local state: `{ isAuthOpen, authMode }` and render `<DomainAuthModal open={isAuthOpen} mode={authMode} ... />`.
  - Read session and show authenticated UI (avatar + dropdown + dashboard button) when signed in, else show auth buttons.
  - Use `authClient.getSession()` or `authClient.useSession()` from `packages/auth/src/client.ts` for reactive status; show a small skeleton while verifying.

## Authentication UI Components
- DomainAuthModal
  - Header with Tabs: `Sign In` | `Sign Up` using `@feedgot/ui/components/tabs`.
  - Body renders existing forms:
    - Sign In: `apps/feed/src/components/auth/SignIn.tsx`
    - Sign Up: `apps/feed/src/components/auth/SignUp.tsx`
  - Validation: reuse `@feedgot/auth/password` helpers already used in Sign Up; show inline errors returned by `authClient` handlers.
  - Loading & error: leverage `LoadingButton` and error displays already present in the forms.

## Session Synchronization
- Better Auth cookie config
  - `advanced.crossSubDomainCookies.enabled: true` and `domain: ROOT_DOMAIN` to share cookies across all subdomains.
  - `advanced.useSecureCookies: true` to force `Secure` in all environments (or at least production).
  - `trustedOrigins` includes main and subdomains (with wildcards) so the centralized API accepts requests from subdomains.
- Verification
  - In `DomainHeader`, on mount, call `authClient.getSession()` and display loading until resolved.
  - Use `authClient.useSession()` for refetch-on-focus and reactive updates; cookies shared across subdomains ensure the session token is seen everywhere.
  - Optional: add a lightweight `BroadcastChannel` to publish `login/logout` events so other tabs update immediately; the cookie remains the source of truth.

## Authenticated State UI
- Replace auth buttons with profile UI when signed in:
  - Avatar + dropdown using existing `apps/feed/src/components/account/UserDropdown.tsx` (sign out included).
  - Dashboard button linking to main app (`process.env.NEXT_PUBLIC_APP_URL + "/start"`), placed adjacent to the avatar.

## Security
- Cookies: httpOnly and Secure; configured in `packages/auth/src/auth.ts` (`advanced.useSecureCookies`, `crossSubDomainCookies`).
- CSRF: rely on Better Auth’s Next.js handler (`apps/feed/src/app/api/auth/[...all]/route.ts`) which ships CSRF protection, plus `trustedOrigins` to constrain origins.
- HTTPS: ensure deployments serve HTTPS on both main and subdomains; cookies with `Secure` require HTTPS.
- CORS: match the `trustedOrigins` list to your actual domains; include protocol prefixes.

## Loading States
- Buttons use `LoadingButton` for async actions.
- DomainHeader shows a small skeleton/spinner while `useSession` is resolving.
- Prevent double-submits via disabled states during auth requests.

## Testing
- Tabs/windows persistence: open multiple tabs and verify session appears simultaneously using `authClient.getSession()`.
- Subdomain sync: sign in on `app.example.com`, confirm immediate session on `foo.example.com` and `bar.example.com`.
- Cookie lifecycle: verify expiration and renewal (refresh token/session rotation if configured) via `apps/feed/src/components/account/Security.tsx` session list.
- Mobile responsiveness: validate modal, tabs, and header on small screens; compare with patterns from `AddDomainDialog.tsx`.

## Notes & References
- DomainHeader is injected in subdomain layout: `apps/feed/src/app/[subdomain]/layout.tsx:47`.
- Existing auth flows/components:
  - Sign In: `apps/feed/src/components/auth/SignIn.tsx`
  - Sign Up: `apps/feed/src/components/auth/SignUp.tsx`
  - Verify Email: `apps/feed/src/components/auth/verify.tsx`
  - Password Reset: `apps/feed/src/components/auth/ForgotPassword.tsx`
- Middleware and SSR protections already use Better Auth cookies and helpers; no changes needed for redirects.

## Outcome
- Users authenticate via a unified modal on subdomains; session is shared across main and subdomains via secure httpOnly cookies; headers reflect authenticated state consistently with dropdown and dashboard access.
