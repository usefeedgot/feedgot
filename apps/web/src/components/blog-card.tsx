import Link from "next/link"
import type { MarblePost } from "@/types/marble"
import { Card, CardContent } from "@feedgot/ui/components/card"

type BlogCardProps = {
  post: MarblePost
}

export function BlogCard({ post }: BlogCardProps) {
  const date = post.publishedAt ? new Date(post.publishedAt) : null
  return (
      <Card className="overflow-hidden">
        {post.coverImage ? (
          <div className="aspect-[16/9] w-full relative">
            <img src={post.coverImage} alt={post.title} className="absolute inset-0 h-full w-full object-cover" />
          </div>
        ) : null}
        <CardContent className="py-6">
          {date ? (
            <time className="text-xs text-muted-foreground" dateTime={date.toISOString()}>
              {date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
            </time>
          ) : (
            <span className="text-xs text-muted-foreground">Latest</span>
          )}
          <h3 className="mt-2 text-lg font-semibold">
            <Link href={`/blog/${post.slug}`} className="hover:underline">
              {post.title}
            </Link>
          </h3>
          {post.excerpt ? <p className="text-muted-foreground mt-2 line-clamp-3">{post.excerpt}</p> : null}
          <div className="mt-4">
            <Link href={`/blog/${post.slug}`} className="text-sm text-primary hover:underline">
              Read more
            </Link>
          </div>
        </CardContent>
      </Card>
  )
}