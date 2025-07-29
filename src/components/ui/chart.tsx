"use client"

import {
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
} from "recharts"
import { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { type ValueType, type NameType } from "recharts/types/component/DefaultTooltipContent"

export interface ChartConfig {
  [key: string]: {
    label: string
    color: string
  }
}

export function ChartContainer({
  children,
  className,
  config,
}: {
  children: ReactNode
  className?: string
  config: ChartConfig
}) {
  return (
    <div
      className={cn(
        "w-full h-[300px] rounded-md border bg-muted/50 p-4",
        className
      )}
      style={
        {
          "--chart-1": config?.desktop?.color ?? "#6366f1",
          "--color-desktop": config?.desktop?.color ?? "#6366f1",
        } as React.CSSProperties
      }
    >
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  )
}

export function ChartTooltip({
  content,
  cursor,
}: {
  content: ReactNode
  cursor?: boolean
}) {
  return (
    <Tooltip
      content={content}
      cursor={cursor}
      wrapperStyle={{
        backgroundColor: "transparent",
      }}
      contentStyle={{
        backgroundColor: "transparent",
        border: "none",
        borderRadius: 0,
        boxShadow: "none",
        padding: 0,
      }}
    />
  )
}


export function ChartTooltipContent({
  active,
  payload,
  label,
  hideLabel,
}: TooltipProps<ValueType, NameType> & {
  hideLabel?: boolean
}) {
  if (!active || !payload || payload.length === 0) {
    return null
  }

  return (
  <div className="bg-transparent p-0 m-0 rounded-none shadow-none">
    {!hideLabel && (
      <p className="text-[0.7rem] uppercase text-muted-foreground">{label}</p>
    )}
    {payload.map((entry, index) => (
      <div key={index} className="flex items-center gap-2">
        <span
          className="inline-block h-2 w-2"
          style={{ backgroundColor: entry.color }}
        />
        <span className="text-sm font-medium">{entry.value}</span>
      </div>
    ))}
  </div>
)
}
