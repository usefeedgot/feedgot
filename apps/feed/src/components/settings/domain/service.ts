import { client } from "@feedgot/api/client"
import type { DomainInfo } from "./types"

export async function loadDomain(slug: string): Promise<{ info: DomainInfo; plan: string; defaultDomain: string }> {
  const res = await client.workspace.domainInfo.$get({ slug })
  const data = await res.json()
  return { info: (data?.domain || null) as DomainInfo, plan: data?.plan || "free", defaultDomain: data?.defaultDomain || "" }
}

export async function createDomain(slug: string, baseDomain: string): Promise<{ ok: boolean; message?: string }> {
  const res = await client.workspace.createDomain.$post({ slug, domain: `https://feedback.${baseDomain.trim()}` })
  let message: string | undefined
  try { const d = await res.json(); message = (d as any)?.message } catch {}
  return { ok: res.ok, message }
}

export async function verifyDomain(slug: string): Promise<{ ok: boolean; status?: string; cnameValid?: boolean; txtValid?: boolean; message?: string }> {
  const res = await client.workspace.verifyDomain.$post({ slug, checkDns: true })
  let status: string | undefined
  let cnameValid: boolean | undefined
  let txtValid: boolean | undefined
  try { const d = await res.json(); status = (d as any)?.status; cnameValid = (d as any)?.cnameValid; txtValid = (d as any)?.txtValid } catch {}
  return { ok: res.ok, status, cnameValid, txtValid }
}

export async function deleteDomain(slug: string): Promise<{ ok: boolean; message?: string }> {
  const res = await client.workspace.deleteDomain.$post({ slug })
  let message: string | undefined
  try { const d = await res.json(); message = (d as any)?.message } catch {}
  return { ok: res.ok, message }
}

