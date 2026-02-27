import * as React from "react"
import { cn } from "../../lib/utils"

export function PageTitle({ title, subtitle, right }: { title: string; subtitle?: string; right?: React.ReactNode }) {
  return (
    <div className={cn("flex flex-wrap items-start justify-between gap-2")}> 
      <div>
        <div className="text-2xl font-extrabold tracking-tight">{title}</div>
        {subtitle ? <div className="text-sm text-slate-500">{subtitle}</div> : null}
      </div>
      {right ? <div className="flex flex-wrap gap-2">{right}</div> : null}
    </div>
  )
}
