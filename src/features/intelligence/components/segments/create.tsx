"use client";

import {
  ArrowDownTrayIcon,
  ArrowLeftIcon,
  ArrowPathIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { intelligenceService } from "../../intelligence.service";

interface Condition {
  id: string;
  field: string;
  operator: string;
  value: string;
}

export function CreateSegmentPage() {
  const router = useRouter();
  const [segmentName, setSegmentName] = useState("");
  const [importQueryId, setImportQueryId] = useState("");
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [logicOperator, setLogicOperator] = useState<"AND" | "OR">("AND");

  const normalizedName = segmentName.trim();
  const normalizedImportQueryId = importQueryId.trim();
  const isImportingFromQuery = normalizedImportQueryId.length > 0;

  const addCondition = () => {
    setConditions([
      ...conditions,
      {
        id: crypto.randomUUID(),
        field: "wallet_balance",
        operator: "gt",
        value: "",
      },
    ]);
  };

  const removeCondition = (id: string) => {
    setConditions(conditions.filter((c) => c.id !== id));
  };

  const updateCondition = (
    id: string,
    field: keyof Condition,
    value: string
  ) => {
    setConditions(
      conditions.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (normalizedName.length === 0)
        throw new Error("Segment name is required");
      if (isImportingFromQuery) {
        return intelligenceService.importSegmentFromQuery({
          queryId: normalizedImportQueryId,
          name: normalizedName,
        });
      }
      const rules = {
        operator: logicOperator,
        conditions: conditions.map((c) => ({
          field: c.field,
          operator: c.operator,
          value: c.value,
        })),
      };
      return intelligenceService.createSegment({ name: normalizedName, rules });
    },
    onSuccess: (res) => {
      const { segmentId } = res as { segmentId?: string };
      if (segmentId) {
        router.push(`/intelligence/segments/detail/${segmentId}`);
        return;
      }
      router.push("/intelligence");
    },
    onError: (err) => {
      const message =
        err instanceof Error ? err.message : "Failed to save segment";
      toast.error(message);
    },
  });

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 p-4 sm:p-6">
      <div className="flex items-center gap-4">
        <Link
          href="/intelligence"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card transition-colors hover:bg-secondary"
        >
          <ArrowLeftIcon className="h-5 w-5" aria-hidden="true" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create Segment</h1>
          <p className="text-sm text-muted-foreground">
            Define rules to segment your users
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <div>
              <label className="text-sm font-medium">Segment Name</label>
              <input
                type="text"
                value={segmentName}
                onChange={(e) => setSegmentName(e.target.value)}
                placeholder="e.g. High Value Active Users"
                className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Import from Query</label>
              <input
                type="text"
                value={importQueryId}
                onChange={(e) => setImportQueryId(e.target.value)}
                placeholder="Optional queryId (imports results into a segment)"
                className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
            </div>

            {!isImportingFromQuery && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Conditions</label>
                  <div className="flex items-center gap-2 rounded-lg border border-border bg-background p-1">
                    <button
                      type="button"
                      onClick={() => setLogicOperator("AND")}
                      className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
                        logicOperator === "AND"
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      }`}
                    >
                      AND
                    </button>
                    <button
                      type="button"
                      onClick={() => setLogicOperator("OR")}
                      className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
                        logicOperator === "OR"
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      }`}
                    >
                      OR
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {conditions.map((condition, index) => (
                    <div
                      key={condition.id}
                      className="flex flex-wrap items-center gap-2 sm:gap-3"
                    >
                      <span className="text-xs font-medium text-muted-foreground w-8">
                        {index === 0 ? "Where" : logicOperator}
                      </span>
                      <select
                        value={condition.field}
                        onChange={(e) =>
                          updateCondition(condition.id, "field", e.target.value)
                        }
                        className="min-w-[9rem] flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm"
                      >
                        <option value="wallet_balance">Wallet Balance</option>
                        <option value="last_active">Last Active</option>
                        <option value="transaction_count">
                          Transaction Count
                        </option>
                      </select>
                      <select
                        value={condition.operator}
                        onChange={(e) =>
                          updateCondition(
                            condition.id,
                            "operator",
                            e.target.value
                          )
                        }
                        className="w-32 rounded-lg border border-border bg-background px-3 py-2 text-sm"
                      >
                        <option value="gt">Greater than</option>
                        <option value="lt">Less than</option>
                        <option value="eq">Equals</option>
                      </select>
                      <input
                        type="text"
                        value={condition.value}
                        onChange={(e) =>
                          updateCondition(condition.id, "value", e.target.value)
                        }
                        className="min-w-[6rem] flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm"
                        placeholder="Value"
                      />
                      <button
                        type="button"
                        onClick={() => removeCondition(condition.id)}
                        className="rounded p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      >
                        <TrashIcon className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={addCondition}
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80"
                >
                  <PlusIcon className="h-4 w-4" aria-hidden="true" />
                  Add condition
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-medium mb-4">Summary</h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Estimated Audience
                </span>
                <span className="font-medium">0 users</span>
              </div>
              <div className="pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => saveMutation.mutate()}
                  disabled={
                    normalizedName.length === 0 || saveMutation.isPending
                  }
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  {saveMutation.isPending ? (
                    <ArrowPathIcon
                      className="h-4 w-4 animate-spin"
                      aria-hidden="true"
                    />
                  ) : (
                    <ArrowDownTrayIcon className="h-4 w-4" aria-hidden="true" />
                  )}
                  {isImportingFromQuery ? "Import Segment" : "Save Segment"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
