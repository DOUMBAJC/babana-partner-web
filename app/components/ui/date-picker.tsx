import { useMemo, useState } from "react"
import { format, parse } from "date-fns"
import type { Locale } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover"
import { Calendar } from "~/components/ui/calendar"

type DatePickerValue = string // yyyy-MM-dd

export interface DatePickerProps {
  id?: string
  value: DatePickerValue
  onChange: (next: DatePickerValue) => void
  placeholder?: string
  disabled?: boolean
  displayFormat?: string // date-fns format
  /**
   * Locale date-fns utilisée par react-day-picker (noms des jours/mois, etc.)
   */
  locale?: Locale
  /**
   * Début de semaine (0=dimanche, 1=lundi, ...)
   */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
}

function parseYmd(value: string): Date | undefined {
  if (!value) return undefined
  try {
    return parse(value, "yyyy-MM-dd", new Date())
  } catch {
    return undefined
  }
}

export function DatePicker({
  id,
  value,
  onChange,
  placeholder = "Select a date",
  disabled = false,
  displayFormat = "dd/MM/yyyy",
  locale,
  weekStartsOn = 1,
}: DatePickerProps) {
  const [open, setOpen] = useState(false)

  const selected = useMemo(() => parseYmd(value), [value])
  const label = selected ? format(selected, displayFormat) : ""

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal bg-background",
            "pl-10 relative",
            !selected && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          {label || placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          "w-auto p-0",
          "bg-popover text-popover-foreground",
          "border-border/60 shadow-2xl rounded-xl overflow-hidden",
          "ring-1 ring-babana-cyan/10 dark:ring-babana-cyan/15"
        )}
        align="start"
        sideOffset={8}
      >
        <Calendar
          mode="single"
          selected={selected}
          locale={locale}
          weekStartsOn={weekStartsOn}
          onSelect={(d) => {
            if (!d) return
            onChange(format(d, "yyyy-MM-dd"))
            setOpen(false)
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}


