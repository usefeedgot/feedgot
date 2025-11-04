import { ComparisonFeature } from '@/config/alternatives'

function Check({ className = 'text-primary' }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      className={className}
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  )
}

function Cross({ className = 'text-muted-foreground' }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      className={className}
    >
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  )
}

function renderIcon(value: boolean | 'partial') {
  if (value === true) return <Check />
  if (value === 'partial') return <Check className="text-amber-500" />
  return <Cross />
}

export function FeatureComparisonTable({
  competitorName,
  features,
}: {
  competitorName: string
  features: ComparisonFeature[]
}) {
  return (
    <div className="mt-8 overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 pr-4 text-sm font-semibold">Feature</th>
            <th className="text-left py-3 px-4 text-sm font-semibold">{competitorName}</th>
            <th className="text-left py-3 px-4 text-sm font-semibold">Feedgot</th>
          </tr>
        </thead>
        <tbody>
          {features.map((f) => (
            <tr key={f.key} className="border-b last:border-0">
              <td className="py-3 pr-4 text-sm">{f.label}</td>
              <td className="py-3 px-4">{renderIcon(f.competitor)}</td>
              <td className="py-3 px-4">{renderIcon(f.feedgot)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-muted-foreground mt-2 text-xs">
        Partial indicates limited availability, tier restrictions, or third‑party workarounds.
      </p>
    </div>
  )
}