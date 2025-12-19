import { CAMPAIGN_TYPE_LABELS } from "../../../campaigns/constants/campaign-filters";
import type { Campaign } from "../../../campaigns/types";

interface CampaignTypeCellProps {
  type: Campaign["type"];
}

export function CampaignTypeCell({ type }: CampaignTypeCellProps) {
  return (
    <div className="text-sm text-foreground capitalize">
      {CAMPAIGN_TYPE_LABELS[type] || type}
    </div>
  );
}
