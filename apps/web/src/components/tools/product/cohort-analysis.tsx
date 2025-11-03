"use client"

import { useMemo, useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@feedgot/ui/components/card"
import { Label } from "@feedgot/ui/components/label"
import { Input } from "@feedgot/ui/components/input"
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@feedgot/ui/components/chart"
import * as Recharts from "recharts"

type Cohort = {
  label: string
  size: number
  m1: number // retention % month 1
  m2: number // retention % month 2
  m3: number // retention % month 3
}

export default function CohortAnalysisTool() {
  const [cohorts, setCohorts] = useState<Cohort[]>([
    { label: "Jan", size: 120, m1: 70, m2: 55, m3: 45 },
    { label: "Feb", size: 100, m1: 68, m2: 52, m3: 42 },
    { label: "Mar", size: 90, m1: 72, m2: 58, m3: 47 },
  ])

  const update = (i: number, patch: Partial<Cohort>) =>
    setCohorts((prev) => prev.map((c, idx) => (idx === i ? { ...c, ...patch } : c)))

  const avgRetention = useMemo(() => {
    const count = cohorts.length || 1
    const avg = (key: keyof Omit<Cohort, "label" | "size">) =>
      cohorts.reduce((s, c) => s + (isFinite(c[key]) ? (c[key] as number) : 0), 0) / count
    return { m1: avg("m1"), m2: avg("m2"), m3: avg("m3") }
  }, [cohorts])

  const chartData = useMemo(() => {
    return [
      { month: "Month 1", retention: avgRetention.m1 },
      { month: "Month 2", retention: avgRetention.m2 },
      { month: "Month 3", retention: avgRetention.m3 },
    ]
  }, [avgRetention])

  const formatPct = (n: number) => `${n.toFixed(0)}%`

  return (
    <div>
      <div className="prose prose-sm sm:prose-base prose-zinc dark:prose-invert mt-6">
        <h2>Cohort retention analysis</h2>
        <p>
          Analyze retention by signup month. Enter cohort size and retention percentages for the next three months. The
          chart shows average retention across cohorts and the table provides a simple retention matrix.
        </p>
        <p>
          Retention rate is <code>(active users at period ÷ original cohort size) × 100%</code>.
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Cohort inputs</CardTitle>
            <CardDescription>Size and retention percentages.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cohorts.map((c, i) => (
                <div key={i} className="grid grid-cols-2 sm:grid-cols-5 gap-3 items-end">
                  <div>
                    <Label htmlFor={`label-${i}`}>Label</Label>
                    <Input id={`label-${i}`} value={c.label} onChange={(e) => update(i, { label: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor={`size-${i}`}>Cohort size</Label>
                    <Input
                      id={`size-${i}`}
                      type="number"
                      min={0}
                      value={isFinite(c.size) ? c.size : 0}
                      onChange={(e) => update(i, { size: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`m1-${i}`}>M1 %</Label>
                    <Input
                      id={`m1-${i}`}
                      type="number"
                      min={0}
                      max={100}
                      value={isFinite(c.m1) ? c.m1 : 0}
                      onChange={(e) => update(i, { m1: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`m2-${i}`}>M2 %</Label>
                    <Input
                      id={`m2-${i}`}
                      type="number"
                      min={0}
                      max={100}
                      value={isFinite(c.m2) ? c.m2 : 0}
                      onChange={(e) => update(i, { m2: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`m3-${i}`}>M3 %</Label>
                    <Input
                      id={`m3-${i}`}
                      type="number"
                      min={0}
                      max={100}
                      value={isFinite(c.m3) ? c.m3 : 0}
                      onChange={(e) => update(i, { m3: Number(e.target.value) })}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Average retention</CardTitle>
            <CardDescription>Across all cohorts.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer id="cohort-retention" config={{ retention: { label: "Retention" } }}>
              <Recharts.ResponsiveContainer width="100%" height={220}>
                <Recharts.LineChart data={chartData} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
                  <Recharts.CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <Recharts.XAxis dataKey="month" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                  <Recharts.YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Recharts.Line type="monotone" dataKey="retention" stroke="#0ea5e9" strokeWidth={2} dot={{ r: 2 }} />
                  <ChartLegend content={<ChartLegendContent />} />
                </Recharts.LineChart>
              </Recharts.ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Retention matrix</CardTitle>
            <CardDescription>Users retained by cohort and month.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-muted-foreground">
                    <th className="text-left font-medium pr-4">Cohort</th>
                    <th className="text-left font-medium pr-4">Size</th>
                    <th className="text-left font-medium pr-4">M1</th>
                    <th className="text-left font-medium pr-4">M2</th>
                    <th className="text-left font-medium pr-4">M3</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {cohorts.map((c, i) => {
                    const m1c = Math.round((c.size * c.m1) / 100)
                    const m2c = Math.round((c.size * c.m2) / 100)
                    const m3c = Math.round((c.size * c.m3) / 100)
                    const cell = (pct: number) => (
                      <td className="py-2 pr-4">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-24 rounded-full bg-zinc-200 overflow-hidden">
                            <div className="h-full bg-sky-600" style={{ width: `${Math.min(Math.max(pct, 0), 100)}%` }} />
                          </div>
                          <span className="font-mono tabular-nums">{formatPct(pct)}</span>
                        </div>
                      </td>
                    )
                    return (
                      <tr key={i}>
                        <td className="py-2 pr-4">{c.label}</td>
                        <td className="py-2 pr-4">{c.size.toLocaleString()}</td>
                        {cell(c.m1)}
                        {cell(c.m2)}
                        {cell(c.m3)}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}