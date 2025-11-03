"use client"

import { useMemo, useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@feedgot/ui/components/card"
import { Label } from "@feedgot/ui/components/label"
import { Input } from "@feedgot/ui/components/input"
import { Badge } from "@feedgot/ui/components/badge"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@feedgot/ui/components/chart"
import * as Recharts from "recharts"

type Cohort = { label: string; size: number; adopted: number }

export default function FeatureAdoptionTool() {
  const [cohorts, setCohorts] = useState<Cohort[]>([
    { label: "This month", size: 100, adopted: 45 },
    { label: "Last month", size: 80, adopted: 32 },
    { label: "Two months ago", size: 60, adopted: 21 },
  ])

  const totals = useMemo(() => {
    const size = cohorts.reduce((s, c) => s + (isFinite(c.size) ? c.size : 0), 0)
    const adopted = cohorts.reduce((s, c) => s + (isFinite(c.adopted) ? c.adopted : 0), 0)
    const rate = size > 0 ? (adopted / size) * 100 : 0
    const status = rate >= 40 ? "Strong" : rate >= 20 ? "Moderate" : "Low"
    return { size, adopted, rate, status }
  }, [cohorts])

  const chartData = useMemo(() => {
    const notAdopted = Math.max(totals.size - totals.adopted, 0)
    return [
      { name: "Adopted", value: totals.adopted },
      { name: "Not adopted", value: notAdopted },
    ]
  }, [totals])

  const updateCohort = (idx: number, patch: Partial<Cohort>) => {
    setCohorts((prev) => prev.map((c, i) => (i === idx ? { ...c, ...patch } : c)))
  }

  const formatPct = (n: number) => `${n.toFixed(1)}%`

  return (
    <div>
      <div className="prose prose-sm sm:prose-base prose-zinc dark:prose-invert mt-6">
        <h2>Feature adoption calculator</h2>
        <p>
          Measure how many eligible users adopt a new feature across cohorts. Adoption rate is
          <code>adopters ÷ eligible users × 100%</code>. Use cohort inputs below to see overall adoption and
          per‑cohort performance.
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Cohort inputs</CardTitle>
            <CardDescription>Enter cohort size and adopters.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cohorts.map((c, i) => (
                <div key={i} className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <Label htmlFor={`label-${i}`}>Label</Label>
                    <Input
                      id={`label-${i}`}
                      value={c.label}
                      onChange={(e) => updateCohort(i, { label: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`size-${i}`}>Cohort size</Label>
                    <Input
                      id={`size-${i}`}
                      type="number"
                      min={0}
                      value={isFinite(c.size) ? c.size : 0}
                      onChange={(e) => updateCohort(i, { size: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`adopted-${i}`}>Adopted</Label>
                    <Input
                      id={`adopted-${i}`}
                      type="number"
                      min={0}
                      value={isFinite(c.adopted) ? c.adopted : 0}
                      onChange={(e) => updateCohort(i, { adopted: Number(e.target.value) })}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="justify-between">
            <div className="text-sm text-zinc-500">
              Overall adoption <span className="font-mono ml-1 text-foreground">{formatPct(totals.rate)}</span>
            </div>
            <Badge variant="outline">{totals.status}</Badge>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Adoption distribution</CardTitle>
            <CardDescription>Adopted vs not adopted.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              id="feature-adoption"
              config={{ adopted: { label: "Adopted" }, not: { label: "Not adopted" } }}
              className="mx-auto max-w-sm"
            >
              <Recharts.ResponsiveContainer width="100%" height={220}>
                <Recharts.PieChart>
                  <ChartTooltip cursor={false} content={<ChartTooltipContent hideIndicator />} />
                  <Recharts.Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={50}
                    outerRadius={95}
                    paddingAngle={2}
                  >
                    {chartData.map((entry, index) => (
                      <Recharts.Cell
                        key={`cell-${index}`}
                        fill={index === 0 ? "#16a34a" : "#e5e7eb"}
                      />
                    ))}
                  </Recharts.Pie>
                </Recharts.PieChart>
              </Recharts.ResponsiveContainer>
            </ChartContainer>
          </CardContent>
          <CardFooter>
            <div className="text-xs text-muted-foreground">{totals.adopted.toLocaleString()} adopted of {totals.size.toLocaleString()} eligible</div>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Per‑cohort performance</CardTitle>
            <CardDescription>Quick snapshot of adoption by cohort.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {cohorts.map((c, i) => {
                const rate = c.size > 0 ? (c.adopted / c.size) * 100 : 0
                return (
                  <div key={i} className="grid gap-3 sm:grid-cols-[1fr_auto] items-center">
                    <div className="min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium truncate">{c.label}</span>
                        <span className="text-xs text-muted-foreground">{c.adopted.toLocaleString()} / {c.size.toLocaleString()}</span>
                      </div>
                      <div className="h-2 mt-2 bg-zinc-200 rounded-full overflow-hidden">
                        <div className="h-full bg-green-600" style={{ width: `${Math.min(Math.max(rate, 0), 100)}%` }} />
                      </div>
                    </div>
                    <span className="text-sm font-mono tabular-nums">{formatPct(rate)}</span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}