import type { Metadata } from "next"
import CreateProjectForm from "@/components/projects/CreateForm"
import { createPageMetadata } from "@/lib/seo"

export const metadata: Metadata = createPageMetadata({
  title: "New Project",
  description: "Create a new project in Feedgot.",
  path: "/projects/new",
  indexable: false,
})

export default function NewProjectPage() {
  return (
    <section className="min-h-screen flex items-center">
      <div className="w-full">
        <CreateProjectForm />
      </div>
    </section>
  )
}
