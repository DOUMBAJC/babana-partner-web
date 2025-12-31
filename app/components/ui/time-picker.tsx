import { useMemo, useState } from "react"
import { Clock, X } from "lucide-react"

import { cn } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover"

type TimeValue = string | null // "HH:mm"

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

function parseTime(value: TimeValue): { h: number; m: number } {
  if (!value) return { h: 0, m: 0 }
  const [hh, mm] = value.split(":")
  const h = clamp(Number(hh ?? 0), 0, 23)
  const m = clamp(Number(mm ?? 0), 0, 59)
  return { h, m }
}

function pad2(n: number) {
  return String(n).padStart(2, "0")
}

export interface TimePickerProps {
  id?: string
  value: TimeValue
  onChange: (next: TimeValue) => void
  placeholder?: string
  disabled?: boolean
  minuteStep?: number
}

export function TimePicker({
  id,
  value,
  onChange,
  placeholder = "--:--",
  disabled = false,
  minuteStep = 5,
}: TimePickerProps) {
  const [open, setOpen] = useState(false)
  const { h, m } = useMemo(() => parseTime(value), [value])

  const minutes = useMemo(() => {
    const step = clamp(minuteStep, 1, 30)
    const list: number[] = []
    for (let i = 0; i < 60; i += step) list.push(i)
    return list
  }, [minuteStep])

  const label = value ? value : ""

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
            !value && "text-muted-foreground"
          )}
        >
          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          {label || placeholder}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className={cn(
          "w-[320px] p-3",
          "bg-white text-foreground dark:bg-gray-950",
          "border-border/60 shadow-xl rounded-xl"
        )}
        align="start"
        sideOffset={8}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-semibold">Heures</div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => {
              onChange(null)
              setOpen(false)
            }}
            title="Effacer"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Hours */}
          <div className="rounded-lg border border-border/60 overflow-hidden">
            <div className="px-2 py-1 text-[11px] font-medium text-muted-foreground bg-muted/30">
              HH
            </div>
            <div className="max-h-48 overflow-auto p-2 grid grid-cols-4 gap-1">
              {Array.from({ length: 24 }).map((_, i) => {
                const isActive = i === h
                return (
                  <button
                    key={i}
                    type="button"
                    className={cn(
                      "h-8 rounded-md text-sm transition-colors",
                      isActive
                        ? "bg-babana-cyan text-white shadow-sm"
                        : "hover:bg-babana-cyan/10"
                    )}
                    onClick={() => onChange(`${pad2(i)}:${pad2(m)}`)}
                  >
                    {pad2(i)}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Minutes */}
          <div className="rounded-lg border border-border/60 overflow-hidden">
            <div className="px-2 py-1 text-[11px] font-medium text-muted-foreground bg-muted/30">
              MM
            </div>
            <div className="max-h-48 overflow-auto p-2 grid grid-cols-3 gap-1">
              {minutes.map((mm) => {
                const isActive = mm === m
                return (
                  <button
                    key={mm}
                    type="button"
                    className={cn(
                      "h-8 rounded-md text-sm transition-colors",
                      isActive
                        ? "bg-babana-blue text-white shadow-sm"
                        : "hover:bg-babana-blue/10"
                    )}
                    onClick={() => onChange(`${pad2(h)}:${pad2(mm)}`)}
                  >
                    {pad2(mm)}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Fermer
          </Button>
          <Button
            type="button"
            onClick={() => setOpen(false)}
            className="bg-babana-cyan hover:bg-babana-cyan/90"
          >
            OK
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}


