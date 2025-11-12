import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { Container } from "@/components/global/container"
import DefinedTermJsonLd from "@/components/seo/DefinedTermJsonLd"
import FaqJsonLd from "@/components/seo/FaqJsonLd"
import { createPageMetadata } from "@/lib/seo"
import { getDefinitionBySlug, getAllDefinitionParams, getPrimarySlug } from "@/types/definitions"

export async function generateStaticParams() {
  return getAllDefinitionParams()
}

export async function generateMetadata({ params }: { params: Promise<{ term: string }> }): Promise<Metadata> {
  const { term } = await params
  const primary = getPrimarySlug(term)
  const def = primary ? getDefinitionBySlug(primary) : undefined
  if (!def) return {}
  const title = `${def.name} — Definition`
  const desc = def.short
  return createPageMetadata({ title, description: desc, path: `/definitions/${def.slug}` })
}

export default async function DefinitionPage({ params }: { params: Promise<{ term: string }> }) {
  const { term } = await params
  const primary = getPrimarySlug(term)
  if (!primary) return notFound()
  if (primary !== term) redirect(`/definitions/${primary}`)
  const def = getDefinitionBySlug(primary)
  if (!def) return notFound()

  return (
    <main className="min-h-screen pt-16">
      <Container maxWidth="6xl" className="px-4 sm:px-16 lg:px-20 xl:px-24">
        <section className="py-12 sm:py-16" data-component="DefinitionDetail">
          <div className="mx-auto w-full max-w-6xl px-0 sm:px-6">
            <p className="text-sm text-accent">Definition</p>
            <h1 className="text-balance text-3xl font-bold md:text-4xl lg:text-5xl mt-4">{def.name}</h1>
            <p className="text-accent mt-4 max-w-2xl">{def.short}</p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="rounded-xl border border-foreground/10 bg-white p-5 sm:p-6">
                <h2 className="text-foreground text-lg font-semibold">ELI5</h2>
                <p className="text-accent mt-2 text-sm sm:text-base leading-7">{def.eli5}</p>
              </div>
              <div className="rounded-xl border border-foreground/10 bg-white p-5 sm:p-6">
                <h2 className="text-foreground text-lg font-semibold">Practical</h2>
                <p className="text-accent mt-2 text-sm sm:text-base leading-7">{def.practical}</p>
              </div>
              <div className="rounded-xl border border-foreground/10 bg-white p-5 sm:p-6">
                <h2 className="text-foreground text-lg font-semibold">Expert</h2>
                <p className="text-accent mt-2 text-sm sm:text-base leading-7">{def.expert}</p>
              </div>
              {def.formula ? (
                <div className="rounded-xl border border-foreground/10 bg-white p-5 sm:p-6">
                  <h2 className="text-foreground text-lg font-semibold">{def.formula.title}</h2>
                  <p className="text-accent mt-2 text-sm sm:text-base leading-7">{def.formula.body}</p>
                  {def.formula.code ? (
                    <pre className="mt-4 rounded-md bg-foreground/5 p-4 text-sm text-foreground whitespace-pre-wrap">{def.formula.code}</pre>
                  ) : null}
                </div>
              ) : null}
              {def.example ? (
                <div className="rounded-xl border border-foreground/10 bg-white p-5 sm:p-6">
                  <h2 className="text-foreground text-lg font-semibold">{def.example.title}</h2>
                  <p className="text-accent mt-2 text-sm sm:text-base leading-7">{def.example.body}</p>
                </div>
              ) : null}
            </div>

            {def.related && def.related.length ? (
              <div className="mt-10">
                <h3 className="text-foreground text-base sm:text-lg font-semibold">Related terms</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {def.related.map((r) => (
                    <Link key={r} href={`/definitions/${r}`} className="inline-flex items-center rounded-md border border-foreground/10 bg-white px-3 py-1.5 text-sm text-foreground hover:shadow-sm">
                      {r}
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}

            {def.faqs && def.faqs.length ? (
              <div className="mt-12">
                <h2 className="text-foreground text-lg font-semibold">FAQs</h2>
                <div className="mt-4 space-y-4">
                  {def.faqs.map((f, i) => (
                    <div key={i} className="rounded-xl border border-foreground/10 bg-white p-5 sm:p-6">
                      <p className="text-foreground font-medium">{f.q}</p>
                      <p className="text-accent mt-2 text-sm sm:text-base leading-7">{f.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </section>
      </Container>
      <DefinedTermJsonLd name={def.name} description={def.short} path={`/definitions/${def.slug}`} alternateNames={def.synonyms} />
      {def.faqs && def.faqs.length ? <FaqJsonLd faqs={def.faqs} /> : null}
    </main>
  )
}