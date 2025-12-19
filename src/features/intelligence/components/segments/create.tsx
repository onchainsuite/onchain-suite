"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Save } from "lucide-react";

interface Condition {
  id: string;
  field: string;
  operator: string;
  value: string;
}

export function CreateSegmentPage() {
  const router = useRouter();
  const [segmentName, setSegmentName] = useState("");
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [logicOperator, setLogicOperator] = useState<"AND" | "OR">("AND");

  const addCondition = () => {
    setConditions([
      ...conditions,
      { id: crypto.randomUUID(), field: "wallet_balance", operator: "gt", value: "" },
    ]);
  };

  const removeCondition = (id: string) => {
    setConditions(conditions.filter((c) => c.id !== id));
  };

  const updateCondition = (id: string, field: keyof Condition, value: string) => {
    setConditions(
      conditions.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const handleSave = () => {
    // Logic to save segment would go here
    // For now, just navigate back
    router.push("/intelligence");
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Link
          href="/intelligence"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card transition-colors hover:bg-secondary"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create Segment</h1>
          <p className="text-sm text-muted-foreground">Define rules to segment your users</p>
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
                className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Conditions</label>
                <div className="flex items-center gap-2 rounded-lg border border-border bg-background p-1">
                  <button
                    onClick={() => setLogicOperator("AND")}
                    className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
                      logicOperator === "AND" ? "bg-indigo-500 text-white" : "hover:bg-muted"
                    }`}
                  >
                    AND
                  </button>
                  <button
                    onClick={() => setLogicOperator("OR")}
                    className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
                      logicOperator === "OR" ? "bg-indigo-500 text-white" : "hover:bg-muted"
                    }`}
                  >
                    OR
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {conditions.map((condition, index) => (
                  <div key={condition.id} className="flex items-center gap-3">
                    <span className="text-xs font-medium text-muted-foreground w-8">
                      {index === 0 ? "Where" : logicOperator}
                    </span>
                    <select
                      value={condition.field}
                      onChange={(e) => updateCondition(condition.id, "field", e.target.value)}
                      className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm"
                    >
                      <option value="wallet_balance">Wallet Balance</option>
                      <option value="last_active">Last Active</option>
                      <option value="transaction_count">Transaction Count</option>
                    </select>
                    <select
                      value={condition.operator}
                      onChange={(e) => updateCondition(condition.id, "operator", e.target.value)}
                      className="w-32 rounded-lg border border-border bg-background px-3 py-2 text-sm"
                    >
                      <option value="gt">Greater than</option>
                      <option value="lt">Less than</option>
                      <option value="eq">Equals</option>
                    </select>
                    <input
                      type="text"
                      value={condition.value}
                      onChange={(e) => updateCondition(condition.id, "value", e.target.value)}
                      className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm"
                      placeholder="Value"
                    />
                    <button
                      onClick={() => removeCondition(condition.id)}
                      className="rounded p-2 text-muted-foreground hover:bg-red-500/10 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={addCondition}
                className="inline-flex items-center gap-2 text-sm font-medium text-indigo-500 hover:text-indigo-600"
              >
                <Plus className="h-4 w-4" />
                Add condition
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-medium mb-4">Summary</h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estimated Audience</span>
                <span className="font-medium">0 users</span>
              </div>
              <div className="pt-4 border-t border-border">
                <button
                  onClick={handleSave}
                  disabled={!segmentName}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-600 disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  Save Segment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
