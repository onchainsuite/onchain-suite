import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { isJsonObject } from "@/lib/utils";

import { fadeInUp, staggerContainer } from "../../utils";
import { billingService } from "@/features/billing/billing.service";

const InvoiceHistory = () => {
  const invoicesQuery = useQuery({
    queryKey: ["billing", "invoices", { page: 1, limit: 10 }],
    queryFn: () => billingService.listInvoices({ page: 1, limit: 10 }),
    retry: false,
    refetchOnWindowFocus: false,
  });

  const invoicesData: unknown = invoicesQuery.data;
  const itemsRaw = isJsonObject(invoicesData)
    ? Array.isArray(invoicesData.items)
      ? invoicesData.items
      : Array.isArray(invoicesData.data)
        ? invoicesData.data
        : undefined
    : undefined;
  const items = Array.isArray(itemsRaw) ? itemsRaw : [];

  const formatMoney = (inv: unknown) => {
    const obj = isJsonObject(inv) ? inv : {};
    const { amount } = obj;
    const currency =
      typeof obj.currency === "string" ? obj.currency.toUpperCase() : "";
    if (typeof amount === "number")
      return `${currency} ${amount.toFixed(2)}`.trim();
    if (typeof amount === "string") return `${currency} ${amount}`.trim();
    return "—";
  };

  const formatDate = (inv: unknown) => {
    const obj = isJsonObject(inv) ? inv : {};
    const v = obj.issuedAt ?? obj.createdAt ?? obj.date;
    if (!v) return "—";
    const d = new Date(String(v));
    if (Number.isNaN(d.getTime())) return String(v);
    return d.toLocaleDateString();
  };

  const onDownload = async (invoiceId: string) => {
    try {
      const res = await billingService.getInvoiceDownloadUrl(invoiceId);
      const url =
        isJsonObject(res) && typeof res.url === "string"
          ? res.url
          : isJsonObject(res) && typeof res.downloadUrl === "string"
            ? res.downloadUrl
            : null;
      if (!url) {
        toast.error("No download link available for this invoice.");
        return;
      }
      window.open(String(url), "_blank", "noopener,noreferrer");
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Failed to download invoice";
      toast.error(message);
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
            {items.map((invoice, idx: number) => (
              <motion.div
                key={String(
                  (isJsonObject(invoice) ? invoice.id : undefined) ?? idx
                )}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="grid grid-cols-4 items-center gap-4 border-b border-border/40 px-6 py-4 last:border-0 hover:bg-muted/50"
              >
                <div className="font-medium text-foreground">
                  {(() => {
                    const obj = isJsonObject(invoice) ? invoice : undefined;
                    const number = obj?.number;
                    if (typeof number === "string" && number.length > 0) {
                      return number;
                    }
                    const id = obj?.id;
                    if (typeof id === "string" && id.length > 0) {
                      return id;
                    }
                    return "—";
                  })()}
                </div>
                <div className="text-muted-foreground">
                  {formatDate(invoice)}
                </div>
                <div className="text-foreground">{formatMoney(invoice)}</div>
                <div className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground/50 hover:text-primary hover:bg-primary/10"
                    onClick={() =>
                      onDownload(
                        String(isJsonObject(invoice) ? invoice.id : "")
                      )
                    }
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
