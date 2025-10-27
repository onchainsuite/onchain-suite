"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { v7 } from "uuid";

export function CampaignCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const prevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  // Get month name and year
  const monthName = currentMonth.toLocaleString("default", { month: "long" });
  const year = currentMonth.getFullYear();

  // Get days in month
  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  // Get first day of month
  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  // Create calendar days
  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null); // Empty cells for days before the 1st
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  // Mock campaign events
  const events = [
    { day: 5, title: "Welcome Series", type: "automated" },
    { day: 12, title: "May Newsletter", type: "regular" },
    { day: 18, title: "Product Launch", type: "regular" },
    { day: 25, title: "Feedback Survey", type: "regular" },
  ];

  return (
    <div className="border-border bg-card overflow-hidden rounded-lg border shadow">
      <div className="border-border bg-muted flex items-center justify-between border-b px-6 py-3">
        <h2 className="text-foreground text-lg font-medium">
          {monthName} {year}
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            className="text-muted-foreground hover:bg-muted/80 hover:text-foreground rounded-md p-1"
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Previous month</span>
          </button>
          <button
            onClick={nextMonth}
            className="text-muted-foreground hover:bg-muted/80 hover:text-foreground rounded-md p-1"
          >
            <ChevronRight className="h-5 w-5" />
            <span className="sr-only">Next month</span>
          </button>
        </div>
      </div>

      <div className="border-border bg-muted text-muted-foreground grid grid-cols-7 border-b text-center text-sm font-medium">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="bg-border grid grid-cols-7 gap-px">
        {days.map((day) => {
          const dayEvents = events.filter((event) => event.day === day);
          const isToday =
            day === new Date().getDate() &&
            currentMonth.getMonth() === new Date().getMonth() &&
            currentMonth.getFullYear() === new Date().getFullYear();

          return (
            <div
              key={v7()}
              className={`bg-card min-h-[120px] p-2 ${day === null ? "bg-muted/50" : ""}`}
            >
              {day !== null && (
                <>
                  <div
                    className={`mb-1 flex h-6 w-6 items-center justify-center rounded-full text-sm ${
                      isToday
                        ? "bg-primary text-primary-foreground font-medium"
                        : "text-card-foreground"
                    }`}
                  >
                    {day}
                  </div>
                  <div className="space-y-1">
                    {dayEvents.map((event) => (
                      <div
                        key={v7()}
                        className={`rounded-md px-2 py-1 text-xs ${
                          event.type === "automated"
                            ? "bg-[#0ea5e9]/20 text-[#0ea5e9]"
                            : "bg-primary/20 text-primary"
                        }`}
                      >
                        {event.title}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
