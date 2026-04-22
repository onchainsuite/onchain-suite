import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { isJsonObject } from "@/lib/utils";

import { fadeInUp, staggerContainer } from "../../utils";
import { billingService } from "@/features/billing/billing.service";
import { Checkbox } from "@/shared/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

const PaymentMethod = () => {
  const queryClient = useQueryClient();
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [type, setType] = React.useState<"card" | "crypto">("card");
  const [brand, setBrand] = React.useState("");
  const [last4, setLast4] = React.useState("");
  const [makeDefault, setMakeDefault] = React.useState(false);

  const methodsQuery = useQuery({
    queryKey: ["billing", "payment-methods"],
    queryFn: () => billingService.listPaymentMethods(),
    retry: false,
    refetchOnWindowFocus: false,
  });

  const setDefaultMutation = useMutation({
    mutationFn: (id: string) => billingService.setDefaultPaymentMethod({ id }),
    onSuccess: async () => {
      toast.success("Default payment method updated");
      await queryClient.invalidateQueries({
        queryKey: ["billing", "payment-methods"],
      });
    },
    onError: (e: unknown) =>
      toast.error(
        e instanceof Error ? e.message : "Failed to update payment method"
      ),
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => billingService.removePaymentMethod(id),
    onSuccess: async () => {
      toast.success("Payment method removed");
      await queryClient.invalidateQueries({
        queryKey: ["billing", "payment-methods"],
      });
    },
    onError: (e: unknown) =>
      toast.error(
        e instanceof Error ? e.message : "Failed to remove payment method"
      ),
  });

  const methodsData: unknown = methodsQuery.data;
  const methodsRaw = isJsonObject(methodsData)
    ? Array.isArray(methodsData.items)
      ? methodsData.items
      : Array.isArray(methodsData.data)
        ? methodsData.data
        : undefined
    : undefined;
  const methods = Array.isArray(methodsRaw) ? methodsRaw : [];

  const addMutation = useMutation({
    mutationFn: async () => {
      const sanitizedLast4 = last4.replace(/\D/g, "").slice(-4);
      if (type === "card" && sanitizedLast4.length !== 4) {
        throw new Error("Please enter the last 4 digits for the card.");
      }
      return billingService.addPaymentMethod({
        type,
        brand: brand.trim() || undefined,
        last4: type === "card" ? sanitizedLast4 : undefined,
        isDefault: makeDefault || methods.length === 0,
      });
    },
    onSuccess: async () => {
      toast.success("Payment method added");
      setShowAddModal(false);
      setBrand("");
      setLast4("");
      setMakeDefault(false);
      await queryClient.invalidateQueries({
        queryKey: ["billing", "payment-methods"],
      });
    },
    onError: (e: unknown) =>
      toast.error(
        e instanceof Error ? e.message : "Failed to add payment method"
      ),
  });

  React.useEffect(() => {
    if (!showAddModal) return;
    setMakeDefault(methods.length === 0);
  }, [showAddModal, methods.length]);

  return (
    <motion.section
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <motion.h2
            variants={fadeInUp}
            className="text-xl font-light tracking-tight text-foreground lg:text-2xl"
          >
            Payment method
          </motion.h2>
          <motion.p variants={fadeInUp} className="mt-3 text-muted-foreground">
            Manage your payment details
          </motion.p>
        </div>
        <motion.div variants={fadeInUp}>
          <Button
            className="rounded-xl"
            onClick={() => setShowAddModal(true)}
            disabled={methodsQuery.isLoading || addMutation.isPending}
          >
            Add payment method
          </Button>
        </motion.div>
      </div>

      <motion.div
        variants={fadeInUp}
        className="mt-8 border-t border-border/60 pt-8 lg:mt-10 lg:pt-10"
      >
        {methodsQuery.isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading payment methods...
          </div>
        ) : methodsQuery.isError ? (
          <div className="text-center py-8 text-muted-foreground">
            Failed to load payment methods.
          </div>
        ) : methods.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/60 bg-card p-8 text-center text-sm text-muted-foreground">
            No payment methods on file.
          </div>
        ) : (
          <div className="space-y-3">
            {methods.map((m, idx: number) => {
              const obj = isJsonObject(m) ? m : {};
              const isDefault = Boolean(obj.isDefault);
              const brand = String(obj.brand ?? obj.type ?? "Payment");
              const last4 = obj.last4 ? String(obj.last4) : "";
              const label = last4 ? `${brand} ending in ${last4}` : brand;
              return (
                <div
                  key={String(obj.id ?? idx)}
                  className="flex items-center justify-between rounded-2xl border border-border/60 bg-card p-6 lg:p-8"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="flex h-12 w-16 items-center justify-center rounded-lg bg-muted">
                      <span className="font-mono text-sm font-bold tracking-wider text-muted-foreground">
                        {String(brand).slice(0, 6).toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="font-medium text-foreground truncate">
                          {label}
                        </div>
                        {isDefault ? (
                          <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                            Default
                          </span>
                        ) : null}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {obj.type ? String(obj.type).toUpperCase() : ""}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!isDefault ? (
                      <Button
                        variant="outline"
                        disabled={setDefaultMutation.isPending}
                        onClick={() =>
                          setDefaultMutation.mutate(String(obj.id ?? ""))
                        }
                      >
                        Set default
                      </Button>
                    ) : null}
                    <Button
                      variant="outline"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      disabled={removeMutation.isPending || isDefault}
                      onClick={() =>
                        removeMutation.mutate(String(obj.id ?? ""))
                      }
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>

      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add payment method</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={type}
                onValueChange={(v) =>
                  setType(v === "card" || v === "crypto" ? v : "card")
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="crypto">Crypto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Brand (optional)</Label>
              <Input
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder={type === "card" ? "Visa" : "USDC"}
              />
            </div>

            {type === "card" ? (
              <div className="space-y-2">
                <Label>Last 4 digits</Label>
                <Input
                  value={last4}
                  onChange={(e) => setLast4(e.target.value)}
                  inputMode="numeric"
                  placeholder="4242"
                />
              </div>
            ) : null}

            <div className="flex items-center gap-2">
              <Checkbox
                checked={makeDefault}
                onCheckedChange={(v) => setMakeDefault(Boolean(v))}
              />
              <span className="text-sm text-muted-foreground">
                Set as default
              </span>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddModal(false)}
              disabled={addMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={() => addMutation.mutate()}
              disabled={addMutation.isPending}
            >
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.section>
  );
};

export default PaymentMethod;
