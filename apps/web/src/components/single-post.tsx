import Link from "next/link"
import { Button } from "@feedgot/ui/components/button"
import { Prose } from "@/components/prose"
import type { MarblePost } from "@/types/marble"

type SinglePostProps = {
  post: MarblePost
  backHref?: string
  showBack?: boolean
}

function estimateReadingTime(html?: string | null) {
  if (!html) return null
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ")
  const words = text.trim().split(" ").filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

export function SinglePost({ post, backHref = "/blog", showBack = true }: SinglePostProps) {
  const date = post.publishedAt ? new Date(post.publishedAt) : null
  const reading = estimateReadingTime(post.content)

  return (
    <article className="py-16 md:py-24">
      {showBack ? (
        <div className="mb-6">
          <Button asChild variant="outline" size="sm">
            <Link href={backHref}>Back to Blog</Link>
          </Button>
        </div>
      ) : null}

      <header className="mb-6 text-left">
        <h1 className="text-foreground text-3xl md:text-4xl font-bold">{post.title}</h1>
        {post.excerpt ? <p className="text-muted-foreground mt-3">{post.excerpt}</p> : null}
        {date ? (
          <div className="text-xs text-muted-foreground mt-3">
            <time dateTime={date.toISOString()}>
              {date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
            </time>
            {reading ? <span> • {reading} min read</span> : null}
          </div>
        ) : null}
      </header>

      {post.coverImage ? (
        <div className="mb-8 overflow-hidden rounded-lg border">
          <img
            src={post.coverImage}
            alt={post.title}
            className="aspect-[16/9] w-full object-cover"
          />
        </div>
      ) : null}

      <div className="text-left">
        <Prose html={post.content ?? undefined} />
      </div>
    </article>
  )
}