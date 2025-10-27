"use client";

import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function OnboardingCalendar() {
  const [currentDate] = useState(new Date());

  // Get current month and year
  const monthName = currentDate.toLocaleString("default", { month: "long" });
  const year = currentDate.getFullYear();
  const today = currentDate.getDate();

  // Get days in month
  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  // Create calendar days
  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const isCurrentMonth =
    currentDate.getMonth() === new Date().getMonth() &&
    currentDate.getFullYear() === new Date().getFullYear();

  return (
    <Card className="border-border bg-card h-full border">
      <CardHeader className="flex flex-row items-center justify-between px-4 py-3 pb-3 lg:px-6 lg:py-4">
        <div className="flex items-center gap-2">
          <Calendar className="text-primary h-4 w-4 lg:h-5 lg:w-5" />
          <CardTitle className="text-card-foreground text-base font-semibold lg:text-lg">
            {monthName} {year}
          </CardTitle>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7 lg:h-8 lg:w-8">
            <ChevronLeft className="h-3 w-3 lg:h-4 lg:w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 lg:h-8 lg:w-8">
            <ChevronRight className="h-3 w-3 lg:h-4 lg:w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-4 pt-0 pb-4 lg:px-6 lg:pb-6">
        <div className="text-muted-foreground mb-2 grid grid-cols-7 gap-1 text-center text-xs font-medium">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="py-1 lg:py-2">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            const isToday = day === today && isCurrentMonth;
            return (
              <div
                key={index}
                className={`flex h-8 w-8 items-center justify-center rounded-md text-xs transition-colors lg:h-9 lg:w-9 lg:text-sm ${
                  day === null
                    ? ""
                    : isToday
                      ? "bg-primary text-primary-foreground font-medium"
                      : "text-card-foreground hover:bg-muted cursor-pointer"
                }`}
              >
                {day}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
