import Link from 'next/link'
import { Container } from '@/components/global/container'
import { alternatives } from '@/config/alternatives'
import { createPageMetadata } from '@/lib/seo'

export const metadata = createPageMetadata({
  title: 'Alternatives — Compare Feedgot with Canny, Featurebase, Nolt, Upvoty, UserJot',
  description:
    'Side‑by‑side comparisons covering features, privacy, and hosting differences to help you choose confidently.',
  path: '/alternatives',
})

export default function AlternativesIndexPage() {
  return (
    <Container maxWidth="6xl" className="px-4 sm:px-16 lg:px-20 xl:px-24">
      <section className="pt-10 md:pt-16">
        <div className="max-w-3xl">
          <h1 className="text-balance text-3xl sm:text-4xl lg:text-5xl font-bold">Alternatives</h1>
          <p className="text-muted-foreground mt-4 text-base sm:text-lg">
            Compare Feedgot with similar products. Each page highlights key features, privacy, and hosting differences.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {alternatives.map((alt) => (
            <Link
              key={alt.slug}
              href={`/alternatives/${alt.slug}`}
              className="block rounded-lg border border-border p-4 hover:border-foreground transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">{alt.name} vs Feedgot</span>
                <span className="text-xs text-muted-foreground">Compare</span>
              </div>
              {alt.summary && (
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{alt.summary}</p>
              )}
            </Link>
          ))}
        </div>
      </section>
    </Container>
  )
}