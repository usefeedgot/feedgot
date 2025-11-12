import type { Metadata } from "next"
import Link from "next/link"
import { Container } from "@/components/global/container"
import { createPageMetadata } from "@/lib/seo"
import { DEFINITIONS } from "@/types/definitions"

export const metadata: Metadata = createPageMetadata({
  title: "SaaS Metrics & Definitions",
  description: "Plain‑English definitions for core SaaS metrics, pricing, and finance.",
  path: "/definitions",
})

export default function DefinitionsIndexPage() {
  const items = [...DEFINITIONS].sort((a, b) => a.name.localeCompare(b.name))
  return (
    <main className="min-h-screen pt-16">
      <Container maxWidth="6xl" className="px-4 sm:px-16 lg:px-20 xl:px-24">
        <section className="py-12 sm:py-16" data-component="DefinitionsIndex">
          <div className="mx-auto w-full max-w-6xl px-0 sm:px-6">
            <p className="text-sm text-accent">Glossary • {items.length} terms</p>
            <h1 className="text-balance text-3xl font-bold md:text-4xl lg:text-5xl mt-4">SaaS Metrics Encyclopedia</h1>
            <p className="text-accent mt-4 max-w-2xl">Short, practical definitions with formulas and examples. Each term links to tools and related concepts.</p>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {items.map((d) => (
                <Link key={d.slug} href={`/definitions/${d.slug}`} className="group relative rounded-xl border border-foreground/10 bg-white p-5 sm:p-6 transition-shadow hover:shadow-sm">
                  <div className="space-y-1">
                    <h3 className="text-foreground text-base sm:text-lg font-medium">{d.name}</h3>
                    <p className="text-accent text-sm sm:text-base leading-7">{d.short}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </Container>
    </main>
  )
}