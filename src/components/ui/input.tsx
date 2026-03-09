import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, icon, ...props }: React.ComponentProps<"input"> & { icon?: React.ReactNode }) {
  return (
    <div className="relative group flex items-center">
      {icon && (
        <div className="absolute left-3 text-gray-400 group-focus-within:text-emerald-600 transition-colors pointer-events-none">
          {icon}
        </div>
      )}
      <input
        type={type}
        data-slot="input"
        className={cn(
          "file:text-foreground placeholder:text-gray-400 selection:bg-emerald-100 selection:text-emerald-900 border-gray-200 h-9 w-full min-w-0 rounded-xl border bg-white px-3 py-1.5 text-sm shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
          "focus:border-emerald-500 focus:ring-[3px] focus:ring-emerald-500/10",
          "placeholder:font-medium placeholder:text-gray-300",
          icon && "pl-10",
          className
        )}
        {...props}
      />
    </div>
  )
}

export { Input }
