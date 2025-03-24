"use client"

import type React from "react"

interface ChartContainerProps {
  children: React.ReactNode
}

export function ChartContainer({ children }: ChartContainerProps) {
  return <div className="relative">{children}</div>
}

interface ChartProps {
  children: React.ReactNode
}

export function Chart({ children }: ChartProps) {
  return <div className="relative">{children}</div>
}

interface ChartTooltipProps {
  active?: boolean
  payload?: any[]
  label?: string
}

export function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length) return null

  return (
    <div className="bg-background border rounded-md shadow-md p-2">
      <p className="text-sm font-medium">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
          <p className="text-xs">
            {entry.name}: {entry.value}
          </p>
        </div>
      ))}
    </div>
  )
}

interface ChartLegendProps {
  payload?: any[]
}

export function ChartLegend({ payload }: ChartLegendProps) {
  if (!payload?.length) return null

  return (
    <ul className="flex flex-wrap gap-4 justify-center text-xs">
      {payload.map((entry) => (
        <li key={entry.value} className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
          <span>{entry.value}</span>
        </li>
      ))}
    </ul>
  )
}

export const ChartTooltipContent = ChartTooltip
export const ChartLegendContent = ChartLegend
export function ChartStyle({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

