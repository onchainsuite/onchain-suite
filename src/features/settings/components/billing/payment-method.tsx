import { motion } from "framer-motion";
import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { billingService } from "@/features/billing/billing.service";

import { fadeInUp, staggerContainer } from "../../utils";

const PaymentMethod = () => {
  const queryClient = useQueryClient();
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
      await queryClient.invalidateQueries({ queryKey: ["billing", "payment-methods"] });
    },
    onError: (e: any) => toast.error(String(e?.message ?? "Failed to update payment method")),
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => billingService.removePaymentMethod(id),
    onSuccess: async () => {
      toast.success("Payment method removed");
      await queryClient.invalidateQueries({ queryKey: ["billing", "payment-methods"] });
    },
    onError: (e: any) => toast.error(String(e?.message ?? "Failed to remove payment method")),
  });

  const methodsRaw = (methodsQuery.data as any)?.items ?? (methodsQuery.data as any)?.data;
  const methods = Array.isArray(methodsRaw) ? methodsRaw : [];
  const defaultMethod = methods.find((m: any) => !!m?.isDefault) ?? methods[0];

  return (
    <motion.section
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      <motion.h2
        variants={fadeInUp}
        className="text-xl font-light tracking-tight text-foreground lg:text-2xl"
      >
        Payment method
      </motion.h2>
      <motion.p variants={fadeInUp} className="mt-3 text-muted-foreground">
        Manage your payment details
      </motion.p>

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
            {methods.map((m: any, idx: number) => {
              const isDefault = !!m?.isDefault;
              const brand = String(m?.brand ?? m?.type ?? "Payment");
              const last4 = m?.last4 ? String(m.last4) : "";
              const label = last4 ? `${brand} ending in ${last4}` : brand;
              return (
                <div
                  key={m?.id ?? idx}
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
                        {m?.type ? String(m.type).toUpperCase() : ""}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!isDefault ? (
                      <Button
                        variant="outline"
                        disabled={setDefaultMutation.isPending}
                        onClick={() => setDefaultMutation.mutate(String(m.id))}
                      >
                        Set default
                      </Button>
                    ) : null}
                    <Button
                      variant="outline"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      disabled={removeMutation.isPending || isDefault}
                      onClick={() => removeMutation.mutate(String(m.id))}
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
    </motion.section>
  );
};

export default PaymentMethod;
