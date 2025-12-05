import { headers } from "next/headers"

export async function readInitialCollapsedCommentIds(postId: string): Promise<string[]> {
  const key = `cmc:${postId}`
  const cookieHeader = (await headers()).get("cookie") || ""
  const match = cookieHeader
    .split(";")
    .map((s) => s.trim())
    .find((s) => s.startsWith(`${key}=`))
  const encoded = match ? decodeURIComponent(match.split("=")[1] || "") : ""
  if (!encoded) return []
  return encoded.split(",").filter(Boolean)
}

