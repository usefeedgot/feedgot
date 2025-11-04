export function ProsCons({ pros = [], cons = [] }: { pros?: string[]; cons?: string[] }) {
  if (!pros.length && !cons.length) return null
  return (
    <div className="grid gap-6 sm:grid-cols-2 mt-10">
      {pros.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold">Strengths</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {pros.map((p, i) => (
              <li key={i} className="text-muted-foreground">• {p}</li>
            ))}
          </ul>
        </div>
      )}
      {cons.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold">Considerations</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {cons.map((c, i) => (
              <li key={i} className="text-muted-foreground">• {c}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}