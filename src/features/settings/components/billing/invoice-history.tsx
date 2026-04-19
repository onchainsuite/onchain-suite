import { motion } from "framer-motion";
import { Download } from "lucide-react";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { billingService } from "@/features/billing/billing.service";

import { fadeInUp, staggerContainer } from "../../utils";

const InvoiceHistory = () => {
  const invoicesQuery = useQuery({
    queryKey: ["billing", "invoices", { page: 1, limit: 10 }],
    queryFn: () => billingService.listInvoices({ page: 1, limit: 10 }),
    retry: false,
    refetchOnWindowFocus: false,
  });

  const itemsRaw =
    (invoicesQuery.data as any)?.items ?? (invoicesQuery.data as any)?.data;
  const items = Array.isArray(itemsRaw) ? itemsRaw : [];

  const formatMoney = (inv: any) => {
    const amount = inv?.amount;
    const currency = inv?.currency ? String(inv.currency).toUpperCase() : "";
    if (typeof amount === "number") return `${currency} ${amount.toFixed(2)}`.trim();
    if (typeof amount === "string") return `${currency} ${amount}`.trim();
    return "—";
  };

  const formatDate = (inv: any) => {
    const v = inv?.issuedAt ?? inv?.createdAt ?? inv?.date;
    if (!v) return "—";
    const d = new Date(String(v));
    if (Number.isNaN(d.getTime())) return String(v);
    return d.toLocaleDateString();
  };

  const onDownload = async (invoiceId: string) => {
    try {
      const res = await billingService.getInvoiceDownloadUrl(invoiceId);
      const url = (res as any)?.url ?? (res as any)?.downloadUrl ?? null;
      if (!url) {
        toast.error("No download link available for this invoice.");
        return;
      }
      window.open(String(url), "_blank", "noopener,noreferrer");
    } catch (e: any) {
      toast.error(String(e?.message ?? "Failed to download invoice"));
    }
  };

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
        Invoices
      </motion.h2>
      <motion.p variants={fadeInUp} className="mt-3 text-muted-foreground">
        View and download your billing history
      </motion.p>

      <motion.div
        variants={fadeInUp}
        className="mt-8 border-t border-border/60 pt-8 lg:mt-10 lg:pt-10"
      >
        {invoicesQuery.isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading invoices...
          </div>
        ) : invoicesQuery.isError ? (
          <div className="text-center py-8 text-muted-foreground">
            Failed to load invoices.
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/60 bg-card p-8 text-center text-sm text-muted-foreground">
            No invoices yet.
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-border/60 bg-card">
            <div className="grid grid-cols-4 gap-4 border-b border-border/40 bg-muted/50 px-6 py-4 text-sm font-medium text-muted-foreground">
              <div>Invoice</div>
              <div>Date</div>
              <div>Amount</div>
              <div className="text-right">Download</div>
            </div>
            {items.map((invoice: any, idx: number) => (
              <motion.div
                key={String(invoice?.id ?? idx)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="grid grid-cols-4 items-center gap-4 border-b border-border/40 px-6 py-4 last:border-0 hover:bg-muted/50"
              >
                <div className="font-medium text-foreground">
                  {invoice?.number ?? invoice?.id ?? "—"}
                </div>
                <div className="text-muted-foreground">{formatDate(invoice)}</div>
                <div className="text-foreground">{formatMoney(invoice)}</div>
                <div className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground/50 hover:text-primary hover:bg-primary/10"
                    onClick={() => onDownload(String(invoice.id))}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.section>
  );
};

export default InvoiceHistory;
