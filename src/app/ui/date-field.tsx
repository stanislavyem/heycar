import * as React from "react"

import { Input } from "@/app/ui/input"
import { cn } from "@/app/lib/cn"

type DateFieldProps = Omit<React.ComponentPropsWithoutRef<"input">, "type"> & {
  type?: "date" | "time" | "datetime-local" | "month"
}

// The browser's own date or time input in Input's look: the phone opens its native picker in the site's language.
// iOS collapses an empty date input and centres its value; appearance-none and the text-start pseudo-element keep it a field.
const DateField = React.forwardRef<HTMLInputElement, DateFieldProps>(
  function DateField({ className, type = "date", ...props }, ref) {
    return (
      <Input
        ref={ref}
        type={type}
        data-slot="date-field"
        className={cn(
          "appearance-none scheme-light dark:scheme-dark [&::-webkit-date-and-time-value]:text-start [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-60 hover:[&::-webkit-calendar-picker-indicator]:opacity-100",
          className
        )}
        {...props}
      />
    )
  }
)

export { DateField }
export type { DateFieldProps }
