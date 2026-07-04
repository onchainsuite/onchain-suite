"use client";

import {
  ClipboardIcon,
  InboxArrowDownIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import { formatDistanceToNow } from "date-fns";
import { memo, useMemo } from "react";
import { toast } from "sonner";

import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Card, CardContent, CardFooter } from "@/ui/card";

import type { CaptureForm } from "../forms.service";
import { FormPreview } from "./form-preview";

export function statusBadgeVariant(
  status: CaptureForm["status"]
): "default" | "secondary" | "outline" {
  return status === "active" ? "default" : "secondary";
}

/** Grid card: mini live preview on top, metadata + quick actions below. */
export const FormCard = memo(function FormCard({
  form,
  onOpen,
}: {
  form: CaptureForm;
  onOpen: (form: CaptureForm) => void;
}) {
  const lastSubmission = useMemo(
    () =>
      form.lastSubmissionAt
        ? formatDistanceToNow(new Date(form.lastSubmissionAt), {
            addSuffix: true,
          })
        : null,
    [form.lastSubmissionAt]
  );

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={() => onOpen(form)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(form);
        }
      }}
      className="group cursor-pointer gap-0 overflow-hidden py-0 transition-all duration-200 hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
    >
      <div className="relative">
        <FormPreview
          name={form.name}
          fields={form.fields}
          zkEnabled={form.zkEnabled}
          compact
          className="rounded-none border-0 border-b border-border"
        />
        <div className="absolute right-2 top-2 flex gap-1">
          <Badge variant={statusBadgeVariant(form.status)}>{form.status}</Badge>
          {form.zkEnabled ? (
            <Badge variant="outline" className="gap-1 bg-card">
              <LockClosedIcon className="h-3 w-3" aria-hidden="true" />
              ZK
            </Badge>
          ) : null}
        </div>
      </div>
      <CardContent className="space-y-1 p-4">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-medium text-foreground">
            {form.name}
          </p>
          {form.tag ? (
            <Badge variant="secondary" className="shrink-0 text-[10px]">
              {form.tag}
            </Badge>
          ) : null}
        </div>
        <p className="flex items-center gap-1 text-xs text-muted-foreground">
          <InboxArrowDownIcon className="h-3.5 w-3.5" aria-hidden="true" />
          {form.submissionCount.toLocaleString()} submission
          {form.submissionCount === 1 ? "" : "s"}
          {lastSubmission ? ` · last ${lastSubmission}` : ""}
        </p>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t border-border px-4 py-2.5">
        <span className="text-xs text-muted-foreground">
          {form.apiConnected ? "API connected" : "Not connected"}
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs"
          onClick={(e) => {
            e.stopPropagation();
            void navigator.clipboard.writeText(form.embedCode);
            toast.success("Embed code copied");
          }}
        >
          <ClipboardIcon className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
          Embed
        </Button>
      </CardFooter>
    </Card>
  );
});
