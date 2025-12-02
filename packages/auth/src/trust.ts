import { db, workspace, workspaceDomain } from "@feedgot/db"
import { eq, and } from "drizzle-orm"

function toRegex(originPattern: string): RegExp | null {
  try {
    const trimmed = originPattern.trim()
    if (!trimmed) return null
    const hasWildcard = trimmed.includes("*")
    if (!hasWildcard) return new RegExp(`^${trimmed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`)
    const esc = trimmed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\\\*/g, "[^.]+")
    return new RegExp(`^${esc}$`)
  } catch {
    return null
  }
}

export async function isTrustedOrigin(origin: string): Promise<boolean> {
  const raw = process.env.AUTH_TRUSTED_ORIGINS || ""
  const patterns = raw.split(",").map((s) => s.trim()).filter(Boolean)
  for (const p of patterns) {
    const r = toRegex(p)
    if (r && r.test(origin)) return true
  }
  try {
    const u = new URL(origin)
    const host = u.hostname
    if (!host) return false
    const [byDefault] = await db.select({ id: workspace.id }).from(workspace).where(eq(workspace.domain, host)).limit(1)
    if (byDefault?.id) return true
    const [byCustom] = await db.select({ id: workspace.id }).from(workspace).where(eq(workspace.customDomain, host)).limit(1)
    if (byCustom?.id) return true
    const [verified] = await db.select({ status: workspaceDomain.status }).from(workspaceDomain).where(and(eq(workspaceDomain.host, host), eq(workspaceDomain.status, "verified"))).limit(1)
    if (verified?.status === "verified") return true
  } catch {}
  return false
}

export function corsHeaders(origin: string): HeadersInit {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "content-type, authorization, x-requested-with",
  }
}

export async function buildTrustedOrigins(request: Request): Promise<string[]> {
  const raw = process.env.AUTH_TRUSTED_ORIGINS || ""
  const list = raw.split(",").map((s) => s.trim()).filter(Boolean)
  const origin = request.headers.get("origin") || ""
  if (origin && (await isTrustedOrigin(origin))) list.push(origin)
  return Array.from(new Set(list))
}

