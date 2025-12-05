export function encodeCollapsedIds(ids: Iterable<string>): string {
  const list = Array.from(ids)
  return list.join(",")
}

