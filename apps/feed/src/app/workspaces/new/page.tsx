import type { Metadata } from "next"
import WorkspaceWizard from "@/components/workspaces/wizard/Wizard"
import { createPageMetadata } from "@/lib/seo"
import { redirect } from "next/navigation"
import { getServerSession } from "@feedgot/auth/session"
import { findFirstAccessibleWorkspaceSlug } from "@/lib/workspace"

export const dynamic = "force-dynamic"
export const metadata: Metadata = createPageMetadata({
  title: "New Project",
  description: "Create a new project in Feedgot.",
  path: "/workspaces/new",
  indexable: false,
})

export default async function NewWorkspacePage() {
  const session = await getServerSession()
  if (!session?.user) {
    redirect("/auth/sign-in?redirect=/workspaces/new")
  }
  const userId = session.user.id
  const slug = await findFirstAccessibleWorkspaceSlug(userId)
  if (slug) redirect(`/workspaces/${slug}`)

  return <WorkspaceWizard />
}
