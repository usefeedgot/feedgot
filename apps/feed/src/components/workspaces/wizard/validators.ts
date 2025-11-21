import { z } from "zod"

const validTlds = new Set([
  "com","net","org","io","co","ai","app","dev","gg","xyz","me","us","uk","ca","de","fr","it","es","nl","br","in","jp","ru","ch","se","no","fi","pl","cz","sk","id","au","nz","be","dk","pt","gr","mx","za","ar","tw","kr","hk","sg","ie","il","at","tr","sa","ua","vn","ph","th","my","cl","pe","uy","lu","li","ro","bg","hu","lt","lv","ee","rs","ba","md","ge","am","az","by","kz","uz","tm","tj","kg","pa","do","cr","gt","hn","ni","jm","tt","pr","ae","qa","kw","om","bh","eg","ma","tn","dz"
])

export const cleanSlug = (v: string) => v.toLowerCase().replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-")
export const slugifyFromName = (name: string) => cleanSlug(name.toLowerCase().trim().replace(/\s+/g, "-"))

export const isDomainValid = (domain: string) => {
  const v = domain.trim().toLowerCase()
  const m = v.match(/^([a-z0-9.-]+)\.([a-z]{2,})$/i)
  if (!m) return false
  return m[2] ? validTlds.has(m[2]) : false
}

export const suggestDomainFix = (domain: string) => {
  const v = domain.trim().toLowerCase()
  const m = v.match(/^(.*)\.([a-z]{2,})$/i)
  if (!m) return null
  const t = m[2]
  if (t === "kom" || t === "con" || t === "cpm" || t === "cm") return `${m[1]}.com`
  return null
}

export const isNameValid = (name: string) => z.string().min(1).safeParse(name.trim()).success

export const isSlugValid = (slug: string) => z.string().min(5).regex(/^[a-z0-9-]+$/).safeParse(slug.trim()).success

export const isTimezoneValid = (tz: string) => z.string().min(1).safeParse(String(tz)).success

export const workspaceSchema = z.object({
  name: z.string().min(1),
  domain: z.string().min(1).refine(isDomainValid),
  slug: z.string().min(5).regex(/^[a-z0-9-]+$/),
  timezone: z.string().min(1),
})