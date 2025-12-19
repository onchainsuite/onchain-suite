"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/ui/button"
import { CardDescription, CardHeader, CardTitle } from "@/ui/card"

interface CalendarHeaderProps {
  monthName: string
  year: number
  onPreviousMonth: () => void
  onNextMonth: () => void
}

export function CalendarHeader({ monthName, year, onPreviousMonth, onNextMonth }: CalendarHeaderProps) {
  return (
    <CardHeader className="space-y-1 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <CardTitle className="text-xl sm:text-2xl font-bold text-foreground">
            {monthName} {year}
          </CardTitle>
          <CardDescription className="text-muted-foreground mt-1 text-sm">
            View your scheduled campaigns
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={onPreviousMonth}
            className="h-9 w-9 rounded-xl transition-all duration-300 bg-transparent"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={onNextMonth}
            className="h-9 w-9 rounded-xl transition-all duration-300 bg-transparent"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </CardHeader>
  )
}
