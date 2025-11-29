import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { getSessionCookie } from "better-auth/cookies"
import { db, workspace } from "@feedgot/db"
import { eq } from "drizzle-orm"

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname
  const host = req.headers.get("host") || ""
  const hostNoPort = host.replace(/:\d+$/, "")
  const parts = hostNoPort.split(".")
  const isLocal = parts[parts.length - 1] === "localhost"
  const isMainDomain = hostNoPort.endsWith(".feedgot.com")
  const hasSub = (isLocal && parts.length >= 2) || (isMainDomain && parts.length >= 3)
  const subdomain = hasSub ? parts[0] : ""
  const reservedSubdomains = new Set(["www", "app"]) 

  if (subdomain && !reservedSubdomains.has(subdomain)) {
    const url = req.nextUrl.clone()
    url.pathname = `/subdomain/${subdomain}${pathname === "/" ? "" : pathname}`
    return NextResponse.rewrite(url)
  }

  if (!isMainDomain && hostNoPort.startsWith("feedback.")) {
    const baseHost = hostNoPort.replace(/^feedback\./, "")
    const protoDomain = `https://${baseHost}`
    try {
      const [wsByCustom] = await db
        .select({ slug: workspace.slug })
        .from(workspace)
        .where(eq(workspace.customDomain, hostNoPort))
        .limit(1)
      let targetSlug = wsByCustom?.slug
      if (!targetSlug) {
        const [wsByDomain] = await db
          .select({ slug: workspace.slug })
          .from(workspace)
          .where(eq(workspace.domain, protoDomain))
          .limit(1)
        targetSlug = wsByDomain?.slug
      }
      if (targetSlug) {
        if (pathname === "/") {
          const url = req.nextUrl.clone()
          url.pathname = `/workspaces/${targetSlug}`
          return NextResponse.rewrite(url)
        }
        return NextResponse.next()
      }
    } catch {}
  }

  const needsAuth = pathname.startsWith("/workspaces")
  if (needsAuth) {
    const cookie = getSessionCookie(req)
    if (!cookie) {
      const url = new URL("/auth/sign-in", req.url)
      url.searchParams.set("redirect", pathname)
      return NextResponse.redirect(url)
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: ["/", "/workspaces/:path*"],
}
