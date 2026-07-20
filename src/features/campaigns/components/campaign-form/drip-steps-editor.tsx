"use client";

import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import {
  campaignsService,
  type DripStep,
} from "@/features/campaigns/campaigns.service";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

const DELAY_PRESETS = [
  { label: "1 hour", minutes: 60 },
  { label: "6 hours", minutes: 360 },
  { label: "1 day", minutes: 1440 },
  { label: "3 days", minutes: 4320 },
  { label: "1 week", minutes: 10080 },
];

const delayLabel = (minutes: number) => {
  const preset = DELAY_PRESETS.find((p) => p.minutes === minutes);
  if (preset) return preset.label;
  if (minutes % 1440 === 0 && minutes > 0) return `${minutes / 1440} days`;
  if (minutes % 60 === 0 && minutes > 0) return `${minutes / 60} hours`;
  return `${minutes} min`;
};

/**
 * Drip sequence editor for the campaign wizard's message step. The backend
 * scheduler sends step 1 at launch and each later step `delayMinutes` after
 * the previous one, re-resolving the audience per step (docs/backend.md
 * 2026-07-23) — so this only manages the sequence; sending is backend-owned.
 */
export function DripStepsEditor({ campaignId }: { campaignId: string }) {
  const queryClient = useQueryClient();
  const [subject, setSubject] = useState("");
  const [delayMinutes, setDelayMinutes] = useState("1440");

  const stepsQuery = useQuery({
    queryKey: ["campaigns", campaignId, "drip-steps"],
    queryFn: () => campaignsService.listDripSteps(campaignId),
    retry: false,
    refetchOnWindowFocus: false,
  });

  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: ["campaigns", campaignId, "drip-steps"],
    });

  const addMutation = useMutation({
    mutationFn: () =>
      campaignsService.createDripStep(campaignId, {
        name: subject.trim() || "Follow-up",
        subject: subject.trim(),
        delayMinutes: Number(delayMinutes),
      }),
    onSuccess: async () => {
      setSubject("");
      await invalidate();
    },
    onError: (e: unknown) =>
      toast.error(e instanceof Error ? e.message : "Could not add step"),
  });

  const deleteMutation = useMutation({
    mutationFn: (stepId: string) =>
      campaignsService.deleteDripStep(campaignId, stepId),
    onSuccess: invalidate,
    onError: (e: unknown) =>
      toast.error(e instanceof Error ? e.message : "Could not remove step"),
  });

  const steps: DripStep[] = stepsQuery.data ?? [];

  return (
    <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
      <div className="text-sm font-medium text-foreground">Drip sequence</div>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">
        Step 1 uses this campaign&apos;s message and sends at launch. Each
        follow-up below sends after the previous step&apos;s delay — the
        audience is re-checked every step, so opt-outs are honored mid-sequence.
      </p>

      <div className="mt-3 space-y-2">
        <div className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/30 px-3 py-2 text-sm">
          <span className="font-medium text-foreground">
            Step 1 — campaign message
          </span>
          <span className="text-xs text-muted-foreground">At launch</span>
        </div>
        {steps.map((step, index) => (
          <div
            key={step.id}
            className="flex items-center justify-between gap-2 rounded-xl border border-border/60 px-3 py-2 text-sm"
          >
            <div className="min-w-0">
              <div className="truncate font-medium text-foreground">
                Step {index + 2} — {step.subject || step.name || "Follow-up"}
              </div>
              <div className="text-xs text-muted-foreground">
                {delayLabel(step.delayMinutes)} after the previous step
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 text-destructive"
              aria-label="Remove step"
              disabled={deleteMutation.isPending}
              onClick={() => deleteMutation.mutate(step.id)}
            >
              <TrashIcon className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_10rem_auto] sm:items-end">
        <div className="space-y-1">
          <Label htmlFor="drip-step-subject" className="text-xs">
            Follow-up subject
          </Label>
          <Input
            id="drip-step-subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. Still thinking it over?"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Send after</Label>
          <Select value={delayMinutes} onValueChange={setDelayMinutes}>
            <SelectTrigger aria-label="Delay before this step">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DELAY_PRESETS.map((preset) => (
                <SelectItem key={preset.minutes} value={String(preset.minutes)}>
                  {preset.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          type="button"
          variant="outline"
          className="rounded-xl"
          disabled={addMutation.isPending || subject.trim().length === 0}
          onClick={() => addMutation.mutate()}
        >
          <PlusIcon className="mr-1 h-4 w-4" aria-hidden="true" />
          Add step
        </Button>
      </div>
    </div>
  );
}
