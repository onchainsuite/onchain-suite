"use client";

import {
  BoltIcon,
  CalendarIcon,
  GlobeAltIcon,
  InboxArrowDownIcon,
  LockClosedIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { format, formatDistanceToNow } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/ui/alert-dialog";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/ui/sheet";
import { Switch } from "@/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";

import type {
  CaptureFieldSpec,
  CaptureForm,
  UpdateFormInput,
} from "../forms.service";
import { EmbedSnippet } from "./embed-snippet";
import { FieldsEditor } from "./fields-editor";
import { statusBadgeVariant } from "./form-card";
import { FormPreview } from "./form-preview";

const STATUSES = ["active", "paused", "archived"] as const;

/**
 * Detail drawer with Overview / Preview / Embed / Settings tabs.
 * Settings edits are staged locally and saved via a single PATCH.
 */
export function FormDetailSheet({
  form,
  onOpenChange,
  onUpdate,
  updating,
  onConnect,
  connecting,
  onDelete,
  deleting,
}: {
  /** null = closed. */
  form: CaptureForm | null;
  onOpenChange: (open: boolean) => void;
  onUpdate: (id: string, input: UpdateFormInput) => void;
  updating: boolean;
  onConnect: (id: string) => void;
  connecting: boolean;
  onDelete: (id: string) => void;
  deleting: boolean;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <>
      <Sheet open={form !== null} onOpenChange={onOpenChange}>
        <SheetContent className="flex w-full flex-col gap-0 overflow-y-auto sm:max-w-xl">
          {form ? (
            <SheetBody
              form={form}
              onUpdate={onUpdate}
              updating={updating}
              onConnect={onConnect}
              connecting={connecting}
              onRequestDelete={() => setConfirmDelete(true)}
            />
          ) : null}
        </SheetContent>
      </Sheet>
      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this form?</AlertDialogTitle>
            <AlertDialogDescription>
              {form
                ? `"${form.name}" and its embed snippet will stop working immediately. This cannot be undone.`
                : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleting}
              onClick={() => {
                if (form) onDelete(form.id);
                setConfirmDelete(false);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? "Deleting…" : "Delete form"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function SheetBody({
  form,
  onUpdate,
  updating,
  onConnect,
  connecting,
  onRequestDelete,
}: {
  form: CaptureForm;
  onUpdate: (id: string, input: UpdateFormInput) => void;
  updating: boolean;
  onConnect: (id: string) => void;
  connecting: boolean;
  onRequestDelete: () => void;
}) {
  return (
    <>
      <SheetHeader className="border-b border-border">
        <div className="flex items-start justify-between gap-2 pr-6">
          <div className="min-w-0">
            <SheetTitle className="truncate">{form.name}</SheetTitle>
            <SheetDescription>
              Created {format(new Date(form.createdAt), "MMM d, yyyy")}
              {form.tag ? ` · ${form.tag}` : ""}
            </SheetDescription>
          </div>
          <div className="flex shrink-0 gap-1">
            <Badge variant={statusBadgeVariant(form.status)}>
              {form.status}
            </Badge>
            {form.zkEnabled ? (
              <Badge variant="outline" className="gap-1">
                <LockClosedIcon className="h-3 w-3" aria-hidden="true" />
                ZK
              </Badge>
            ) : null}
          </div>
        </div>
      </SheetHeader>
      <Tabs defaultValue="overview" className="flex-1 px-4 py-4">
        <TabsList className="w-full">
          <TabsTrigger value="overview" className="flex-1">
            Overview
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex-1">
            Preview
          </TabsTrigger>
          <TabsTrigger value="embed" className="flex-1">
            Embed
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex-1">
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <OverviewTab
            form={form}
            onConnect={onConnect}
            connecting={connecting}
          />
        </TabsContent>

        <TabsContent value="preview" className="mt-4">
          <FormPreview
            name={form.name}
            fields={form.fields}
            zkEnabled={form.zkEnabled}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            Rendered from this form&apos;s field spec — what visitors see where
            the snippet is embedded.
          </p>
        </TabsContent>

        <TabsContent value="embed" className="mt-4">
          <EmbedSnippet embedCode={form.embedCode} submitUrl={form.submitUrl} />
        </TabsContent>

        <TabsContent value="settings" className="mt-4">
          <SettingsTab
            form={form}
            onUpdate={onUpdate}
            updating={updating}
            onRequestDelete={onRequestDelete}
          />
        </TabsContent>
      </Tabs>
    </>
  );
}

function OverviewTab({
  form,
  onConnect,
  connecting,
}: {
  form: CaptureForm;
  onConnect: (id: string) => void;
  connecting: boolean;
}) {
  const metrics = useMemo(
    () => [
      {
        key: "submissions",
        icon: InboxArrowDownIcon,
        label: "Submissions",
        value: form.submissionCount.toLocaleString(),
      },
      {
        key: "last",
        icon: CalendarIcon,
        label: "Last submission",
        value: form.lastSubmissionAt
          ? formatDistanceToNow(new Date(form.lastSubmissionAt), {
              addSuffix: true,
            })
          : "None yet",
      },
      {
        key: "zk",
        icon: LockClosedIcon,
        label: "ZK encryption",
        value: form.zkEnabled ? "Enabled" : "Off",
      },
      {
        key: "origins",
        icon: GlobeAltIcon,
        label: "Allowed origins",
        value:
          form.allowedOrigins.length > 0
            ? `${form.allowedOrigins.length} configured`
            : "Any origin",
      },
    ],
    [form]
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {metrics.map((m) => (
          <div
            key={m.key}
            className="rounded-lg border border-border bg-muted/30 p-3"
          >
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <m.icon className="h-3.5 w-3.5" aria-hidden="true" />
              {m.label}
            </p>
            <p className="mt-1 text-sm font-medium text-foreground">
              {m.value}
            </p>
          </div>
        ))}
      </div>

      {form.allowedOrigins.length > 0 ? (
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Origins</Label>
          <div className="flex flex-wrap gap-1">
            {form.allowedOrigins.map((origin) => (
              <Badge key={origin} variant="secondary" className="font-mono">
                {origin}
              </Badge>
            ))}
          </div>
        </div>
      ) : null}

      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">Fields</Label>
        <div className="flex flex-wrap gap-1">
          {(form.fields.length > 0
            ? form.fields
            : [{ key: "email", type: "email" as const, required: true }]
          ).map((f: CaptureFieldSpec) => (
            <Badge key={f.key} variant="outline">
              {f.label ?? f.key}
              {f.required ? " *" : ""}
            </Badge>
          ))}
        </div>
      </div>

      {!form.apiConnected ? (
        <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3">
          <div>
            <p className="flex items-center gap-1.5 text-sm font-medium text-foreground">
              <BoltIcon className="h-4 w-4" aria-hidden="true" />
              Connect to API
            </p>
            <p className="text-xs text-muted-foreground">
              Auto-enables ZK encryption on captures.
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => onConnect(form.id)}
            disabled={connecting}
          >
            {connecting ? "Connecting…" : "Connect"}
          </Button>
        </div>
      ) : (
        <p className="rounded-lg border border-border bg-muted/30 p-3 text-xs text-muted-foreground">
          Connected to the API — captures are ZK-encrypted at the boundary.
        </p>
      )}
    </div>
  );
}

function SettingsTab({
  form,
  onUpdate,
  updating,
  onRequestDelete,
}: {
  form: CaptureForm;
  onUpdate: (id: string, input: UpdateFormInput) => void;
  updating: boolean;
  onRequestDelete: () => void;
}) {
  const [name, setName] = useState(form.name);
  const [tag, setTag] = useState(form.tag ?? "");
  const [status, setStatus] = useState(form.status);
  const [origins, setOrigins] = useState(form.allowedOrigins.join(", "));
  const [zk, setZk] = useState(form.zkEnabled);
  const [fields, setFields] = useState<CaptureFieldSpec[]>(form.fields);

  // Re-stage local edits when a different form is opened in the sheet.
  useEffect(() => {
    setName(form.name);
    setTag(form.tag ?? "");
    setStatus(form.status);
    setOrigins(form.allowedOrigins.join(", "));
    setZk(form.zkEnabled);
    setFields(form.fields);
  }, [form]);

  const save = () => {
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    onUpdate(form.id, {
      name: name.trim(),
      tag: tag.trim() || null,
      status,
      zkEnabled: zk,
      fields: fields.filter((f) => f.key.trim().length > 0),
      allowedOrigins: origins
        .split(",")
        .map((o) => o.trim())
        .filter(Boolean),
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="edit-name">Name</Label>
        <Input
          id="edit-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor="edit-tag">Tag</Label>
          <Input
            id="edit-tag"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            placeholder="newsletter"
          />
        </div>
        <div className="space-y-1">
          <Label>Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger aria-label="Form status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-1">
        <Label htmlFor="edit-origins">Allowed origins</Label>
        <Input
          id="edit-origins"
          value={origins}
          onChange={(e) => setOrigins(e.target.value)}
          placeholder="https://myprotocol.xyz"
        />
        <p className="text-xs text-muted-foreground">
          Comma-separated. Leave empty to allow any origin.
        </p>
      </div>
      <FieldsEditor fields={fields} onChange={setFields} />
      <div className="flex items-center justify-between rounded-md border border-border p-3">
        <div>
          <Label htmlFor="edit-zk">ZK encryption</Label>
          <p className="text-xs text-muted-foreground">
            Blind-index + encrypt captured emails at rest.
          </p>
        </div>
        <Switch id="edit-zk" checked={zk} onCheckedChange={setZk} />
      </div>
      <div className="flex items-center justify-between border-t border-border pt-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onRequestDelete}
          className="text-destructive hover:text-destructive"
        >
          <TrashIcon className="mr-1 h-4 w-4" aria-hidden="true" />
          Delete form
        </Button>
        <Button onClick={save} disabled={updating}>
          {updating ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </div>
  );
}
