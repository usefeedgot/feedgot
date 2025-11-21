import Link from "next/link"
import { getServerSession } from "@feedgot/auth/session"
import { findFirstAccessibleWorkspaceSlug } from "@/lib/workspace"

export const dynamic = "force-dynamic"

export default async function NotFound() {
  const session = await getServerSession()
  let href = "/workspaces/new"
  if (session?.user) {
    const userId = session.user.id
    const slug = await findFirstAccessibleWorkspaceSlug(userId)
    if (slug) href = `/workspaces/${slug}`
  }
  return (
    <main className="min-h-screen grid place-items-center">
      <div className="mx-auto max-w-lg  text-center">
        <h1 className="text-3xl font-sans tracking-wider ">Whoops…</h1>
        <p className="text-accent mt-2 text-sm font-mono">
          Sorry, there's no such page. Go to your
          <Link
            href={href}
            className="ml-1 text-primary text-sm font-normal hover:text-primary"
            aria-label="Go to workspace"
          >
            workspace
          </Link>
          .
        </p>
      </div>
    </main>
  )
}