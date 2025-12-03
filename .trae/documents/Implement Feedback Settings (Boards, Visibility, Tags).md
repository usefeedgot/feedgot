## Overview
- Build a full "Feedback" settings section, modeled on Changelog settings, to manage feedback boards and related options.
- Show all board properties backed by DB schema (`packages/db/schema/feedback.ts:16`) and expose toggles and visibility controls.
- Include a Tags block (workspace tags) and use collapsible sections (accordion) so each part is neatly "unfolded" per section.

## Backend API
- Extend Board router to support feedback settings:
  - Add `GET /api/board/settingsByWorkspaceSlug` returning full board settings for a workspace including: `id`, `name`, `slug`, `isPublic`, `isVisible`, `isActive`, `allowAnonymous`, `requireApproval`, `allowVoting`, `allowComments`, `hidePublicMemberIdentity`, `sortOrder`, and `postCount`. Base off existing list in `packages/api/src/router/board.ts:15` and enrich fields.
  - Add `POST /api/board/updateSettings` to update a subset of fields for a given board (identified by `slug`), with permission checks similar to `changelog.toggleVisibility` (`packages/api/src/router/changelog.ts:50`).
  - Keep existing endpoints (boards list, tags list) intact (`packages/api/src/router/board.ts:15,222`).

## Frontend UI
- Replace `ComingSoon` in `FeedbackSection` with a complete UI:
  - File: `apps/feed/src/components/settings/feedback/Feedback.tsx:5`.
  - Use `SectionCard` for structure (`apps/feed/src/components/settings/global/SectionCard.tsx:3`).
  - Use `@feedgot/ui/components/accordion` to create collapsible sections ("unfolder"):
    - Section: Visibility — table of boards with a `Switch` to toggle `isVisible`.
    - Section: Board Settings — an accordion item per board with switches for: `isPublic`, `allowAnonymous`, `requireApproval`, `allowVoting`, `allowComments`, `hidePublicMemberIdentity`.
    - Section: Tags — list workspace tags with counts via `client.board.tagsByWorkspaceSlug.$get` (`apps/feed/src/components/requests/actions/TagsAction.tsx:21`). If later needed, we can add tag CRUD; for now display and count.
  - Use React Query for data fetch and optimistic updates mirroring `ChangelogSection` (`apps/feed/src/components/settings/changelog/Changelog.tsx:41,81`).
  - Use UI components consistent with Changelog: `Switch`, `Table`, `Button`, `Popover` from `@feedgot/ui`.

## Data Loading
- Pass `slug` into `FeedbackSection` from server:
  - Update `SettingsServer` to render `<FeedbackSection slug={slug} />` (`apps/feed/src/components/settings/global/SettingsServer.tsx:62-64`).
  - Extend `getSettingsInitialData` to include `initialBoards` populated from DB (`apps/feed/src/lib/workspace.ts:486`) using `board` table fields and post counts, and pass through `SettingsServer` into `FeedbackSection` as initial data.
  - Client-side: fetch boards via the new `client.board.settingsByWorkspaceSlug.$get({ slug })` for current values and keep them in sync.

## UX Details
- Collapsible (accordion) per section for clean layout and quick scanning.
- Inline toasts for success/error, following patterns in `ChangelogSection` (`apps/feed/src/components/settings/changelog/Changelog.tsx:100,117`).
- Disable switches while a save request is in-flight; revert on error.
- Show per-board post counts in the Visibility table.

## Security & Permissions
- Reuse permission checks like Changelog visibility (`packages/api/src/router/changelog.ts:60-71`), allowing owners/admins or members with `canManageBoards` to update board settings.

## Verification
- Manual test: open `/workspaces/[slug]/settings/feedback` (`apps/feed/src/app/workspaces/[slug]/settings/[section]/page.tsx:22`) and verify:
  - Boards render and toggles reflect DB values.
  - Toggling visibility and other switches updates DB and UI (optimistic + refetch).
  - Tags list loads with counts.
- No changes to public requests UI; this is a settings-only enhancement.

## Files to Change
- `packages/api/src/router/board.ts` — add settings endpoints (read/update).
- `apps/feed/src/lib/workspace.ts` — extend `getSettingsInitialData` to include feedback boards.
- `apps/feed/src/components/settings/global/SettingsServer.tsx` — pass `slug` and initial boards into `FeedbackSection`.
- `apps/feed/src/components/settings/feedback/Feedback.tsx` — implement full UI with accordion, switches, tables.

If this plan looks good, I’ll implement the API additions and the UI, wire data flows, and validate end-to-end.