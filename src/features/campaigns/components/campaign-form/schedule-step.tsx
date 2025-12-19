"use client";

import type { UseFormReturn } from "react-hook-form";
import { Send, Clock, CalendarIcon, Info } from "lucide-react";
import { format } from "date-fns";
import { Label } from "@/ui/label";
import { Input } from "@/ui/input";
import { Button } from "@/ui/button";
import { RadioGroup, RadioGroupItem } from "@/ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/popover";
import { Calendar } from "@/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import { FormField, FormItem, FormLabel, FormControl } from "@/ui/form";
import { cn } from "@/lib/utils";
import type { CampaignFormData } from "../../validations";
import { TIMEZONES } from "../../../campaigns/constants";

interface ScheduleStepProps {
  form: UseFormReturn<CampaignFormData>;
}

export function ScheduleStep({ form }: ScheduleStepProps) {
  const sendOption = form.watch("sendOption");
  const scheduleDate = form.watch("scheduleDate");
  const scheduleTime = form.watch("scheduleTime");
  const timezone = form.watch("timezone");

  return (
    <div className="space-y-8 p-6 md:p-8 lg:p-10 animate-in fade-in duration-500">
      <div className="space-y-2">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground text-balance">
          Schedule your campaign
        </h2>
        <p className="text-base text-muted-foreground text-pretty">
          Choose when to send your campaign to your audience
        </p>
      </div>

      <FormField
        control={form.control}
        name="sendOption"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <RadioGroup value={field.value} onValueChange={field.onChange}>
                <div className="space-y-4">
                  {/* Send Now Option */}
                  <div
                    className={cn(
                      "relative flex items-start space-x-4 rounded-2xl border-2 p-6 cursor-pointer transition-all duration-300 ease-in-out hover:bg-muted/50",
                      sendOption === "now"
                        ? "border-primary bg-primary/5 shadow-lg"
                        : "border-border bg-card hover:border-muted-foreground/30"
                    )}
                    onClick={() => field.onChange("now")}
                  >
                    <RadioGroupItem
                      value="now"
                      id="send-now"
                      className="mt-1"
                    />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
                          <Send className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <Label
                            htmlFor="send-now"
                            className="text-lg font-semibold text-foreground cursor-pointer"
                          >
                            Send immediately
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Your campaign will be sent to all recipients right
                            away
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Schedule for Later Option */}
                  <div
                    className={cn(
                      "relative flex items-start space-x-4 rounded-2xl border-2 p-6 cursor-pointer transition-all duration-300 ease-in-out hover:bg-muted/50",
                      sendOption === "schedule"
                        ? "border-primary bg-primary/5 shadow-lg"
                        : "border-border bg-card hover:border-muted-foreground/30"
                    )}
                    onClick={() => field.onChange("schedule")}
                  >
                    <RadioGroupItem
                      value="schedule"
                      id="schedule-later"
                      className="mt-1"
                    />
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
                          <Clock className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <Label
                            htmlFor="schedule-later"
                            className="text-lg font-semibold text-foreground cursor-pointer"
                          >
                            Schedule for later
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Choose a specific date and time to send your
                            campaign
                          </p>
                        </div>
                      </div>

                      {sendOption === "schedule" && (
                        <div className="space-y-4 pl-14 animate-in fade-in slide-in-from-top-2 duration-300">
                          <div className="flex flex-col sm:flex-row gap-4">
                            {/* Date Picker */}
                            <FormField
                              control={form.control}
                              name="scheduleDate"
                              render={({ field }) => (
                                <FormItem className="flex flex-col gap-2 flex-1">
                                  <FormLabel className="text-sm font-medium">
                                    Date
                                  </FormLabel>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <FormControl>
                                        <Button
                                          variant="outline"
                                          className={cn(
                                            "justify-between font-normal h-11 rounded-xl border-border bg-background hover:bg-muted/50 transition-all duration-300",
                                            !field.value &&
                                              "text-muted-foreground"
                                          )}
                                        >
                                          {field.value
                                            ? format(field.value, "MMM d, yyyy")
                                            : "Select date"}
                                          <CalendarIcon className="h-4 w-4 opacity-50" />
                                        </Button>
                                      </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent
                                      className="w-auto p-0 rounded-xl border-border"
                                      align="start"
                                    >
                                      <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) => date < new Date()}
                                        captionLayout="dropdown"
                                        initialFocus
                                        className="rounded-xl"
                                      />
                                    </PopoverContent>
                                  </Popover>
                                </FormItem>
                              )}
                            />

                            {/* Time Picker */}
                            <FormField
                              control={form.control}
                              name="scheduleTime"
                              render={({ field }) => (
                                <FormItem className="flex flex-col gap-2 flex-1">
                                  <FormLabel className="text-sm font-medium">
                                    Time
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      type="time"
                                      className="h-11 rounded-xl border-border bg-background transition-all duration-300"
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>

                          {/* Timezone Selector */}
                          <FormField
                            control={form.control}
                            name="timezone"
                            render={({ field }) => (
                              <FormItem className="space-y-2">
                                <FormLabel className="text-sm font-medium">
                                  Timezone
                                </FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="h-11 rounded-xl border-border bg-background transition-all duration-300">
                                      <SelectValue />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent className="rounded-xl border-border bg-card max-h-[300px]">
                                    {TIMEZONES.map((tz) => (
                                      <SelectItem
                                        key={tz.value}
                                        value={tz.value}
                                        className="rounded-lg"
                                      >
                                        {tz.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormItem>
                            )}
                          />

                          {/* Schedule Summary */}
                          {scheduleDate && (
                            <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/50 border border-border animate-in fade-in duration-300">
                              <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                              <div className="flex-1 space-y-1">
                                <p className="text-sm font-medium text-foreground">
                                  Your campaign will be sent on:
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {format(scheduleDate, "EEEE, MMMM d, yyyy")}{" "}
                                  at {scheduleTime} ({timezone})
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </RadioGroup>
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}
