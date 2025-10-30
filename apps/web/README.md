## Landing page

This is the codebase for the landing page.

### Blog (Marble CMS)

The blog is integrated with Marble CMS.

Setup:
- Copy `.env.example` to `.env.local` and set `MARBLE_WORKSPACE_KEY`.
- Optional: adjust `MARBLE_API_URL` and `MARBLE_WORKSPACE_ID`.

Pages:
- `/blog` – lists posts from Marble.
- `/blog/[slug]` – renders a single post with typography.

Styling:
- Uses Tailwind v4 with `@tailwindcss/typography` via `@plugin` in `globals.css`.