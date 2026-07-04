"use client";

import { CalendarIcon, ClockIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";
import { useMemo } from "react";
import type { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/ui/button";
import { Calendar } from "@/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/ui/dialog";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/popover";

import {
  getZonedDateTimeParts,
  parseTimeOfDay,
  zonedWallTimeToUtcDate,
} from "@/lib/timezone";
import { cn } from "@/lib/utils";

import type { CampaignFormData } from "../../validations";

interface ScheduleSendDialogProps {
  form: UseFormReturn<CampaignFormData>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Called after a valid date/time is confirmed (sendOption is set to "schedule"). */
  onConfirm: () => void;
}

/**
 * Compact replacement for the old schedule wizard step: picks a date/time in
 * the org timezone and hands control back to the template step, which then
 * advances straight to preview.
 */
export function ScheduleSendDialog({
  form,
  open,
  onOpenChange,
  onConfirm,
}: ScheduleSendDialogProps) {
  const scheduleDate = form.watch("scheduleDate");
  const scheduleTime = form.watch("scheduleTime");
  const timezone = form.watch("timezone") ?? "UTC";

  const minSelectableDate = useMemo(() => {
    const today = getZonedDateTimeParts(new Date(), timezone);
    return new Date(today.year, today.month - 1, today.day);
  }, [timezone]);

  const scheduleSummary = useMemo(() => {
    if (!scheduleDate || !scheduleTime) return null;
    const { hour, minute } = parseTimeOfDay(scheduleTime);
    const utc = zonedWallTimeToUtcDate(
      {
        year: scheduleDate.getFullYear(),
        month: scheduleDate.getMonth() + 1,
        day: scheduleDate.getDate(),
        hour,
        minute,
      },
      timezone
    );
    return new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(utc);
  }, [scheduleDate, scheduleTime, timezone]);

  const handleConfirm = () => {
    if (!scheduleDate) {
      toast.error("Select a schedule date.");
      return;
    }
    if (!scheduleTime || scheduleTime.trim().length === 0) {
      toast.error("Select a schedule time.");
      return;
    }
    form.setValue("sendOption", "schedule", { shouldDirty: true });
    onOpenChange(false);
    onConfirm();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule campaign</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex flex-1 flex-col gap-2">
              <Label className="text-sm font-medium">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      "h-11 justify-between rounded-xl border-border bg-background font-normal hover:bg-muted/50",
                      !scheduleDate && "text-muted-foreground"
                    )}
                  >
                    {scheduleDate
                      ? format(scheduleDate, "MMM d, yyyy")
                      : "Select date"}
                    <CalendarIcon
                      aria-hidden="true"
                      className="h-4 w-4 opacity-50"
                    />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto rounded-xl border-border p-0"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={scheduleDate}
                    onSelect={(date) =>
                      form.setValue("scheduleDate", date ?? undefined, {
                        shouldDirty: true,
                      })
                    }
                    disabled={(date) => date < minSelectableDate}
                    captionLayout="dropdown"
                    initialFocus
                    className="rounded-xl"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex flex-1 flex-col gap-2">
              <Label className="text-sm font-medium">Time</Label>
              <Input
                type="time"
                value={scheduleTime ?? ""}
                onChange={(e) =>
                  form.setValue("scheduleTime", e.target.value, {
                    shouldDirty: true,
                  })
                }
                className="h-11 rounded-xl border-border bg-background"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Timezone (from Settings)
            </Label>
            <Input
              value={timezone}
              disabled
              readOnly
              className="h-11 rounded-xl border-border bg-muted/40 text-foreground"
            />
          </div>

          {scheduleSummary ? (
            <div className="flex items-start gap-2 rounded-xl border border-border bg-muted/50 p-3">
              <ClockIcon
                aria-hidden="true"
                className="mt-0.5 h-4 w-4 shrink-0 text-primary"
              />
              <p className="text-sm text-muted-foreground">
                Sends {scheduleSummary} ({timezone})
              </p>
            </div>
          ) : null}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            className="rounded-xl"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="button" className="rounded-xl" onClick={handleConfirm}>
            Continue to preview
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
