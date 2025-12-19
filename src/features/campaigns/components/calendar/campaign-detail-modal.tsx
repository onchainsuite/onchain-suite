import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/ui/dialog";

import { cn } from "@/lib/utils";

import type { Campaign } from "../../../campaigns/types";
import {
  getCampaignStatusColor,
  getCampaignTypeColor,
} from "../../../campaigns/utils/campaign";

interface CampaignDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date | null;
  campaigns: Campaign[];
}

export function CampaignDetailModal({
  open,
  onOpenChange,
  selectedDate,
  campaigns,
}: CampaignDetailModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">
            Campaigns on{" "}
            {selectedDate?.toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          {campaigns.map((campaign) => (
            <Card
              key={campaign.id}
              className="border-border bg-card rounded-xl overflow-hidden"
            >
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1 flex-1">
                      <h3 className="text-lg font-semibold text-foreground">
                        {campaign.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {campaign.subject}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={cn(
                          "rounded-lg px-3 py-1",
                          getCampaignStatusColor(campaign.status)
                        )}
                      >
                        {campaign.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border">
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase">
                        Type
                      </p>
                      <Badge
                        variant="outline"
                        className={cn(
                          "rounded-lg",
                          getCampaignTypeColor(campaign.type)
                        )}
                      >
                        {campaign.type}
                      </Badge>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase">
                        Recipients
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {campaign.recipients.toLocaleString()}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase">
                        Audience
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {campaign.audience.map((aud, i) => (
                          <Badge
                            // eslint-disable-next-line react/no-array-index-key
                            key={`${aud}-${i}`}
                            variant="secondary"
                            className="rounded-lg text-xs"
                          >
                            {aud}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase">
                        Created
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {campaign.createdAt.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>

                    {campaign.scheduledFor && (
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground uppercase">
                          Scheduled For
                        </p>
                        <p className="text-sm font-medium text-foreground">
                          {campaign.scheduledFor.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    )}

                    {campaign.sentAt && (
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground uppercase">
                          Sent At
                        </p>
                        <p className="text-sm font-medium text-foreground">
                          {campaign.sentAt.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Performance Metrics */}
                  {(campaign.openRate !== undefined ||
                    campaign.clickRate !== undefined) && (
                    <div className="pt-4 border-t border-border">
                      <p className="text-xs font-medium text-muted-foreground uppercase mb-3">
                        Performance
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        {campaign.openRate !== undefined && (
                          <div className="space-y-1">
                            <p className="text-2xl font-bold text-foreground">
                              {campaign.openRate}%
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Open Rate
                            </p>
                          </div>
                        )}
                        {campaign.clickRate !== undefined && (
                          <div className="space-y-1">
                            <p className="text-2xl font-bold text-foreground">
                              {campaign.clickRate}%
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Click Rate
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
