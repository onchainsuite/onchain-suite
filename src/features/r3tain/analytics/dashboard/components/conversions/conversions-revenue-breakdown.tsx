"use client";

interface ConversionsRevenueBreakdownProps {
  selectedChannel: "all" | "email" | "sms";
  emailRevenue: number;
  smsRevenue: number;
  emailPercentage: number;
  smsPercentage: number;
}

export function ConversionsRevenueBreakdown({
  selectedChannel,
  emailRevenue,
  smsRevenue,
  emailPercentage,
  smsPercentage,
}: ConversionsRevenueBreakdownProps) {
  return (
    <div className="space-y-4">
      <h4 className="text-foreground font-medium">
        Revenue by channel breakdown
      </h4>
      <div className="space-y-3">
        {selectedChannel !== "sms" && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">Email</span>
            <div className="text-right">
              <div className="text-foreground text-sm font-medium">
                {emailPercentage}%
              </div>
              <div className="text-foreground text-sm font-medium">
                ${emailRevenue.toLocaleString()}
              </div>
            </div>
          </div>
        )}
        {selectedChannel !== "email" && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">SMS</span>
            <div className="text-right">
              <div className="text-foreground text-sm font-medium">
                {smsPercentage}%
              </div>
              <div className="text-foreground text-sm font-medium">
                ${smsRevenue.toLocaleString()}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
