import { NextResponse } from "next/server"
import { getWorkspaceStatusCounts } from "@/lib/workspace"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const slug = url.searchParams.get("slug") || ""
  if (!slug) return NextResponse.json({ error: "Missing slug" }, { status: 400 })
  const counts = await getWorkspaceStatusCounts(slug)
  return NextResponse.json({ counts })
}

