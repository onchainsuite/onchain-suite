"use client";

interface DeliveryDetailsSidebarProps {
  totals: {
    emailsSent: number;
    deliveries: number;
    bounces: number;
    unsubscribed: number;
    abuseReports: number;
  };
  selectedMetric: string;
}

export function DeliveryDetailsSidebar({
  totals,
  selectedMetric,
}: DeliveryDetailsSidebarProps) {
  return (
    <div className="space-y-4">
      <h4 className="text-foreground font-medium">
        {selectedMetric === "abuse-report-rate"
          ? "Delivery details"
          : "Delivery details"}
      </h4>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">Emails sent</span>
          <span className="text-foreground text-sm font-medium">
            {totals.emailsSent.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">Deliveries</span>
          <span className="text-foreground text-sm font-medium">
            {totals.deliveries.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">Bounces</span>
          <span className="text-foreground text-sm font-medium">
            {totals.bounces.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">Unsubscribed</span>
          <span className="text-foreground text-sm font-medium">
            {totals.unsubscribed.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">Abuse reports</span>
          <span className="text-foreground text-sm font-medium">
            {totals.abuseReports.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
