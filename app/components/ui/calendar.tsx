import * as React from "react"
import { DayPicker } from "react-day-picker"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "~/lib/utils"
import { buttonVariants } from "~/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-4",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-semibold text-foreground",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-8 w-8 p-0 opacity-70 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex w-full",
        head_cell:
          "text-muted-foreground rounded-md w-10 flex items-center justify-center shrink-0 font-medium text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
          "[&:has([aria-selected])]:bg-babana-cyan/10",
          "[&:has([aria-selected].day-outside)]:bg-babana-cyan/5"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-10 w-10 shrink-0 p-0 font-normal aria-selected:opacity-100"
        ),
        day_selected:
          "bg-babana-cyan text-white hover:bg-babana-cyan/90 focus:bg-babana-cyan focus:text-white",
        day_today:
          "bg-babana-blue/10 text-babana-blue dark:bg-babana-blue/15 dark:text-babana-cyan",
        day_outside:
          "day-outside text-muted-foreground opacity-60 aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-40",
        day_range_middle: "aria-selected:bg-babana-cyan/15 aria-selected:text-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({
          className: iconClassName,
          orientation,
        }: {
          className?: string
          orientation?: "up" | "down" | "left" | "right"
        }) => {
          if (orientation === "left") {
            return <ChevronLeft className={cn("h-4 w-4", iconClassName)} />
          }
          if (orientation === "right") {
            return <ChevronRight className={cn("h-4 w-4", iconClassName)} />
          }
          // Fallback for dropdown chevrons
          return <ChevronRight className={cn("h-4 w-4", iconClassName)} />
        },
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }


