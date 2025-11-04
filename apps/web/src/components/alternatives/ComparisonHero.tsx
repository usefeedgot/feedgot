import Link from 'next/link'
import { Container } from '@/components/global/container'

export function ComparisonHero({
  name,
  website,
  summary,
  tags,
}: {
  name: string
  website?: string
  summary?: string
  tags?: string[]
}) {
  return (
    <Container maxWidth="6xl" className="px-4 sm:px-16 lg:px-20 xl:px-24">
      <section className="pt-10 md:pt-16">
        <div className="max-w-3xl">
          <h1 className="text-balance text-3xl sm:text-4xl lg:text-5xl font-bold">
            {name} vs Feedgot
          </h1>
          {summary && (
            <p className="text-muted-foreground mt-4 text-base sm:text-lg">
              {summary}
            </p>
          )}
          {tags && tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {tags.map((t, i) => (
                <span
                  key={i}
                  className="rounded-md bg-accent px-2 py-1 text-xs text-muted-foreground"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
          <div className="mt-4 flex items-center gap-3 text-sm">
            {website && (
              <Link
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-500 hover:text-foreground"
              >
                Visit {name}
              </Link>
            )}
            <span className="text-accent">|</span>
            <Link href="/signup" className="text-zinc-500 hover:text-foreground">
              Try Feedgot free
            </Link>
          </div>
        </div>
      </section>
    </Container>
  )
}