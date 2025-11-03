import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Container } from "@/components/global/container"
import { getCategoryBySlug, getToolBySlugs, getAllToolParams } from "@/types/tools"
import { TOOL_COMPONENTS } from "@/types/registry"
import ToolTemplate from "@/components/tools/template"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@feedgot/ui/components/breadcrumb"

type Props = { params: Promise<{ category: string; tool: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, tool: toolSlug } = await params
  const cat = getCategoryBySlug(category)
  const tool = getToolBySlugs(category, toolSlug)
  if (!cat || !tool) return { title: "Tool" }
  return {
    title: tool.name,
    description: tool.description,
  }
}
 
export default async function ToolPage({ params }: Props) {
  const { category, tool: toolSlug } = await params
  const tool = getToolBySlugs(category, toolSlug)
  if (!tool) return notFound()
  const ToolComponent = TOOL_COMPONENTS[category]?.[toolSlug]

  return (
    <main className="min-h-screen pt-16 bg-background">
      <Container maxWidth="6xl" className="px-4 sm:px-16 lg:px-20 xl:px-24">
        <section className="py-12 sm:py-16">
          <Breadcrumb className="mb-6">
            <BreadcrumbList className="text-zinc-500">
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/tools">Tools</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={`/tools/categories/${category}`}>{getCategoryBySlug(category)?.name ?? 'Category'}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{tool.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          {/* Page-level title and description omitted to avoid duplication; the tool component provides its own content. */}
          {ToolComponent ? <ToolComponent /> : <ToolTemplate tool={tool} />}
        </section>
      </Container>
    </main>
  )
}

export function generateStaticParams() {
  return getAllToolParams()
}